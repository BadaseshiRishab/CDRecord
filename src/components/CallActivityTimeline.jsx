import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { cn } from '../lib/utils'

export function CallActivityTimeline({ perDay, perHour }) {
  const [view, setView] = useState('day')

  const data = useMemo(() => {
    if (view === 'hour') {
      return perHour.map((bucket) => ({
        label: `${String(bucket.hour).padStart(2, '0')}:00`,
        count: bucket.count,
      }))
    }

    return perDay.map((bucket) => ({
      label: new Date(bucket.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: bucket.count,
    }))
  }, [view, perDay, perHour])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">Call Activity Timeline</CardTitle>
          <CardDescription>Call volume {view === 'hour' ? 'by hour of day' : 'by day'}</CardDescription>
        </div>
        <div className="flex rounded-lg border border-border p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setView('day')}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium transition-colors',
              view === 'day' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            )}
          >
            By Day
          </button>
          <button
            type="button"
            onClick={() => setView('hour')}
            className={cn(
              'rounded-md px-2.5 py-1 font-medium transition-colors',
              view === 'hour' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            )}
          >
            By Hour
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#cbd5e1' }}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.4)' }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#cbd5e1' }}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.4)' }}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: 12,
                  color: '#e2e8f0',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={{ fill: '#22d3ee', r: 3 }}
                activeDot={{ r: 6, fill: '#67e8f9' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
