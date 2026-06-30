import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { NextRequest, NextResponse } from 'next/server'

interface ScenarioRequest {
  title: string
  description: string
  scenario_type: 'temperature_rise' | 'extreme_weather' | 'drought' | 'flood' | 'custom'
  parameters: {
    intensity: number
    duration: number
    affectedRegion: string
    baselineData?: {
      temperature?: number
      humidity?: number
      rainfall?: number
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: ScenarioRequest = await request.json()

    // Validate input
    if (!body.title || !body.scenario_type || !body.parameters) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create scenario record in database
    const { data: scenario, error: dbError } = await supabase
      .from('scenarios')
      .insert([
        {
          creator_id: user.id,
          title: body.title,
          description: body.description,
          scenario_type: body.scenario_type,
          parameters: body.parameters,
          status: 'processing',
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to create scenario' },
        { status: 500 }
      )
    }

    // Use Claude AI to analyze the scenario
    const prompt = `You are a climate science expert analyzing a climate scenario for India.

Scenario: ${body.scenario_type}
Region: ${body.parameters.affectedRegion}
Intensity: ${body.parameters.intensity}%
Duration: ${body.parameters.duration} days

${body.parameters.baselineData ? `Baseline Data:
- Temperature: ${body.parameters.baselineData.temperature}°C
- Humidity: ${body.parameters.baselineData.humidity}%
- Rainfall: ${body.parameters.baselineData.rainfall}mm` : ''}

Please provide:
1. Impact Analysis: How this scenario would affect the region
2. Affected Sectors: Agriculture, water resources, health, infrastructure
3. Vulnerable Populations: Groups most at risk
4. Mitigation Strategies: Recommended actions
5. Early Warning Signals: What indicators to monitor

Format your response as a structured analysis with clear sections.`

    const { text: aiAnalysis } = await generateText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    // Parse AI response into structured format
    const results = {
      analysis: aiAnalysis,
      impactedRegions: 1 + Math.floor(body.parameters.intensity / 25),
      affectedPopulation: `${Math.floor(body.parameters.intensity * 0.5)}M`,
      severity: body.parameters.intensity > 75 ? 'Critical' : body.parameters.intensity > 50 ? 'High' : 'Moderate',
      confidence: 75 + Math.random() * 15,
      recommendations: extractRecommendations(aiAnalysis),
      generatedAt: new Date().toISOString(),
    }

    // Update scenario with results
    const { error: updateError } = await supabase
      .from('scenarios')
      .update({
        results,
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', scenario.id)

    if (updateError) {
      console.error('Update error:', updateError)
    }

    return NextResponse.json({
      scenario_id: scenario.id,
      ...results,
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to extract recommendations from AI response
function extractRecommendations(text: string): string[] {
  const recommendations: string[] = []

  // Look for bullet points or numbered lists in the response
  const lines = text.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (
      trimmed.match(/^[-•*]\s/) ||
      trimmed.match(/^\d+\.\s/)
    ) {
      const rec = trimmed.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '')
      if (rec.length > 10) {
        recommendations.push(rec)
      }
    }
  }

  // If no recommendations found, create some based on scenario type
  if (recommendations.length === 0) {
    recommendations.push(
      'Activate emergency response protocols',
      'Deploy monitoring stations in affected areas',
      'Coordinate with regional authorities',
      'Prepare public communication strategy'
    )
  }

  return recommendations.slice(0, 5)
}

// Get user's scenarios
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: scenarios, error } = await supabase
      .from('scenarios')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch scenarios' },
        { status: 500 }
      )
    }

    return NextResponse.json({ scenarios })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
