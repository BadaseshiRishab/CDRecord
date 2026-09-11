import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'

const COLORS = [
  '#60a5fa',
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#f87171',
  '#22d3ee',
  '#f472b6',
  '#94a3b8',
]

export function CallsByCityChart({ callsByCity }) {
  const top = callsByCity.slice(0, 6)
  const otherCount = callsByCity.slice(6).reduce((sum, entry) => sum + entry.count, 0)
  const data = otherCount > 0 ? [...top, { city: 'Other', count: otherCount }] : top
  const totalCalls = data.reduce((sum, entry) => sum + entry.count, 0)
  const centerLabel = { label: 'Calls', value: totalCalls }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">Calls by City</CardTitle>
        <CardDescription>Distribution of call volume across cities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="city"
                innerRadius={52}
                outerRadius={86}
                paddingAngle={3}
                stroke="rgba(15, 23, 42, 0.7)"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={entry.city} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid rgba(148,163,184,0.2)',
                  borderRadius: 12,
                  color: '#e2e8f0',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="rounded-full border border-white/10 bg-slate-900/80 px-4 py-2 text-center shadow-[0_8px_20px_rgba(15,23,42,0.35)]">
              <div className="text-sm font-medium text-slate-200">{centerLabel.label}: {centerLabel.value}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
