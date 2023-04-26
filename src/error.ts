/**
 * Error class for handling errors from TheOneAPI.
 */
export class TheOneAPIError extends Error {
  public readonly cause: Error | null;

  constructor(message: string, originalError?: unknown) {
    super(message);
    this.cause = errorify(originalError);
  }
}

/**
 * Reliably convert the exception variable from a catch block into an Error object, or
 * null if the exception variable is undefined or null.
 * @param maybeError
 * @returns {Error | null}
 */
export function errorify(maybeError?: unknown): Error | null {
  if (maybeError instanceof Error) {
    return maybeError;
  }
  if (typeof maybeError === "string") {
    return new Error(maybeError);
  }
  if (maybeError === null || maybeError === undefined) {
    return null;
  }
  return new Error(`${JSON.stringify(maybeError)}`);
}
