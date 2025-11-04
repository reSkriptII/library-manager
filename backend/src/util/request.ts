type Normalized<Value> = { valid: true; value: Value } | { valid: false };

function normalizedToIntArray(param: unknown): Normalized<number[]>;
function normalizedToIntArray(
  param: unknown,
  nullAllowed: false
): Normalized<number[]>;
function normalizedToIntArray(
  param: unknown,
  nullAllowed: true
): Normalized<number[] | null>;
function normalizedToIntArray(
  param: unknown,
  nullAllowed: boolean = false
): Normalized<number[] | null> {
  if (!param)
    return nullAllowed ? { valid: true, value: null } : { valid: false };

  const list = Array.isArray(param) ? param : [param];
  for (const value in list) {
    if (!Number.isInteger(value)) {
      return { valid: false };
    }
  }
  return { valid: true, value: list as number[] };
}

export { normalizedToIntArray };
