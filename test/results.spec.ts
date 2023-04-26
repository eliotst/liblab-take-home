import resultSet from "../src/results";
import _httpFetch from "../src/http";
import { movieInFactory, quoteInFactory } from "./factories";
import { convertMovieIn } from "../src/models";

jest.mock("../src/http");

const httpFetch = jest.mocked(_httpFetch);

describe("resultSet", () => {
  beforeEach(() => {
    httpFetch.mockReset();
  });
  it("it fetches data", async () => {
    const accessToken = "foo";
    const movies = [
      movieInFactory(),
      movieInFactory(),
      movieInFactory(),
      movieInFactory(),
      movieInFactory(),
    ];
    // Mock the call to our fetch function and validate params are what we expect
    httpFetch.mockImplementationOnce((params) => {
      expect(params.accessToken).toBe(accessToken);
      expect(params.resource).toBe("movie");
      return Promise.resolve({
        docs: movies.slice(0, 3),
        total: 5,
        limit: 3,
      });
    });
    const results = await resultSet({
      accessToken: accessToken,
      resource: "movie",
      mapper: convertMovieIn,
      limit: 3,
    });
    // Verify our total is set properly
    expect(results.total).toBe(5);
    // Verify that the result set thinks we have more data
    expect(results.hasNext).toBe(true);
    // Verify we got our canned data back
    expect(results.data.length).toBe(3);
  });
  it("fetches more data", async () => {
    const accessToken = "foo";
    const movies = [
      movieInFactory(),
      movieInFactory(),
      movieInFactory(),
      movieInFactory(),
      movieInFactory(),
    ];
    // Mock the first call to our fetch function and validate params are what we expect
    httpFetch.mockImplementationOnce((params) => {
      expect(params.accessToken).toBe(accessToken);
      expect(params.resource).toBe("movie");
      return Promise.resolve({
        docs: movies.slice(0, 3),
        total: 5,
        limit: 3,
      });
    });
    // Mock the next call to our fetch function and validate params are what we expect
    httpFetch.mockImplementationOnce((params) => {
      expect(params.accessToken).toBe(accessToken);
      expect(params.resource).toBe("movie");
      return Promise.resolve({
        docs: movies.slice(3),
        total: 5,
        limit: 3,
      });
    });
    const results = await resultSet({
      accessToken: accessToken,
      resource: "movie",
      mapper: convertMovieIn,
      limit: 3,
    });
    // Verify our total is set properly
    expect(results.total).toBe(5);
    // Verify that the result set thinks we have more data
    expect(results.hasNext).toBe(true);
    // Verify we got our canned data back
    expect(results.data.length).toBe(3);
    const nextResults = await results.fetchNextPage();
    // Verify our total is set properly
    expect(nextResults.total).toBe(5);
    // Verify that the result set thinks we have more data
    expect(nextResults.hasNext).toBe(false);
    // Verify we got our canned data back
    expect(nextResults.data.length).toBe(2);
  });
});
