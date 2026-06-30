import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { ClimateMap } from '@/components/dashboard/climate-map'
import { ClimateCharts } from '@/components/dashboard/climate-charts'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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
        {/* Mission Control Title */}
        <div className="space-y-2 border-b border-primary/10 pb-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Climate Intelligence Command Center
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Real-time environmental monitoring powered by AI. Track temperature, air quality, water levels, and
            agricultural indicators across India.
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Data Visualization Charts */}
        <ClimateCharts />

        {/* Climate Map */}
        <ClimateMap />

        {/* Action Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-primary/20 bg-gradient-to-br from-card/50 to-background/50 hover:border-primary/40 transition-colors">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Scenario Modeling
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Run AI-powered climate simulations. Predict impacts of temperature rise, extreme weather events, droughts,
              and floods.
            </p>
            <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-semibold">
              Launch Scenarios
            </button>
          </div>

          <div className="p-6 rounded-lg border border-primary/20 bg-gradient-to-br from-card/50 to-background/50 hover:border-primary/40 transition-colors">
            <h3 className="text-lg font-semibold text-primary mb-2">
              Data Analytics
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Deep dive into historical climate data. Analyze trends, correlations, and anomalies across seasons.
            </p>
            <button className="px-4 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-semibold">
              View Analytics
            </button>
          </div>
        </div>

        {/* Data Sources */}
        <div className="p-6 rounded-lg border border-primary/20 bg-card/30">
          <h3 className="text-lg font-semibold text-primary mb-4">Data Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'IMD', desc: 'Indian Meteorological Department' },
              { name: 'CWC', desc: 'Central Water Commission' },
              { name: 'CPCB', desc: 'Central Pollution Control Board' },
              { name: 'Bhuvan', desc: 'ISRO Geospatial Platform' },
            ].map((source) => (
              <div key={source.name} className="p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors">
                <div className="font-semibold text-primary text-sm mb-1">
                  {source.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {source.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
