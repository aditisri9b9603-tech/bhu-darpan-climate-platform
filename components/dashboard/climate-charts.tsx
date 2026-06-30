'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const temperatureData = [
  { time: '00:00', temperature: 22, humidity: 65, location: 'Delhi' },
  { time: '04:00', temperature: 18, humidity: 72, location: 'Delhi' },
  { time: '08:00', temperature: 24, humidity: 58, location: 'Delhi' },
  { time: '12:00', temperature: 32, humidity: 45, location: 'Delhi' },
  { time: '16:00', temperature: 35, humidity: 40, location: 'Delhi' },
  { time: '20:00', temperature: 28, humidity: 52, location: 'Delhi' },
]

const aiqData = [
  { time: '00:00', aqi: 120, pm25: 85, pm10: 145 },
  { time: '06:00', aqi: 145, pm25: 105, pm10: 165 },
  { time: '12:00', aqi: 95, pm25: 65, pm10: 125 },
  { time: '18:00', aqi: 110, pm25: 78, pm10: 140 },
]

const locationComparison = [
  { location: 'Delhi', temp: 35, aqi: 110, rainfall: 0 },
  { location: 'Mumbai', temp: 28, aqi: 65, rainfall: 5 },
  { location: 'Bangalore', temp: 26, aqi: 55, rainfall: 2 },
  { location: 'Kolkata', temp: 32, aqi: 95, rainfall: 8 },
  { location: 'Chennai', temp: 34, aqi: 75, rainfall: 3 },
]

export function ClimateCharts() {
  return (
    <div className="space-y-6">
      {/* Temperature & Humidity Trend */}
      <Card className="border-primary/20 bg-card/30">
        <CardHeader>
          <CardTitle className="text-primary">Temperature & Humidity Trends</CardTitle>
          <CardDescription>24-hour monitoring data from primary observation stations</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperatureData}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.18 200)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.55 0.18 200)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250 / 0.2)" />
              <XAxis dataKey="time" stroke="oklch(0.65 0.05 250)" />
              <YAxis stroke="oklch(0.65 0.05 250)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.12 0.01 250)',
                  border: '1px solid oklch(0.25 0.02 250)',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'oklch(0.95 0.02 250)' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="oklch(0.58 0.2 195)"
                strokeWidth={2}
                dot={{ fill: 'oklch(0.58 0.2 195)', r: 4 }}
                activeDot={{ r: 6 }}
                name="Temperature (°C)"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="oklch(0.5 0.15 180)"
                strokeWidth={2}
                dot={{ fill: 'oklch(0.5 0.15 180)', r: 4 }}
                activeDot={{ r: 6 }}
                name="Humidity (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Air Quality Index */}
      <Card className="border-primary/20 bg-card/30">
        <CardHeader>
          <CardTitle className="text-primary">Air Quality Index & Particulates</CardTitle>
          <CardDescription>Real-time AQI, PM2.5, and PM10 measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={aiqData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250 / 0.2)" />
              <XAxis dataKey="time" stroke="oklch(0.65 0.05 250)" />
              <YAxis stroke="oklch(0.65 0.05 250)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.12 0.01 250)',
                  border: '1px solid oklch(0.25 0.02 250)',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'oklch(0.95 0.02 250)' }}
              />
              <Legend />
              <Bar dataKey="aqi" fill="oklch(0.58 0.2 195)" name="AQI" />
              <Bar dataKey="pm25" fill="oklch(0.5 0.15 180)" name="PM2.5 (μg/m³)" />
              <Bar dataKey="pm10" fill="oklch(0.45 0.12 170)" name="PM10 (μg/m³)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Location Comparison */}
      <Card className="border-primary/20 bg-card/30">
        <CardHeader>
          <CardTitle className="text-primary">Multi-Location Comparison</CardTitle>
          <CardDescription>Current conditions across major Indian cities</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={locationComparison}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.58 0.2 195)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.58 0.2 195)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.5 0.15 180)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="oklch(0.5 0.15 180)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250 / 0.2)" />
              <XAxis dataKey="location" stroke="oklch(0.65 0.05 250)" />
              <YAxis stroke="oklch(0.65 0.05 250)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.12 0.01 250)',
                  border: '1px solid oklch(0.25 0.02 250)',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: 'oklch(0.95 0.02 250)' }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="oklch(0.58 0.2 195)"
                fillOpacity={1}
                fill="url(#tempGrad)"
                name="Temperature (°C)"
              />
              <Area
                type="monotone"
                dataKey="aqi"
                stroke="oklch(0.5 0.15 180)"
                fillOpacity={1}
                fill="url(#aqiGrad)"
                name="Air Quality Index"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Data Freshness & Coverage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-card/30">
          <CardHeader>
            <CardTitle className="text-sm text-primary">Data Freshness</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { source: 'IMD', lastUpdate: '2 min ago', readings: '2,341' },
              { source: 'CWC', lastUpdate: '5 min ago', readings: '1,892' },
              { source: 'CPCB', lastUpdate: '3 min ago', readings: '3,104' },
              { source: 'Bhuvan', lastUpdate: '8 min ago', readings: '892' },
            ].map((item) => (
              <div key={item.source} className="flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-foreground">{item.source}</p>
                  <p className="text-xs text-muted-foreground">{item.lastUpdate}</p>
                </div>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                  {item.readings}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/30">
          <CardHeader>
            <CardTitle className="text-sm text-primary">Geographic Coverage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { region: 'North India', stations: 24, active: 23 },
              { region: 'South India', stations: 18, active: 18 },
              { region: 'East India', stations: 16, active: 15 },
              { region: 'West India', stations: 20, active: 20 },
            ].map((item) => (
              <div key={item.region} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <p className="font-semibold text-foreground">{item.region}</p>
                  <span className="text-xs text-muted-foreground">
                    {item.active}/{item.stations}
                  </span>
                </div>
                <div className="w-full bg-background/50 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                    style={{
                      width: `${(item.active / item.stations) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
