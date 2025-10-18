export function extractNum(value: unknown) {
  if (value == null || isNaN(Number(value))) return null;
  return Number(value);
}
