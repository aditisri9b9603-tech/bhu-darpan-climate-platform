import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function ScenariosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Fetch user's scenarios
  const { data: scenarios } = await supabase
    .from('scenarios')
    .select('*')
    .eq('creator_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-background">
      <Header
        userName={
          profile?.first_name
            ? `${profile.first_name} ${profile.last_name || ''}`.trim()
            : user.email?.split('@')[0]
        }
      />

      <div className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        <div className="space-y-2 border-b border-primary/10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Scenario Modeling Library
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                View and manage your AI-powered climate simulations. Analyze impacts, predictions, and recommendations for various environmental scenarios.
              </p>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              New Scenario
            </Button>
          </div>
        </div>

        {scenarios && scenarios.length > 0 ? (
          <div className="space-y-4">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="border-primary/20 bg-card/30 hover:border-primary/40 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg text-primary">
                          {scenario.title}
                        </CardTitle>
                        <span
                          className={`text-xs px-2 py-1 rounded font-semibold ${
                            scenario.status === 'completed'
                              ? 'bg-green-400/10 text-green-400'
                              : scenario.status === 'processing'
                                ? 'bg-blue-400/10 text-blue-400'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {scenario.status}
                        </span>
                      </div>
                      <CardDescription>{scenario.description}</CardDescription>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(scenario.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Scenario Parameters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="text-sm font-semibold text-foreground capitalize mt-1">
                        {scenario.scenario_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                      <p className="text-xs text-muted-foreground">Intensity</p>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        {scenario.parameters.intensity}%
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        {scenario.parameters.duration} days
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-background/50 border border-primary/10">
                      <p className="text-xs text-muted-foreground">Region</p>
                      <p className="text-sm font-semibold text-foreground mt-1">
                        {scenario.parameters.affectedRegion}
                      </p>
                    </div>
                  </div>

                  {/* Results */}
                  {scenario.results && (
                    <div className="p-4 rounded-lg bg-background/50 border border-primary/10 space-y-3">
                      <h4 className="font-semibold text-foreground">Results</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Impacted Regions</p>
                          <p className="text-lg font-bold text-primary">
                            {scenario.results.impactedRegions}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Affected Population</p>
                          <p className="text-lg font-bold text-primary">
                            {scenario.results.affectedPopulation}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Severity</p>
                          <p className="text-lg font-bold text-primary">
                            {scenario.results.severity}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">AI Confidence</p>
                          <p className="text-lg font-bold text-primary">
                            {Math.round(scenario.results.confidence)}%
                          </p>
                        </div>
                      </div>

                      {scenario.results.recommendations && (
                        <div>
                          <p className="text-sm font-semibold text-foreground mb-2">
                            Recommendations
                          </p>
                          <ul className="space-y-1">
                            {scenario.results.recommendations.slice(0, 3).map((rec: string, idx: number) => (
                              <li
                                key={idx}
                                className="text-xs text-muted-foreground flex gap-2"
                              >
                                <span className="text-primary">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-primary/20 text-primary hover:bg-primary/30">
                      View Details
                    </Button>
                    <Button className="flex-1 bg-primary/20 text-primary hover:bg-primary/30">
                      Export Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-primary/20 bg-card/30">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Scenarios Yet
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start modeling climate scenarios to analyze potential environmental impacts and get AI-powered recommendations.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Create Your First Scenario
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-primary/20 bg-card/30">
          <CardHeader>
            <CardTitle className="text-primary">How Scenario Modeling Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3">
              <div className="font-bold text-primary min-w-fit">1.</div>
              <div>
                <p className="font-semibold text-foreground">Select Scenario Type</p>
                <p className="text-sm text-muted-foreground">
                  Choose from heat waves, monsoons, droughts, or floods
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="font-bold text-primary min-w-fit">2.</div>
              <div>
                <p className="font-semibold text-foreground">Configure Parameters</p>
                <p className="text-sm text-muted-foreground">
                  Set intensity, duration, and affected region
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="font-bold text-primary min-w-fit">3.</div>
              <div>
                <p className="font-semibold text-foreground">Claude AI Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Get detailed impact analysis and recommendations
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="font-bold text-primary min-w-fit">4.</div>
              <div>
                <p className="font-semibold text-foreground">Export & Share</p>
                <p className="text-sm text-muted-foreground">
                  Generate reports for stakeholders and decision makers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
