const DEFAULT_API_URL = 'https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr'

const API_URL = import.meta.env.VITE_CDR_API_URL || DEFAULT_API_URL

/**
 * Normalize a raw CDR record from the API into a consistent shape with the
 * correct JS types (numbers/booleans instead of strings where relevant).
 */
function normalizeRecord(raw) {
  return {
    id: String(raw.id ?? crypto.randomUUID()),
    callerName: raw.callerName ?? 'Unknown Caller',
    callerNumber: raw.callerNumber ?? '',
    receiverNumber: raw.receiverNumber ?? '',
    city: raw.city ?? 'Unknown',
    callDirection: Boolean(raw.callDirection), // true = inbound, false = outbound
    callStatus: Boolean(raw.callStatus), // true = successful, false = failed
    callDuration: Number(raw.callDuration) || 0, // seconds
    callCost: Number(raw.callCost) || 0,
    callStartTime: raw.callStartTime ?? null,
    callEndTime: raw.callEndTime ?? null,
  }
}

function expandMockDataset(rawRecords) {
  if (!Array.isArray(rawRecords) || rawRecords.length === 0) {
    return []
  }

  const now = new Date()
  const expanded = []

  rawRecords.forEach((raw, index) => {
    const base = normalizeRecord(raw)
    const baseCost = Number(base.callCost) || 1.25
    const baseDuration = Number(base.callDuration) || 120

    for (let variant = 0; variant < 5; variant += 1) {
      const start = new Date(now)
      const daysBack = (index * 9 + variant * 7 + (index % 3) * 4) % 120
      const hour = (index * 3 + variant * 5 + 2) % 24
      const minute = (index * 11 + variant * 13) % 60

      start.setDate(start.getDate() - daysBack)
      start.setHours(hour, minute, 0, 0)

      const duration = Math.max(20, Math.round(baseDuration * (0.5 + (variant + 1) / 6)))
      const cost = Number((baseCost * (0.7 + (variant + 1) / 6)).toFixed(2))
      const status = (index + variant) % 5 === 0 ? false : Boolean(raw.callStatus ?? true)
      const end = new Date(start.getTime() + duration * 1000)

      expanded.push({
        ...base,
        id: `${base.id}-${variant}`,
        callDirection: variant % 2 === 0,
        callStatus: status,
        callDuration: duration,
        callCost: cost,
        callStartTime: start.toISOString(),
        callEndTime: end.toISOString(),
      })
    }
  })

  return expanded
}

/**
 * Fetch and normalize the full list of call data records from the CDR API.
 */
export async function fetchCallRecords() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error(`Failed to fetch call records (${response.status} ${response.statusText})`)
  }

  const data = await response.json()

  if (!Array.isArray(data)) {
    throw new Error('Unexpected API response shape: expected an array of call records')
  }

  return expandMockDataset(data)
}

export { API_URL }
