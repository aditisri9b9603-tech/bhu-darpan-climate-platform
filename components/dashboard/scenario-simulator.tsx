'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ScenarioConfig {
  type: 'temperature_rise' | 'extreme_weather' | 'drought' | 'flood'
  intensity: number
  duration: number
  affectedRegion: string
}

interface ScenarioResult {
  scenario_id: string
  analysis: string
  impactedRegions: number
  affectedPopulation: string
  severity: string
  confidence: number
  recommendations: string[]
  generatedAt: string
}

const scenarioTemplates = [
  {
    type: 'temperature_rise' as const,
    label: 'Heat Wave Scenario',
    description: 'Simulate extended high temperature period',
    icon: '🔥',
    color: 'text-orange-400',
  },
  {
    type: 'extreme_weather' as const,
    label: 'Monsoon Intensity',
    description: 'Model heavy rainfall and wind patterns',
    icon: '⛈️',
    color: 'text-blue-400',
  },
  {
    type: 'drought' as const,
    label: 'Drought Simulation',
    description: 'Extended dry period analysis',
    icon: '🏜️',
    color: 'text-yellow-600',
  },
  {
    type: 'flood' as const,
    label: 'Flood Risk Modeling',
    description: 'Water level and inundation prediction',
    icon: '🌊',
    color: 'text-cyan-400',
  },
]

export function ScenarioSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioConfig | null>(null)
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<ScenarioResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleRunScenario = async (template: (typeof scenarioTemplates)[0]) => {
    const scenario: ScenarioConfig = {
      type: template.type,
      intensity: 75,
      duration: 7,
      affectedRegion: 'North India',
    }

    setSelectedScenario(scenario)
    setRunning(true)
    setError(null)

    try {
      const response = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: template.label,
          description: template.description,
          scenario_type: template.type,
          parameters: {
            intensity: scenario.intensity,
            duration: scenario.duration,
            affectedRegion: scenario.affectedRegion,
            baselineData: {
              temperature: 32,
              humidity: 45,
              rainfall: 0,
            },
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to run scenario')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('Scenario error:', err)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-card/30">
        <CardHeader>
          <CardTitle className="text-primary">AI Scenario Modeling</CardTitle>
          <CardDescription>
            Run climate simulations powered by Claude AI to predict environmental impacts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarioTemplates.map((template) => (
              <button
                key={template.type}
                onClick={() => handleRunScenario(template)}
                disabled={running}
                className="p-4 rounded-lg border border-primary/20 bg-background/50 hover:border-primary/40 hover:bg-background/80 transition-all text-left disabled:opacity-50"
              >
                <div className="flex items-start gap-3">
                  <div className={`text-2xl ${template.color}`}>{template.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{template.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedScenario && (
        <Card className="border-primary/20 bg-card/30">
          <CardHeader>
            <CardTitle className="text-primary capitalize">
              {selectedScenario.type.replace('_', ' ')} Analysis
            </CardTitle>
            <CardDescription>
              {selectedScenario.affectedRegion} • Intensity: {selectedScenario.intensity}% • Duration: {selectedScenario.duration} days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {running ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <p className="text-muted-foreground">
                  Claude AI is analyzing climate patterns...
                </p>
              </div>
            ) : results ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-background/50 border border-primary/10">
                    <p className="text-sm text-muted-foreground">Impacted Regions</p>
                    <p className="text-2xl font-bold text-primary mt-2">{results.impactedRegions}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-primary/10">
                    <p className="text-sm text-muted-foreground">Affected Population</p>
                    <p className="text-2xl font-bold text-primary mt-2">{results.affectedPopulation}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-background/50 border border-primary/10">
                    <p className="text-sm text-muted-foreground">AI Confidence</p>
                    <p className="text-2xl font-bold text-primary mt-2">{Math.round(results.confidence)}%</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background/50 border border-primary/10">
                  <h4 className="font-semibold text-foreground mb-3">AI Analysis</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-6">
                    {results.analysis}
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-background/50 border border-primary/10">
                  <h4 className="font-semibold text-foreground mb-3">AI Recommendations</h4>
                  <ul className="space-y-2">
                    {results.recommendations.slice(0, 5).map((rec: string, idx: number) => (
                      <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                        <span className="text-primary">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedScenario(null)
                      setResults(null)
                    }}
                    className="flex-1 bg-primary/20 text-primary hover:bg-primary/30"
                  >
                    Run Another Scenario
                  </Button>
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                    Export Report
                  </Button>
                </div>
              </div>
            ) : error ? (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">Error: {error}</p>
                <Button
                  onClick={() => setError(null)}
                  className="mt-3 bg-primary/20 text-primary hover:bg-primary/30"
                >
                  Try Again
                </Button>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
