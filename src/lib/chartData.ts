/**
 * Utilities to make Recharts reliably update when data changes.
 *
 * Recharts can appear "stuck" when the `data` array/object reference doesn't
 * change in the way it expects. These helpers ensure:
 * - new array/object references (deep-ish clone for JSON-safe data)
 * - a stable-ish key derived from the data values to force remount when needed
 */

export function cloneChartData<T>(data: T): T {
  // Energy/Analytics/Vision charts are plain JSON data, so this is safe.
  // If data contains Dates/functions, extend this later.
  try {
    return JSON.parse(JSON.stringify(data)) as T;
  } catch {
    return data;
  }
}

function djb2Hash(input: string): string {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  // Convert to unsigned 32-bit and base36.
  return (hash >>> 0).toString(36);
}

export function chartKeyFromData(data: unknown, prefix: string): string {
  let str = "";
  try {
    str = JSON.stringify(data) ?? "";
  } catch {
    str = String(data);
  }
  // Avoid huge keys; hash is enough.
  return `${prefix}-${djb2Hash(str)}`;
}

