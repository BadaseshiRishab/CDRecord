import { RefreshCw } from 'lucide-react'

export function DashboardHeader({ onRefresh, loading, lastUpdated }) {
  return (
    <header className="mb-5 rounded-[1.6rem] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.45)] backdrop-blur-md sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
            Operations overview
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Call Analytics Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time insights from Call Data Records (CDR)
            {lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ''}
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
    </header>
  )
}
