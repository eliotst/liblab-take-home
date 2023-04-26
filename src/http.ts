import axios from "axios";
import Ajv from "ajv";
import { TheOneAPIError } from "./error";
import {
  defaultGlobalPageSize,
  defaultRetryDelayMs,
  defaultSortDirection,
} from "./consts";
import { FilterRule } from "./filters";

/**
 * Expected structure of the JSON response body of API calls.
 */
export interface APIResult<T> {
  docs: T[];
  total: number;
  limit: number;
}

/**
 * Parameters for the httpFetch function.
 */
export interface APIFetchParams {
  id?: string;
  accessToken: string;
  limit?: number;
  offset?: number;
  resource: string;
  sortBy?: string;
  sortDirection?: string;
  filters?: FilterRule[];
  retries?: number;
  retryDelayMs?: number;
}

const ajv = new Ajv();

/**
 * Generate an instance of our custom query string object.
 * This is implemented to work around issues where the Node URLSearchParams object wants
 * all query string parameters to be K=V .. since The One API has some filter syntax for
 * query string params that don't fit that pattern (e.g. less than, greater than, exists),
 * we just treat the filter as the K and don't need a V.
 * @returns {string} query string
 */
const queryString = () => {
  const values: Record<string, string | null> = {};
  return {
    append: (key: string, value?: string) => {
      values[key] = value ?? null;
    },
    toString: () => {
      const entries = Object.keys(values).map((key) => {
        // If value is null, this is a filter and should be sent along as a single token (there's no "=" when doing
        // exists check or greater than check for example)
        if (values[key] === null) {
          // This probably isn't right, since this will encode the operator for our filters, which includes "="
          // this works against The One API, but it seems possible that a change in their implementation might
          // result in the filter not properly parsed
          return encodeURIComponent(key);
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(values[key]!)}`;
      });
      return entries.join("&");
    },
  };
};

/**
 * JSON schema validator for checking that the response from the API matches what we expect.
 */
const apiResultValidator = ajv.compile({
  type: "object",
  properties: {
    docs: {
      type: "array",
      items: {
        type: "object",
      },
    },
    total: {
      type: "number",
    },
  },
  required: ["docs", "total"],
});

/**
 * Base URL for the current The One API.
 */
const theOneApiUrl = "https://the-one-api.dev";

/**
 * Default number of attempts to retry we should take before giving up.
 */
export const defaultRetries = 2;

/**
 * Add a delay when retrying requests.
 * @param ms milliseconds of delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Call into The One API over HTTP to fetch data.
 * @param param config parameters for API call
 * @param retryCount (optional) number of times we have already retried
 * @returns {object} JSON response data from The One API
 */
export default async function httpFetch<T>(
  params: APIFetchParams,
  retryCount?: number
): Promise<APIResult<T>> {
  const {
    id,
    resource,
    accessToken,
    limit,
    offset,
    sortBy: sortKey,
    sortDirection,
    retries,
    retryDelayMs,
    filters,
  } = params;
  // Generate our URL
  const url = new URL(`/v2/${resource}${id ? `/${id}` : ""}`, theOneApiUrl);
  // Set our URL parameters
  const queryParams = queryString();
  const queryLimit = limit ?? defaultGlobalPageSize;
  if (sortKey) {
    const direction = sortDirection ?? defaultSortDirection;
    queryParams.append("sort", `${sortKey}:${direction}`);
  }
  queryParams.append("limit", queryLimit.toString());
  if (offset) {
    queryParams.append("offset", offset.toString());
  }
  if (filters) {
    filters.forEach((filter) => {
      queryParams.append(filter, undefined);
    });
  }
  url.search = queryParams.toString();
  // Make the HTTP request
  let response;
  try {
    response = await axios.get<APIResult<T>>(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (err) {
    const retries_ = retries ?? defaultRetries;
    const count = retryCount ?? 0;
    if (count < retries_) {
      await delay(retryDelayMs ?? defaultRetryDelayMs);
      return httpFetch(params, count + 1);
    }
    if (axios.isAxiosError(err)) {
      if (err.response) {
        // Unexpected status code
        let message = "Unexpected HTTP response";
        switch (err.response.status) {
          case 429:
            message = "Rate limit reached";
            break;
        }
        return Promise.reject(new TheOneAPIError(message, err));
      } else if (err.request) {
        // connection error -- never got a response
        return Promise.reject(new TheOneAPIError("HTTP connection error", err));
      }
    }
    return Promise.reject(new TheOneAPIError("Error from The One API", err));
  }
  const apiResult = response.data;
  // Validate that the response matches the basic API schema for all endpoints
  if (!apiResultValidator(apiResult)) {
    throw new TheOneAPIError("Unexpected data from The One API");
  }
  return apiResult;
}
