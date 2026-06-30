'use client'

import { Card, CardContent } from '@/components/ui/card'

interface StatCard {
  label: string
  value: string | number
  unit?: string
  trend?: number
  icon?: string
}

const stats: StatCard[] = [
  {
    label: 'Active Data Sources',
    value: 4,
    unit: 'sources',
  },
  {
    label: 'Monitoring Locations',
    value: 0,
    unit: 'stations',
  },
  {
    label: 'Real-time Readings',
    value: 0,
    unit: 'records',
  },
  {
    label: 'AI Models',
    value: 0,
    unit: 'active',
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className="border-primary/20 bg-gradient-to-br from-card/50 to-background/50 hover:border-primary/40 transition-colors"
        >
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-xs text-muted-foreground">
                    {stat.unit}
                  </span>
                )}
              </div>
              {stat.trend !== undefined && (
                <div
                  className={`text-xs font-semibold ${
                    stat.trend > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {stat.trend > 0 ? '↑' : '↓'} {Math.abs(stat.trend)}%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
