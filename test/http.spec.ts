import httpFetch from "../src/http";
import _axios, { AxiosError } from "axios";
import { Movie } from "../src/models";
import { matchFilter } from "../src/filters";

jest.mock("axios");

const axios = jest.mocked(_axios);

describe("httpFetch", () => {
  beforeEach(() => {
    axios.get.mockReset();
  });
  it("builds the path correct when there is no id", () => {
    // Mock the API response and validate the parameters
    axios.get.mockImplementationOnce((url, config) => {
      const urlObj = new URL(url);
      expect(urlObj.host).toBe("the-one-api.dev");
      expect(urlObj.protocol).toBe("https:");
      expect(urlObj.pathname).toBe("/v2/movie");
      expect(config?.headers?.Authorization).toBe("Bearer test");
      return Promise.resolve({ data: { docs: [], total: 0 } });
    });
    // Call our function under test
    const result = httpFetch<Movie>({
      id: undefined,
      resource: "movie",
      accessToken: "test",
    });
    // Verify the result matches our canned response
    expect(result).resolves.toEqual({ docs: [], total: 0 });
  });
  it("builds the path correct when there is an id", () => {
    // Mock the API response and validate the parameters
    axios.get.mockImplementationOnce((url, config) => {
      const urlObj = new URL(url);
      expect(urlObj.host).toBe("the-one-api.dev");
      expect(urlObj.protocol).toBe("https:");
      expect(urlObj.pathname).toBe("/v2/quote/1234");
      expect(config?.headers?.Authorization).toBe("Bearer test");
      return Promise.resolve({ data: { docs: [], total: 0 } });
    });
    // Call our function under test
    const result = httpFetch<Movie>({
      id: "1234",
      resource: "quote",
      accessToken: "test",
    });
    // Verify the result matches our canned response
    expect(result).resolves.toEqual({ docs: [], total: 0 });
  });
  it("builds the path correct when pagination parameters are provided", () => {
    // Mock the API response and validate the parameters
    axios.get.mockImplementationOnce((url, config) => {
      const urlObj = new URL(url);
      expect(urlObj.host).toBe("the-one-api.dev");
      expect(urlObj.protocol).toBe("https:");
      expect(urlObj.pathname).toBe("/v2/quote");
      expect(urlObj.searchParams.get("limit")).toBe("5");
      expect(urlObj.searchParams.get("offset")).toBe("1");
      expect(config?.headers?.Authorization).toBe("Bearer test");
      return Promise.resolve({ data: { docs: [], total: 0 } });
    });
    // Call our function under test
    const result = httpFetch<Movie>({
      resource: "quote",
      accessToken: "test",
      limit: 5,
      offset: 1,
      sortDirection: "asc",
    });
    // Verify the result matches our canned response
    expect(result).resolves.toEqual({ docs: [], total: 0 });
  });
  it("builds the path correct when filter and sort parameters are provided", () => {
    // Mock the API response and validate the parameters
    axios.get.mockImplementationOnce((url, config) => {
      const urlObj = new URL(url);
      expect(urlObj.host).toBe("the-one-api.dev");
      expect(urlObj.protocol).toBe("https:");
      expect(urlObj.pathname).toBe("/v2/movie");
      expect(urlObj.searchParams.get("sort")).toBe("name:asc");
      expect(urlObj.searchParams.get("limit")).toBe("1");
      expect(urlObj.searchParams.get("name=The Return of the King")).toBe("");
      expect(config?.headers?.Authorization).toBe("Bearer test");
      return Promise.resolve({ data: { docs: [], total: 0 } });
    });
    // Call our function under test
    const result = httpFetch<Movie>({
      resource: "movie",
      accessToken: "test",
      sortBy: "name",
      sortDirection: "asc",
      filters: [matchFilter("name", "The Return of the King")],
      limit: 1,
    });
    // Verify the result matches our canned response
    expect(result).resolves.toEqual({ docs: [], total: 0 });
  });
  it("retries on error", async () => {
    // Mock the API response and validate the parameters
    axios.get
      .mockRejectedValueOnce(new Error("error"))
      .mockImplementationOnce((url, config) => {
        const urlObj = new URL(url);
        expect(urlObj.host).toBe("the-one-api.dev");
        expect(urlObj.protocol).toBe("https:");
        expect(urlObj.pathname).toBe("/v2/quote");
        expect(urlObj.searchParams.get("sort")).toBe("name:asc");
        expect(urlObj.searchParams.get("limit")).toBe("1");
        expect(config?.headers?.Authorization).toBe("Bearer test");
        return Promise.resolve({ data: { docs: [], total: 0 } });
      });
    // Record our current time
    const start = new Date();
    // Call our function under test
    const result = await httpFetch<Movie>({
      resource: "quote",
      accessToken: "test",
      sortBy: "name",
      sortDirection: "asc",
      limit: 1,
      retryDelayMs: 400,
    });
    // Verify the result matches our canned response
    expect(result).toEqual({ docs: [], total: 0 });
    // Verify we waited in between calls
    const after = new Date();
    expect(after.getTime() - start.getTime()).toBeGreaterThanOrEqual(400);
  });
  it("retries on error, but eventually errors out", async () => {
    // Mock the API response and validate the parameters
    axios.get.mockRejectedValueOnce(new Error("error"));
    axios.get.mockRejectedValueOnce(new Error("error"));
    // Record our current time
    const start = new Date();
    // Call our function under test
    const result = httpFetch<Movie>({
      resource: "quote",
      accessToken: "test",
      sortBy: "name",
      sortDirection: "asc",
      retries: 1,
      limit: 1,
      retryDelayMs: 400,
    });
    // Verify the result matches our canned response
    // await here to make sure we wait on the reject before moving on
    await expect(result).rejects.toThrow();
    // Verify we waited in between calls
    const after = new Date();
    expect(after.getTime() - start.getTime()).toBeGreaterThanOrEqual(400);
  });
  it("throws an error on invalid data", () => {
    // Mock the API response and validate the parameters
    axios.get.mockImplementationOnce((url, config) => {
      const urlObj = new URL(url);
      expect(urlObj.host).toBe("the-one-api.dev");
      expect(urlObj.protocol).toBe("https:");
      expect(urlObj.pathname).toBe("/v2/movie");
      expect(config?.headers?.Authorization).toBe("Bearer test");
      return Promise.resolve({ data: { blah: "blah" } });
    });
    // Call our function under test
    const result = httpFetch<Movie>({
      id: undefined,
      resource: "movie",
      accessToken: "test",
    });
    // Verify the result matches our canned response
    return expect(result).rejects.toThrow();
  });
});
