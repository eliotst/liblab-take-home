import httpFetch from "./http";
import { APIFetchParams } from "./http";

/**
 * Paramters used for generating a ResultSet
 */
interface ResultSetParams<T, U> extends APIFetchParams {
  mapper: (input: U) => T;
}

/**
 * Wrapper around results from a The One API call.
 */
export interface ResultSet<T> {
  /**
   * Total number of records matching the fetch parameters.
   */
  readonly total: number;
  /**
   * Number of records in the current results set.
   */
  readonly pageSize: number;
  /**
   * The current page number for this results set.
   */
  readonly currentPage: number;
  /**
   * Whether or not there is more data to fetch.
   */
  readonly hasNext: boolean;
  /**
   * The actual records from the last call to The One API.
   */
  readonly data: T[];
  /**
   * Method for pulling down the next set of results from The One API.
   * @returns {ResultSet} A result set for the next page of results.
   */
  fetchNextPage: () => Promise<ResultSet<T>>;
}

/**
 * Generate the results set for the next set from an existing result set.
 * @param results existing result set
 * @param params fetch parameters from original query
 * @returns {ResultSet}
 */
const makeNextPage = <T, U>(
  results: Omit<ResultSet<T>, "fetchNextPage">,
  params: ResultSetParams<T, U>
) => {
  return async () => {
    const nextPage = results.currentPage + 1;
    const newOffset = nextPage * results.pageSize;
    const moreDataIn = await httpFetch<U>({ ...params, offset: newOffset });
    const moreData = moreDataIn.docs.map(params.mapper);
    const newResults = {
      total: moreDataIn.total,
      data: moreData,
      pageSize: results.pageSize,
      hasNext: newOffset + results.pageSize < moreDataIn.total,
      currentPage: nextPage,
    };
    return {
      ...newResults,
      fetchNextPage: makeNextPage(newResults, params),
    };
  };
};

/**
 * Query for data using the given parameters and wrap the result in a ResultSet.
 * @param params query parameters
 * @returns {ResultSet} result set for query results
 */
export default async function resultSet<T, U>(
  params: ResultSetParams<T, U>
): Promise<ResultSet<T>> {
  const dataIn = await httpFetch<U>(params);
  const currentOffset = params.offset ?? 0;
  const result = {
    total: dataIn.total,
    data: dataIn.docs.map(params.mapper),
    pageSize: dataIn.limit,
    currentPage: currentOffset / dataIn.limit,
    hasNext: dataIn.docs.length < dataIn.total,
  };
  return {
    ...result,
    fetchNextPage: makeNextPage(result, params),
  };
}
