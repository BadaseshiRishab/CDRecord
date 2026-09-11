import { useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { formatCurrency, formatDateTime, formatDuration } from '../lib/format'

const PAGE_SIZE = 10

export function CallLogsTable({ records }) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const sorted = [...records].sort(
      (a, b) => new Date(b.callStartTime ?? 0).getTime() - new Date(a.callStartTime ?? 0).getTime()
    )

    const q = query.trim().toLowerCase()
    if (!q) return sorted

    return sorted.filter(
      (record) =>
        record.callerName.toLowerCase().includes(q) ||
        record.city.toLowerCase().includes(q) ||
        record.callerNumber.toLowerCase().includes(q)
    )
  }, [records, query])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <Card className="overflow-hidden border-white/10 bg-slate-950/40">
      <CardHeader className="flex flex-col gap-3 border-b border-border/60 bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">Recent Call Logs</CardTitle>
          <CardDescription>
            {filtered.length} of {records.length} records
          </CardDescription>
        </div>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setPage(1)
          }}
          placeholder="Search by caller, number, or city..."
          className="w-full rounded-xl border border-border/80 bg-slate-900/80 px-3 py-2 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground focus:border-primary/70 focus:bg-slate-900 sm:w-72"
        />
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-900/50 hover:bg-slate-900/50">
                <TableHead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Caller Name</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Caller Number</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Receiver Number</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">City</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Duration</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Cost</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Start Time</TableHead>
                <TableHead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pageRows.map((record) => (
                <TableRow key={record.id} className="border-b border-border/60 transition-colors hover:bg-slate-900/40">
                  <TableCell className="font-medium text-foreground">{record.callerName}</TableCell>
                  <TableCell className="text-muted-foreground">{record.callerNumber}</TableCell>
                  <TableCell className="text-muted-foreground">{record.receiverNumber}</TableCell>
                  <TableCell>{record.city}</TableCell>
                  <TableCell>{formatDuration(record.callDuration)}</TableCell>
                  <TableCell>{formatCurrency(record.callCost)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(record.callStartTime)}</TableCell>
                  <TableCell>
                    <Badge variant={record.callStatus ? 'success' : 'destructive'}>
                      {record.callStatus ? 'Success' : 'Failed'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}

              {pageRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                    No call records match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-sm text-muted-foreground">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-border bg-slate-900 px-3 py-1.5 text-foreground transition hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-border bg-slate-900 px-3 py-1.5 text-foreground transition hover:border-primary/60 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
