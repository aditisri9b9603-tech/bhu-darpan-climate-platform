import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/dashboard/header'
import { getUserRole, isAdmin } from '@/lib/roles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
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

  // Fetch all users
  const { data: allProfiles } = await supabase
    .from('profiles')
    .select('id, email, role, first_name, last_name, organization, created_at')
    .order('created_at', { ascending: false })

  // Fetch access logs
  const { data: logs } = await supabase
    .from('access_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(10)

  // Fetch data sources
  const { data: sources } = await supabase
    .from('data_sources')
    .select('*')
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
                Administration Center
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                System-wide management, user administration, data source configuration, and access audit logs.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-semibold">
              Admin Access
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{allProfiles?.length || 0}</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Active Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {sources?.filter((s) => s.is_active).length || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Analysts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {allProfiles?.filter((p) => p.role === 'analyst').length || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Citizens</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                {allProfiles?.filter((p) => p.role === 'citizen').length || 0}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-primary">User Management</CardTitle>
              <CardDescription>All registered users and their access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {allProfiles && allProfiles.length > 0 ? (
                  allProfiles.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg bg-background/50 border border-primary/10 hover:border-primary/30 transition-colors flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {p.first_name} {p.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.organization && (
                          <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                            {p.organization}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded font-semibold ${
                            p.role === 'admin'
                              ? 'bg-destructive/20 text-destructive'
                              : p.role === 'analyst'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {p.role}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No users yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-primary">Management Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 justify-start">
                Manage Users
              </Button>
              <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 justify-start">
                Data Sources
              </Button>
              <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 justify-start">
                System Settings
              </Button>
              <Button className="w-full bg-primary/20 text-primary hover:bg-primary/30 justify-start">
                Export Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-primary">Data Sources</CardTitle>
              <CardDescription>Configured climate data sources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sources && sources.length > 0 ? (
                  sources.map((source) => (
                    <div key={source.id} className="p-3 rounded-lg bg-background/50 border border-primary/10">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{source.name}</p>
                          <p className="text-xs text-muted-foreground">{source.source_type}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            source.is_active
                              ? 'bg-green-400/10 text-green-400'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {source.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No sources configured</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/30">
            <CardHeader>
              <CardTitle className="text-primary">Access Audit Log</CardTitle>
              <CardDescription>Recent system activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs && logs.length > 0 ? (
                  logs.map((log) => (
                    <div key={log.id} className="p-2 rounded-lg bg-background/50 border border-primary/10 text-xs">
                      <div className="flex justify-between">
                        <p className="text-foreground font-semibold">{log.action}</p>
                        <p className="text-muted-foreground">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      {log.resource_type && (
                        <p className="text-muted-foreground text-xs">
                          {log.resource_type}: {log.resource_id?.slice(0, 8)}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
