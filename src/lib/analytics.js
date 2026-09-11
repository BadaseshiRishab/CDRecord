/**
 * Pure functions that turn a flat list of call records into the aggregates
 * each dashboard widget needs. Kept separate from components so they're easy
 * to unit test in isolation.
 */

export function computeKpis(records) {
  const totalCalls = records.length
  const totalCost = records.reduce((sum, r) => sum + r.callCost, 0)
  const totalDuration = records.reduce((sum, r) => sum + r.callDuration, 0)
  const averageDuration = totalCalls ? totalDuration / totalCalls : 0
  const successfulCalls = records.filter((r) => r.callStatus).length
  const failedCalls = totalCalls - successfulCalls

  return { totalCalls, totalCost, averageDuration, successfulCalls, failedCalls }
}

export function computeDurationStats(records) {
  if (records.length === 0) {
    return { longest: 0, shortest: 0, average: 0 }
  }

  const durations = records.map((r) => r.callDuration)
  const longest = Math.max(...durations)
  const shortest = Math.min(...durations)
  const average = durations.reduce((sum, d) => sum + d, 0) / durations.length

  return { longest, shortest, average }
}

export function computeCostByCity(records) {
  const byCity = new Map()

  for (const record of records) {
    const city = record.city || 'Unknown'
    const entry = byCity.get(city) ?? { city, totalCost: 0, calls: 0 }
    entry.totalCost += record.callCost
    entry.calls += 1
    byCity.set(city, entry)
  }

  return Array.from(byCity.values())
    .map((entry) => ({ ...entry, averageCost: entry.calls ? entry.totalCost / entry.calls : 0 }))
    .sort((a, b) => b.totalCost - a.totalCost)
}

export function computeCallsByCity(records) {
  const byCity = new Map()

  for (const record of records) {
    const city = record.city || 'Unknown'
    byCity.set(city, (byCity.get(city) ?? 0) + 1)
  }

  return Array.from(byCity.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
}

export function computeCallsPerDay(records) {
  const byDay = new Map()

  for (const record of records) {
    const date = record.callStartTime ? new Date(record.callStartTime) : null
    if (!date || Number.isNaN(date.getTime())) continue

    const key = date.toISOString().slice(0, 10) // YYYY-MM-DD
    byDay.set(key, (byDay.get(key) ?? 0) + 1)
  }

  return Array.from(byDay.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export function computeCallsPerHour(records) {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }))

  for (const record of records) {
    const date = record.callStartTime ? new Date(record.callStartTime) : null
    if (!date || Number.isNaN(date.getTime())) continue

    buckets[date.getHours()].count += 1
  }

  return buckets
}
