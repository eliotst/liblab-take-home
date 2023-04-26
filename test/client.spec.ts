import _httpFetch from "../src/http";
import theOneApi from "../src/index";
import { movieInFactory, quoteInFactory } from "./factories";

jest.mock("../src/http");

const httpFetch = jest.mocked(_httpFetch);

describe("client", () => {
  beforeEach(() => {
    httpFetch.mockReset();
  });
  describe("fetchMovie", () => {
    it("returns a movie when there's a match", () => {
      const movieId = "12345";
      const accessToken = "foo";
      const match = movieInFactory();
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBe(movieId);
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("movie");
        return Promise.resolve({
          docs: [match],
          total: 1,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchMovie(movieId);
      // Verify that we got our movie back (and that it was properly converted to our model)
      expect(result).resolves.toHaveProperty("id", match._id);
    });
    it("returns null when there's no match", () => {
      const movieId = "12345";
      const accessToken = "foo";
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBe(movieId);
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("movie");
        return Promise.resolve({
          docs: [],
          total: 0,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchMovie(movieId);
      // Verify that we got nothing back
      expect(result).resolves.toBeNull();
    });
  });
  describe("fetchMovies", () => {
    it("uses default pagination parameters when none are provided", () => {
      const accessToken = "foo";
      // Create some canned results
      const movies = [
        movieInFactory(),
        movieInFactory(),
        movieInFactory(),
        movieInFactory(),
      ];
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBeUndefined();
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("movie");
        expect(params.limit).toBeUndefined();
        expect(params.offset).toBeUndefined();
        return Promise.resolve({
          docs: movies,
          total: 100,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchMovies();
      // Verify that we got the canned results
      expect(result).resolves.toHaveProperty("total", 100);
      expect(result).resolves.toHaveProperty("data.length", 4);
    });
    it("passes in the pagination parameters when provided", () => {
      const accessToken = "foo";
      // Create some canned results
      const movies = [
        movieInFactory(),
        movieInFactory(),
        movieInFactory(),
        movieInFactory(),
      ];
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBeUndefined();
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("movie");
        expect(params.limit).toBe(5);
        expect(params.offset).toBe(1);
        return Promise.resolve({
          docs: movies,
          total: 100,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchMovies({ limit: 5, offset: 1 });
      // Verify that we got the canned results
      expect(result).resolves.toHaveProperty("total", 100);
      expect(result).resolves.toHaveProperty("data.length", 4);
    });
    it("passes in the sort and filter parameters when provided", () => {
      const accessToken = "foo";
      // Create some canned results
      const movies = [
        movieInFactory(),
        movieInFactory(),
        movieInFactory(),
        movieInFactory(),
      ];
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBeUndefined();
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("movie");
        expect(params.sortBy).toBe("name");
        expect(params.sortDirection).toBe("desc");
        expect(params.filters).toEqual(["name=/King/i"]);
        return Promise.resolve({
          docs: movies,
          total: 100,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchMovies({
        sortBy: "name",
        sortDirection: "desc",
        filters: ["name=/King/i"],
      });
      // Verify that we got the canned results
      expect(result).resolves.toHaveProperty("total", 100);
      expect(result).resolves.toHaveProperty("data.length", 4);
    });
  });
  describe("fetchQuote", () => {
    it("returns a quote when there's a match", () => {
      const quoteId = "12345";
      const accessToken = "foo";
      const match = quoteInFactory();
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBe(quoteId);
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("quote");
        return Promise.resolve({
          docs: [match],
          total: 1,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchQuote(quoteId);
      // Verify that we got our quote back (and that it was properly converted to our model)
      expect(result).resolves.toHaveProperty("id", match._id);
    });
    it("returns null when there's no match", () => {
      const quoteId = "12345";
      const accessToken = "foo";
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBe(quoteId);
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("quote");
        return Promise.resolve({
          docs: [],
          total: 0,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchQuote(quoteId);
      // Verify that we got our quote back (and that it was properly converted to our model)
      expect(result).resolves.toBeNull();
    });
  });
  describe("fetchQuotes", () => {
    it("uses default pagination parameters when none are provided", () => {
      const accessToken = "foo";
      // Create some canned results
      const quotes = [
        quoteInFactory(),
        quoteInFactory(),
        quoteInFactory(),
        quoteInFactory(),
      ];
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBeUndefined();
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("quote");
        expect(params.limit).toBeUndefined();
        expect(params.offset).toBeUndefined();
        return Promise.resolve({
          docs: quotes,
          total: 100,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchQuotes();
      // Verify that we got the canned results
      expect(result).resolves.toHaveProperty("total", 100);
      expect(result).resolves.toHaveProperty("data.length", 4);
    });
    it("passes in the pagination parameters when provided", () => {
      const accessToken = "foo";
      // Create some canned results
      const quotes = [
        quoteInFactory(),
        quoteInFactory(),
        quoteInFactory(),
        quoteInFactory(),
      ];
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBeUndefined();
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("quote");
        expect(params.limit).toBe(5);
        expect(params.offset).toBe(1);
        return Promise.resolve({
          docs: quotes,
          total: 100,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchQuotes({ limit: 5, offset: 1 });
      // Verify that we got the canned results
      expect(result).resolves.toHaveProperty("total", 100);
      expect(result).resolves.toHaveProperty("data.length", 4);
    });
    it("passes in the sort and filter parameters when provided", () => {
      const accessToken = "foo";
      // Create some canned results
      const quotes = [
        quoteInFactory(),
        quoteInFactory(),
        quoteInFactory(),
        quoteInFactory(),
      ];
      // Mock the call to our fetch function and validate params are what we expect
      httpFetch.mockImplementationOnce((params) => {
        expect(params.id).toBeUndefined();
        expect(params.accessToken).toBe(accessToken);
        expect(params.resource).toBe("quote");
        expect(params.sortBy).toBe("dialog");
        expect(params.sortDirection).toBe("desc");
        expect(params.filters).toEqual(["dialog=/Sam/i"]);
        return Promise.resolve({
          docs: quotes,
          total: 100,
          limit: 1,
        });
      });
      // Initialize our client
      const client = theOneApi({ accessToken });
      // Call our method under test
      const result = client.fetchQuotes({
        sortBy: "dialog",
        sortDirection: "desc",
        filters: ["dialog=/Sam/i"],
      });
      // Verify that we got the canned results
      expect(result).resolves.toHaveProperty("total", 100);
      expect(result).resolves.toHaveProperty("data.length", 4);
    });
  });
});
