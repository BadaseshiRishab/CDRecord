import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  BarChart3,
  CalendarRange,
  MapPinned,
  MoonStar,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  SunMedium,
} from 'lucide-react'
import { useCallRecords } from './hooks/useCallRecords'
import {
  computeCallsByCity,
  computeCallsPerDay,
  computeCallsPerHour,
  computeCostByCity,
  computeDurationStats,
  computeKpis,
} from './lib/analytics'
import { DashboardHeader } from './components/DashboardHeader'
import { KpiCards } from './components/KpiCards'
import { CallDurationChart } from './components/CallDurationChart'
import { CallCostChart } from './components/CallCostChart'
import { CallActivityTimeline } from './components/CallActivityTimeline'
import { CallsByCityChart } from './components/CallsByCityChart'
import { CallLogsTable } from './components/CallLogsTable'
import { Skeleton } from './components/ui/skeleton'
import { formatCurrency, formatDuration, formatNumber } from './lib/format'

const navigation = [
  { label: 'Overview', icon: BarChart3 },
  { label: 'Calls', icon: Phone },
  { label: 'Activity', icon: Activity },
  { label: 'Regions', icon: MapPinned },
]

const ranges = ['7D', '30D', '90D', 'YTD']

function filterRecordsByRange(records, range) {
  if (!Array.isArray(records) || records.length === 0) {
    return []
  }

  const timestamps = records
    .map((record) => (record.callStartTime ? new Date(record.callStartTime) : null))
    .filter((date) => date && !Number.isNaN(date.getTime()))

  if (timestamps.length === 0) {
    return []
  }

  const latestDate = new Date(Math.max(...timestamps.map((date) => date.getTime())))

  let startDate = new Date(latestDate)

  if (range === 'YTD') {
    startDate = new Date(latestDate.getFullYear(), 0, 1)
  } else {
    const days = { '7D': 7, '30D': 30, '90D': 90 }
    startDate.setDate(latestDate.getDate() - (days[range] ?? 30))
  }

  return records.filter((record) => {
    if (!record.callStartTime) return false

    const recordDate = new Date(record.callStartTime)
    return !Number.isNaN(recordDate.getTime()) && recordDate >= startDate
  })
}

function SummaryStrip({ kpis }) {
  const summary = useMemo(
    () => [
      { label: 'Total Calls', value: formatNumber(kpis.totalCalls) },
      { label: 'Total Cost', value: formatCurrency(kpis.totalCost) },
      { label: 'Success Rate', value: `${kpis.totalCalls ? ((kpis.successfulCalls / kpis.totalCalls) * 100).toFixed(1) : 0}%` },
      { label: 'Avg Duration', value: formatDuration(kpis.averageDuration) },
    ],
    [kpis]
  )

  return (
    <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
      {summary.map(({ label, value }) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/35 p-3 shadow-[0_10px_28px_rgba(15,23,42,0.2)]">
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</div>
          <div className="mt-2 text-xl font-bold text-white">{value}</div>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const { data, loading, error, refresh } = useCallRecords()
  const [lastUpdated, setLastUpdated] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [range, setRange] = useState('30D')
  const [selectedNav, setSelectedNav] = useState('Overview')

  useEffect(() => {
    if (!loading) setLastUpdated(new Date())
  }, [loading])

  const filteredData = useMemo(() => filterRecordsByRange(data, range), [data, range])

  const kpis = computeKpis(filteredData)
  const durationStats = computeDurationStats(filteredData)
  const costByCity = computeCostByCity(filteredData)
  const callsByCity = computeCallsByCity(filteredData)
  const perDay = computeCallsPerDay(filteredData)
  const perHour = computeCallsPerHour(filteredData)

  const showSkeleton = loading && data.length === 0

  const renderContent = () => {
    if (selectedNav === 'Calls') {
      return (
        <div className="space-y-4">
          <KpiCards kpis={kpis} />
          <CallLogsTable records={filteredData} />
        </div>
      )
    }

    if (selectedNav === 'Activity') {
      return (
        <div className="space-y-4">
          <KpiCards kpis={kpis} />
          <div className="chart-shell">
            <CallActivityTimeline perDay={perDay} perHour={perHour} />
          </div>
        </div>
      )
    }

    if (selectedNav === 'Regions') {
      return (
        <div className="space-y-4">
          <KpiCards kpis={kpis} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="chart-shell">
              <CallCostChart costByCity={costByCity} />
            </div>
            <div className="chart-shell">
              <CallsByCityChart callsByCity={callsByCity} />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <KpiCards kpis={kpis} />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="chart-shell">
            <CallDurationChart stats={durationStats} />
          </div>
          <div className="chart-shell">
            <CallCostChart costByCity={costByCity} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="chart-shell">
            <CallActivityTimeline perDay={perDay} perHour={perHour} />
          </div>
          <div className="chart-shell">
            <CallsByCityChart callsByCity={callsByCity} />
          </div>
        </div>

        <CallLogsTable records={filteredData} />
      </div>
    )
  }

  return (
    <div className={`dashboard-shell ${theme === 'dark' ? 'theme-dark' : 'theme-light'} min-h-screen px-3 py-4 sm:px-4 lg:px-5`}>
      <div className="mx-auto flex max-w-[1600px] gap-4 lg:gap-5">
        <aside
          className={`${sidebarOpen ? 'w-72' : 'w-20'} hidden min-h-[calc(100vh-2rem)] shrink-0 rounded-[1.5rem] border border-white/10 bg-slate-950/50 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.4)] backdrop-blur-xl lg:block`}
        >
          <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/40 p-2.5">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 font-bold text-white shadow-lg shadow-primary/20">
                C
              </div>
              {sidebarOpen && (
                <div className="overflow-hidden">
                  <div className="truncate text-sm font-semibold text-white">CallFlow</div>
                  <div className="truncate text-[10px] uppercase tracking-[0.14em] text-slate-400">BI Suite</div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSidebarOpen((open) => !open)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-slate-900/70 text-slate-200 hover:border-primary/60 hover:text-primary"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {sidebarOpen ? 'Workspace' : ''}
            </div>
            <nav className="space-y-1.5">
              {navigation.map(({ label, icon: Icon }) => {
                const isActive = selectedNav === label

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedNav(label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/20 to-violet-500/10 text-white shadow-[inset_0_0_0_1px_rgba(96,165,250,0.2)]'
                        : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {sidebarOpen && <span className="truncate">{label}</span>}
                  </button>
                )
              })}
            </nav>
          </div>
        </aside>

        <main className="main-panel min-w-0 flex-1">
          <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {ranges.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRange(option)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] ${
                    range === option
                      ? 'border-primary/40 bg-primary/15 text-primary'
                      : 'border-white/10 bg-slate-900/30 text-slate-300 hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarRange className="h-3.5 w-3.5" />
                    {option}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 self-start xl:self-auto">
              <button
                type="button"
                onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-slate-200 hover:border-primary/50 hover:text-primary"
              >
                {theme === 'dark' ? <SunMedium className="h-3.5 w-3.5" /> : <MoonStar className="h-3.5 w-3.5" />}
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>

          <DashboardHeader onRefresh={refresh} loading={loading} lastUpdated={lastUpdated} />

          <SummaryStrip kpis={kpis} />

          {error && (
            <div className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-sm">
              Couldn't load call data: {error.message}
            </div>
          )}

          {showSkeleton ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 w-full rounded-2xl" />
                ))}
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Skeleton className="h-80 w-full rounded-2xl" />
                <Skeleton className="h-80 w-full rounded-2xl" />
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>
    </div>
  )
}
