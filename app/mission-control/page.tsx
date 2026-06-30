import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function MissionControlPage() {
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
        {/* Mission Control Header */}
        <div className="space-y-2 border-b border-primary/10 pb-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Climate Intelligence Mission Control
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Real-time environmental monitoring command center. Track active alerts, system health, and critical climate events across India.
          </p>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xl font-bold text-green-400">Operational</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">All systems nominal</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">3</p>
              <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Data Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">24</p>
              <p className="text-xs text-muted-foreground mt-2">Active sources</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">47ms</p>
              <p className="text-xs text-muted-foreground mt-2">Average latency</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Alerts */}
        <Card className="border-primary/20 bg-card/30 border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-accent">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              Critical Alerts
            </CardTitle>
            <CardDescription>
              High priority events requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                id: 1,
                severity: 'Critical',
                location: 'Delhi NCR',
                event: 'Extreme Heat Wave',
                temp: 47,
                status: 'Active',
              },
              {
                id: 2,
                severity: 'High',
                location: 'Maharashtra',
                event: 'Monsoon Onset Tracking',
                temp: null,
                status: 'Monitoring',
              },
              {
                id: 3,
                severity: 'High',
                location: 'Karnataka',
                event: 'Water Level Alert',
                temp: null,
                status: 'Escalating',
              },
            ].map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-lg bg-background/50 border border-accent/20 hover:border-accent/40 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">
                        {alert.event}
                      </h4>
                      <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent font-semibold">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {alert.location}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      alert.status === 'Active'
                        ? 'bg-red-400/10 text-red-400'
                        : alert.status === 'Escalating'
                          ? 'bg-orange-400/10 text-orange-400'
                          : 'bg-blue-400/10 text-blue-400'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
                {alert.temp && (
                  <p className="text-sm text-foreground font-mono">
                    Temperature: {alert.temp}°C
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Regional Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-primary">Regional Status</CardTitle>
              <CardDescription>
                Environmental conditions across Indian regions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { region: 'North India', status: 'Warning', indicator: 'Heat Wave' },
                { region: 'South India', status: 'Normal', indicator: 'Stable' },
                { region: 'East India', status: 'Caution', indicator: 'Pre-Monsoon' },
                { region: 'West India', status: 'Warning', indicator: 'High Humidity' },
                { region: 'Central India', status: 'Normal', indicator: 'Stable' },
                { region: 'Northeast India', status: 'Alert', indicator: 'Heavy Rain' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 rounded-lg bg-background/50 border border-primary/10"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{item.region}</p>
                    <p className="text-xs text-muted-foreground">{item.indicator}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-semibold ${
                      item.status === 'Alert'
                        ? 'bg-red-400/10 text-red-400'
                        : item.status === 'Warning'
                          ? 'bg-orange-400/10 text-orange-400'
                          : item.status === 'Caution'
                            ? 'bg-yellow-400/10 text-yellow-400'
                            : 'bg-green-400/10 text-green-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-primary">Recent Events</CardTitle>
              <CardDescription>
                Latest environmental occurrences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                {
                  time: '14:32',
                  event: 'Heat index exceeded threshold',
                  location: 'Delhi',
                },
                {
                  time: '13:45',
                  event: 'Wind speed spike detected',
                  location: 'Rajasthan',
                },
                {
                  time: '12:18',
                  event: 'Humidity levels rising',
                  location: 'Mumbai',
                },
                {
                  time: '11:22',
                  event: 'Air quality degradation',
                  location: 'Bangalore',
                },
                {
                  time: '10:55',
                  event: 'Water level increase',
                  location: 'Kerala',
                },
                {
                  time: '09:30',
                  event: 'Temperature anomaly detected',
                  location: 'Kolkata',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-background/50 border border-primary/10 flex gap-3"
                >
                  <div className="text-xs text-primary font-mono font-semibold min-w-fit">
                    {item.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.location}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Performance */}
        <Card className="border-primary/20 bg-card/30">
          <CardHeader>
            <CardTitle className="text-primary">System Performance Metrics</CardTitle>
            <CardDescription>
              Real-time platform health indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { metric: 'CPU Usage', value: 34, unit: '%', status: 'good' },
              { metric: 'Memory', value: 62, unit: '%', status: 'good' },
              { metric: 'Database', value: 78, unit: '%', status: 'warning' },
              { metric: 'Network', value: 45, unit: '%', status: 'good' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-background/50 border border-primary/10">
                <p className="text-sm text-muted-foreground mb-3">{item.metric}</p>
                <div className="w-full bg-background rounded-full h-2 mb-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.status === 'good'
                        ? 'bg-green-400'
                        : item.status === 'warning'
                          ? 'bg-yellow-400'
                          : 'bg-red-400'
                    }`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <p className="text-lg font-bold text-primary">
                  {item.value}{item.unit}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-sm text-primary">Emergency Protocols</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full p-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 text-red-400 text-sm font-semibold transition-colors text-left">
                Activate Emergency Mode
              </button>
              <button className="w-full p-2 rounded-lg bg-orange-400/10 hover:bg-orange-400/20 text-orange-400 text-sm font-semibold transition-colors text-left">
                Escalate Alert Status
              </button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-sm text-primary">Export & Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors text-left">
                Generate Daily Report
              </button>
              <button className="w-full p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-semibold transition-colors text-left">
                Export Event Log
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
