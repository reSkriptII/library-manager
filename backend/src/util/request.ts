import { rm } from "fs/promises";
import path from "path";

type Normalized<Value> = { valid: true; value: Value } | { valid: false };

/**
 * Normalizes an input into a type-safe array of integers.
 *
 * Convert all elements to array of integers and returns a
 * structure indicating success (`{ valid: true, value: number[] }`) or failure.
 *
 * @param {unknown} param - The value(s) to normalize (e.g., number, string, array of strings/numbers).
 * @param {boolean} [nullAllowed=false] - If true, an empty or falsy input will return { valid: true, value: null }.
 * If false, it returns { valid: false }.
 * @returns {Normalized<number[] | null>} An object indicating the validation result and the normalized array, or null if allowed.
 */
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
  input: unknown,
  nullAllowed: boolean = false
): Normalized<number[] | null> {
  if (!input)
    return nullAllowed ? { valid: true, value: null } : { valid: false };

  // ensure input is array
  const list = Array.isArray(input) ? input : [input];

  // convert every element into integer. return { valid: false } on fail
  for (let i = 0; i < list.length; ++i) {
    list[i] = Number(list[i]);
    if (!Number.isInteger(list[i])) {
      return { valid: false };
    }
  }

  return { valid: true, value: list as number[] };
}
export { normalizedToIntArray };

/**
 * Delete a multer file input. Ignore failed attempt
 *
 * @param {Express.Multer.File} file - multer file object to be deleted
 */
export function cleanFile(file: Express.Multer.File | undefined) {
  if (file) {
    rm(path.resolve(file.path)).catch(() => {});
  }
}
