import {
  Movie,
  MovieIn,
  MovieQuote,
  QuoteIn,
  SortDirection,
  convertMovieIn,
  convertQuoteIn,
} from "./models";
import httpFetch from "./http";
import resultSet, { ResultSet } from "./results";
import { FilterRule } from "./filters";

/**
 * Fetch parameters for movies.
 */
export interface FetchParams<T> {
  limit?: number;
  offset?: number;
  sortBy?: keyof T;
  sortDirection?: SortDirection;
  filters?: FilterRule[];
}

/**
 * Client object for making requests to The One API for LotR information.
 */
export interface TheOneApiSDKClient {
  /**
   * Fetch a single movie by its ID.
   * @param id unique identifier for the movie to fetch
   */
  fetchMovie(id: string): Promise<Movie | null>;
  /**
   * Fetch multiple movies based on a set of search parameters
   * @param params parameters used to find the matching movies
   */
  fetchMovies(params?: FetchParams<Movie>): Promise<ResultSet<Movie>>;
  /**
   * Fetch a single quote by its ID.
   * @param id unique identifier for the quote to fetch
   */
  fetchQuote(id: string): Promise<MovieQuote | null>;
  /**
   * Fetch multiple quotes based on a set of search parameters
   * @param params parameters used to find the matching quotes
   */
  fetchQuotes(params?: FetchParams<MovieQuote>): Promise<ResultSet<MovieQuote>>;
}

/**
 * Options that can be used to configure a client instance.
 */
export interface TheOneApiSDKClientOptions {
  accessToken: string;
  defaultPageSize?: number;
  defaultRetries?: number;
  defaultRetryDelay?: number;
}

/**
 * Initialize an API client for The One API.
 * @param options
 * @returns {TheOneApiSDKClient}
 */
export default function theOneApiClient(
  options: TheOneApiSDKClientOptions
): TheOneApiSDKClient {
  return {
    fetchMovie: async (id: string) => {
      const result = await httpFetch<MovieIn>({
        id,
        resource: "movie",
        accessToken: options.accessToken,
        limit: 1,
        retries: options.defaultRetries,
      });
      if (result.docs.length === 0) {
        return null;
      }
      return convertMovieIn(result.docs[0]);
    },
    fetchMovies: async (params: FetchParams<Movie> = {}) => {
      return resultSet<Movie, MovieIn>({
        resource: "movie",
        accessToken: options.accessToken,
        limit: params.limit ?? options.defaultPageSize,
        offset: params.offset,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        filters: params.filters,
        retries: options.defaultRetries,
        retryDelayMs: options.defaultRetryDelay,
        mapper: convertMovieIn,
      });
    },
    fetchQuote: async (id: string) => {
      const result = await httpFetch<QuoteIn>({
        id,
        resource: "quote",
        accessToken: options.accessToken,
        limit: 1,
        retries: options.defaultRetries,
        retryDelayMs: options.defaultRetryDelay,
      });
      if (result.docs.length === 0) {
        return null;
      }
      return convertQuoteIn(result.docs[0]);
    },
    fetchQuotes: async (params: FetchParams<MovieQuote> = {}) => {
      return resultSet<MovieQuote, QuoteIn>({
        resource: "quote",
        accessToken: options.accessToken,
        limit: params.limit ?? options.defaultPageSize,
        offset: params.offset,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        filters: params.filters,
        retries: options.defaultRetries,
        retryDelayMs: options.defaultRetryDelay,
        mapper: convertQuoteIn,
      });
    },
  };
}
