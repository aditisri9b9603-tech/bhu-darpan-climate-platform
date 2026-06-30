import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUserRole, isAdmin } from '@/lib/roles'

export default async function ModerationPage() {
  const supabase = await createClient()
  const role = await getUserRole()

  if (!isAdmin(role)) {
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

  // Fetch pending validations
  const { data: pendingData } = await supabase
    .from('climate_readings')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(10)

  // Fetch flagged submissions
  const { data: flaggedData } = await supabase
    .from('climate_readings')
    .select('*')
    .eq('status', 'flagged')
    .order('created_at', { ascending: false })
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Data Quality & Moderation
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Review submissions, validate data quality, and manage user-generated content. Ensure platform integrity and data accuracy.
          </p>
        </div>

        {/* Moderation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {pendingData?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-2">submissions awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Flagged Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {flaggedData?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground mt-2">anomalies detected</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Data Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-400">96.2%</p>
              <p className="text-xs text-muted-foreground mt-2">platform average</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Analyst Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">4.8/5</p>
              <p className="text-xs text-muted-foreground mt-2">contributor ratings</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Pending vs Flagged */}
        <div className="space-y-6">
          {/* Pending Submissions */}
          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-primary">Pending Submissions</CardTitle>
              <CardDescription>
                Awaiting admin validation and approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingData && pendingData.length > 0 ? (
                pendingData.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {item.temperature_celsius}°C
                          {item.humidity_percent && ` • ${item.humidity_percent}% RH`}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted:{' '}
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-400/10 text-blue-400 px-2 py-1 rounded">
                        Pending
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-green-400/10 text-green-400 hover:bg-green-400/20 text-xs h-8">
                        Approve
                      </Button>
                      <Button className="flex-1 bg-red-400/10 text-red-400 hover:bg-red-400/20 text-xs h-8">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">
                    No pending submissions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flagged Data */}
          <Card className="border-accent/20 bg-card/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <div className="h-2 w-2 rounded-full bg-accent" />
                Flagged Anomalies
              </CardTitle>
              <CardDescription>
                Data quality issues requiring investigation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {flaggedData && flaggedData.length > 0 ? (
                flaggedData.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-background/50 border border-accent/20 hover:border-accent/40 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          Anomaly Detected
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Data Point:{' '}
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                        <p className="text-xs text-accent mt-1">
                          Reason: Outside expected range
                        </p>
                      </div>
                      <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded font-semibold">
                        Flagged
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div className="p-2 rounded bg-background/50 border border-primary/10">
                        <p className="text-muted-foreground">Value</p>
                        <p className="font-semibold text-foreground">
                          {item.temperature_celsius}°C
                        </p>
                      </div>
                      <div className="p-2 rounded bg-background/50 border border-primary/10">
                        <p className="text-muted-foreground">Expected</p>
                        <p className="font-semibold text-foreground">
                          20-35°C
                        </p>
                      </div>
                      <div className="p-2 rounded bg-background/50 border border-primary/10">
                        <p className="text-muted-foreground">Variance</p>
                        <p className="font-semibold text-accent">+22%</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-primary/20 text-primary hover:bg-primary/30 text-xs h-8">
                        Accept Data
                      </Button>
                      <Button className="flex-1 bg-red-400/10 text-red-400 hover:bg-red-400/20 text-xs h-8">
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground text-sm">
                    No flagged anomalies
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Validation Rules */}
        <Card className="border-primary/20 bg-card/30">
          <CardHeader>
            <CardTitle className="text-primary">Data Validation Rules</CardTitle>
            <CardDescription>
              Criteria used to assess data quality and identify anomalies
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Temperature Range',
                rule: '-20°C to 55°C',
                status: 'Active',
              },
              {
                name: 'Humidity Range',
                rule: '0% to 100%',
                status: 'Active',
              },
              {
                name: 'AQI Range',
                rule: '0 to 500+',
                status: 'Active',
              },
              {
                name: 'Rainfall Threshold',
                rule: '0 to 500mm/day',
                status: 'Active',
              },
              {
                name: 'Data Freshness',
                rule: 'Max 2 hours old',
                status: 'Active',
              },
              {
                name: 'Duplicate Detection',
                rule: 'Same reading within 5 min',
                status: 'Active',
              },
            ].map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg bg-background/50 border border-primary/10"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {rule.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rule.rule}
                    </p>
                  </div>
                  <span className="text-xs bg-green-400/10 text-green-400 px-2 py-1 rounded">
                    {rule.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contributor Scores */}
        <Card className="border-primary/20 bg-card/30">
          <CardHeader>
            <CardTitle className="text-primary">Analyst Reputation System</CardTitle>
            <CardDescription>
              Performance metrics for data contributors and analysts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  name: 'Dr. Priya Sharma',
                  submissions: 156,
                  accuracy: 98.5,
                  rating: 4.9,
                },
                {
                  name: 'Rajesh Patel',
                  submissions: 89,
                  accuracy: 95.2,
                  rating: 4.6,
                },
                {
                  name: 'Asha Gupta',
                  submissions: 145,
                  accuracy: 97.1,
                  rating: 4.8,
                },
                {
                  name: 'Vikram Singh',
                  submissions: 62,
                  accuracy: 93.4,
                  rating: 4.4,
                },
              ].map((analyst, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-background/50 border border-primary/10 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {analyst.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {analyst.submissions} submissions • {analyst.accuracy}%
                      accurate
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {analyst.rating}
                    </p>
                    <p className="text-xs text-muted-foreground">/5 rating</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
