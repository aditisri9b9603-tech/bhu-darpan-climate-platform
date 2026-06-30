import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { getUserRole, isAnalyst } from '@/lib/roles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AnalystDashboard() {
  const supabase = await createClient()
  const role = await getUserRole()

  if (!isAnalyst(role)) {
    redirect('/')
  }

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

  // Fetch climate readings for detailed analysis
  const { data: readings } = await supabase
    .from('climate_readings')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(10)

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
                Data Analyst Console
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Advanced climate data ingestion, validation, and analysis tools. Insert verified readings and monitor data quality across all sources.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
              Analyst Access
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary">Data Ingestion</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Submit new climate readings from validated sensors and official sources.
              </p>
              <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30">
                Submit Reading
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary">Validation Queue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review and validate pending climate data submissions.
              </p>
              <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30">
                Review Data
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-primary">Quality Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Monitor data completeness and accuracy across all sources.
              </p>
              <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30">
                View Metrics
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/20 bg-card/30">
          <CardHeader>
            <CardTitle className="text-primary">Recent Climate Readings</CardTitle>
            <CardDescription>Last 10 submissions for review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {readings && readings.length > 0 ? (
                readings.map((reading) => (
                  <div
                    key={reading.id}
                    className="p-3 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {reading.temperature_celsius}°C
                          {reading.humidity_percent && ` • ${reading.humidity_percent}% RH`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reading.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                        ID: {reading.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No readings yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-primary">Data Sources Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'IMD', status: 'Connected', readings: '2,341' },
                { name: 'CWC', status: 'Connected', readings: '1,892' },
                { name: 'CPCB', status: 'Connected', readings: '3,104' },
                { name: 'Bhuvan', status: 'Connected', readings: '892' },
              ].map((source) => (
                <div key={source.name} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{source.name}</p>
                    <p className="text-xs text-muted-foreground">{source.readings} readings</p>
                  </div>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                    {source.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-primary">Validation Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p className="text-foreground">
                  <span className="font-semibold">Temperature Range:</span> -20°C to 55°C
                </p>
                <p className="text-foreground">
                  <span className="font-semibold">Humidity Range:</span> 0-100%
                </p>
                <p className="text-foreground">
                  <span className="font-semibold">AQI Range:</span> 0-500+
                </p>
                <p className="text-foreground">
                  <span className="font-semibold">Data Freshness:</span> {'<'} 1 hour
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
