const DEFAULT_API_URL = 'https://69b30b45e224ec066bdb55a0.mockapi.io/api/v1/cdr'

const API_URL = import.meta.env.VITE_CDR_API_URL || DEFAULT_API_URL

function parseBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false
  }
  if (typeof value === 'number') return value !== 0
  return fallback
}

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
    callDirection: parseBoolean(raw.callDirection), // true = inbound, false = outbound
    callStatus: parseBoolean(raw.callStatus), // true = successful, false = failed
    callDuration: Number(raw.callDuration) || 0, // seconds
    callCost: Number(raw.callCost) || 0,
    callStartTime: raw.callStartTime ?? null,
    callEndTime: raw.callEndTime ?? null,
  }
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

  return data.map(normalizeRecord)
}

export { API_URL }
