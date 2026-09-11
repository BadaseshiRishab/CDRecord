import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { formatCurrency } from '../lib/format'

export function CallCostChart({ costByCity }) {
  const data = costByCity.slice(0, 8)
  const totalCost = costByCity.reduce((sum, c) => sum + c.totalCost, 0)
  const totalCalls = costByCity.reduce((sum, c) => sum + c.calls, 0)
  const avgCostPerCall = totalCalls ? totalCost / totalCalls : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">Call Cost Analytics</CardTitle>
          <CardDescription>Total call cost by city (top 8)</CardDescription>
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>Avg cost / call</div>
          <div className="text-sm font-semibold text-foreground">{formatCurrency(avgCostPerCall)}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
              <XAxis
                dataKey="city"
                tick={{ fontSize: 11, fill: '#cbd5e1' }}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.4)' }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#cbd5e1' }}
                axisLine={{ stroke: 'rgba(148, 163, 184, 0.4)' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: 12,
                  color: '#e2e8f0',
                }}
              />
              <Bar dataKey="totalCost" fill="url(#costBarGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="costBarGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
