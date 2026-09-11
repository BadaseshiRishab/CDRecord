import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, DollarSign, Phone, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { formatCurrency, formatDuration, formatNumber } from '../lib/format'

function AnimatedValue({ value, formatter, duration = 800 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const startValue = 0
    const endValue = Number(value) || 0
    const startTime = performance.now()

    let frameId = null

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(startValue + (endValue - startValue) * eased)

      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [value, duration])

  return <span>{formatter(display)}</span>
}

function buildItems(kpis) {
  return [
    {
      label: 'Total Calls',
      value: kpis.totalCalls,
      icon: Phone,
      tone: 'text-primary',
      accent: 'from-primary/20 to-primary/5',
      formatter: (value) => formatNumber(Math.round(value)),
      animate: true,
    },
    {
      label: 'Total Call Cost',
      value: kpis.totalCost,
      icon: DollarSign,
      tone: 'text-primary',
      accent: 'from-violet-500/20 to-blue-500/5',
      formatter: (value) => formatCurrency(value),
      animate: true,
    },
    {
      label: 'Average Call Duration',
      value: kpis.averageDuration,
      icon: Clock,
      tone: 'text-primary',
      accent: 'from-cyan-500/20 to-sky-500/5',
      formatter: (value) => formatDuration(value),
      animate: false,
    },
    {
      label: 'Successful Calls',
      value: kpis.successfulCalls,
      icon: CheckCircle2,
      tone: 'text-success',
      accent: 'from-emerald-500/20 to-green-500/5',
      formatter: (value) => formatNumber(Math.round(value)),
      animate: true,
    },
    {
      label: 'Failed Calls',
      value: kpis.failedCalls,
      icon: XCircle,
      tone: 'text-destructive',
      accent: 'from-rose-500/20 to-red-500/5',
      formatter: (value) => formatNumber(Math.round(value)),
      animate: true,
    },
  ]
}

export function KpiCards({ kpis }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {buildItems(kpis).map(({ label, value, icon: Icon, tone, accent, formatter, animate }) => (
        <Card key={label} className="metric-card overflow-hidden border-white/10 bg-slate-950/40">
          <div className={`h-1.5 bg-gradient-to-r ${accent}`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {label}
            </CardTitle>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${accent} ${tone}`}>
              <Icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold tracking-tight text-white">
              {animate ? <AnimatedValue value={value} formatter={formatter} /> : formatter(value)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
