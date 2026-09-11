import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { formatDuration } from '../lib/format'

export function CallDurationChart({ stats }) {
  const data = [
    { label: 'Shortest', seconds: stats.shortest },
    { label: 'Average', seconds: Math.round(stats.average) },
    { label: 'Longest', seconds: stats.longest },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Call Duration Analytics</CardTitle>
        <CardDescription>Shortest, average, and longest call durations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: '#cbd5e1' }}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.4)' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#cbd5e1' }}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.4)' }}
                tickFormatter={(value) => `${value}s`}
              />
              <Tooltip
                formatter={(value) => formatDuration(value)}
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: 12,
                  color: '#e2e8f0',
                }}
              />
              <Bar dataKey="seconds" fill="url(#durationBarGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="durationBarGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
