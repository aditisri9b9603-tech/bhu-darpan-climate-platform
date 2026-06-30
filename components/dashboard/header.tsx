'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface HeaderProps {
  userName?: string
}

export function Header({ userName }: HeaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="border-b border-primary/10 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">BD</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Bhu-Darpan
          </h1>
          <span className="text-xs text-muted-foreground ml-2">
            Climate Intelligence Platform
          </span>
        </div>

        <div className="flex items-center gap-4">
          {userName && (
            <div className="text-sm">
              <span className="text-muted-foreground">Welcome, </span>
              <span className="text-foreground font-semibold">{userName}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      </div>

      {/* Mission Control Status Bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-background border-t border-primary/5 text-xs">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-muted-foreground">Data Streaming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-muted-foreground">AI Monitor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">System Ready</span>
          </div>
        </div>
        <div className="text-muted-foreground">
          {new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })}
        </div>
      </div>
    </header>
  )
}
