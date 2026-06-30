'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ClimateReading {
  id: string
  location: {
    name: string
    latitude: number
    longitude: number
  }
  temperature_celsius: number
  humidity_percent: number
  air_quality_index: number
  pm25: number
}

export function ClimateMap() {
  const [readings, setReadings] = useState<ClimateReading[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch climate readings
    const fetchReadings = async () => {
      try {
        // Placeholder - will be replaced with actual API call
        setReadings([])
      } catch (error) {
        console.error('Failed to fetch readings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReadings()
  }, [])

  return (
    <Card className="border-primary/20 bg-card/50">
      <CardHeader className="border-b border-primary/10">
        <CardTitle className="flex items-center gap-2 text-primary">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Climate Data Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-muted-foreground">
              <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto mb-2" />
              Loading climate data...
            </div>
          </div>
        ) : readings.length === 0 ? (
          <div className="flex items-center justify-center h-96 border border-dashed border-primary/20 rounded-lg">
            <div className="text-center">
              <div className="text-muted-foreground text-sm">
                No climate data available yet. Data will appear here as it streams in from IMD, CWC, CPCB, and Bhuvan sources.
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readings.map((reading) => (
              <div
                key={reading.id}
                className="p-4 rounded-lg bg-background/50 border border-primary/20 hover:border-primary/40 transition-colors"
              >
                <h3 className="font-semibold text-primary mb-2">
                  {reading.location.name}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Temperature:</span>
                    <p className="text-foreground font-mono">
                      {reading.temperature_celsius}°C
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Humidity:</span>
                    <p className="text-foreground font-mono">
                      {reading.humidity_percent}%
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Air Quality:</span>
                    <p className="text-foreground font-mono">
                      {reading.air_quality_index}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">PM2.5:</span>
                    <p className="text-foreground font-mono">
                      {reading.pm25} μg/m³
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
