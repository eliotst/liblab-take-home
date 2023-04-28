/**
 * Type for capturing filter rules
 * For more information on filters, see:
 * https://the-one-api.dev/documentation#5
 */
export type FilterRule = string;

/**
 * Generate a filter rule for finding records with a field equal to the match value.
 * @example
 * // Filters to records with the name "The Return of the King"
 * matchFilter("name", "The Return of the King")
 * @param field name of field
 * @param matchValue value to use for filtering
 * @returns {FilterRule}
 */
export function matchFilter<T>(field: keyof T, matchValue: string): FilterRule {
  return `${field as string}=${matchValue}`;
}

/**
 * Generate a filter rule for finding records with field values not equal to the match value.
 * @param field name of field
 * @param matchValue value to use for filtering
 * @returns {FilterRule}
 */
export function doesntMatchFilter<T>(
  field: keyof T,
  matchValue: string
): FilterRule {
  return `${field as string}!=${matchValue}`;
}

/**
 * Generate a filter rule for finding records with field values equal to one of the match values.
 * @param field name of field
 * @param matchValues value to use for filtering
 * @returns {FilterRule}
 */
export function includeFilter<T>(
  field: keyof T,
  matchValues: string[]
): FilterRule {
  return `${field as string}=${matchValues.join(",")}`;
}

/**
 * Generate a filter rule for finding records that don't have field values equal to one of the match values.
 * @param field name of field
 * @param matchValues value to use for filtering
 * @returns {FilterRule}
 */
export function excludeFilter<T>(
  field: keyof T,
  matchValues: string[]
): FilterRule {
  return `${field as string}!=${matchValues.join(",")}`;
}

/**
 * Generate a filter rule for finding records that have any value for a column.
 * @param field name of field
 * @returns {FilterRule}
 */
export function existsFilter<T>(field: keyof T): FilterRule {
  return field as string;
}

/**
 * Generate a filter rule for finding records that don't have any value for a column.
 * @param field name of field
 * @returns {FilterRule}
 */
export function doesntExistFilter<T>(field: keyof T): FilterRule {
  return `!${field as string}`;
}

/**
 * Generate a filter rule for finding records whose field value matches a regex.
 * @param field name of field
 * @param regex regular expression to use for matching
 * @returns {FilterRule}
 */
export function regexFilter<T>(field: keyof T, regex: RegExp): FilterRule {
  return `${field as string}=${regex.toString()}`;
}

/**
 * Generate a filter rule for finding records whose field value is less than a specified value.
 * @param field name of field
 * @param matchValue value to compare
 * @returns {FilterRule}
 */
export function lessThanFilter<T>(
  field: keyof T,
  matchValue: number
): FilterRule {
  return `${field as string}<${matchValue.toString()}`;
}

/**
 * Generate a filter rule for finding records whose field value is less than or equal to a specified value.
 * @param field name of field
 * @param matchValue value to compare
 * @returns {FilterRule}
 */
export function lessThanOrEqualFilter<T>(
  field: keyof T,
  matchValue: number
): FilterRule {
  return `${field as string}<=${matchValue.toString()}`;
}

/**
 * Generate a filter rule for finding records whose field value is greater than a specified value.
 * @param field name of field
 * @param matchValue value to compare
 * @returns {FilterRule}
 */
export function greaterThanFilter<T>(
  field: keyof T,
  matchValue: number
): FilterRule {
  return `${field as string}>${matchValue.toString()}`;
}

/**
 * Generate a filter rule for finding records whose field value is greater than or equal to a specified value.
 * @param field name of field
 * @param matchValue value to compare
 * @returns {FilterRule}
 */
export function greaterThanOrEqualFilter<T>(
  field: keyof T,
  matchValue: number
): FilterRule {
  return `${field as string}>=${matchValue.toString()}`;
}
