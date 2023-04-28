import {
  doesntExistFilter,
  doesntMatchFilter,
  excludeFilter,
  existsFilter,
  greaterThanFilter,
  greaterThanOrEqualFilter,
  includeFilter,
  lessThanFilter,
  lessThanOrEqualFilter,
  matchFilter,
  regexFilter,
} from "../src/filters";
import { Movie } from "../src/models";

describe("filters", () => {
  describe("matchFilter", () => {
    it("generates the right filter rule", () => {
      const rule = matchFilter<Movie>("name", "The Return of the King");
      expect(rule).toEqual("name=The Return of the King");
    });
  });
  describe("doesntMatchFilter", () => {
    it("generates the right filter rule", () => {
      const rule = doesntMatchFilter<Movie>("name", "The Return of the King");
      expect(rule).toEqual("name!=The Return of the King");
    });
  });
  describe("include", () => {
    it("generates the right filter rule", () => {
      const rule = includeFilter<Movie>("name", [
        "The Return of the King",
        "The Two Towers",
      ]);
      expect(rule).toEqual("name=The Return of the King,The Two Towers");
    });
  });
  describe("exclude", () => {
    it("generates the right filter rule", () => {
      const rule = excludeFilter<Movie>("name", [
        "The Return of the King",
        "The Two Towers",
      ]);
      expect(rule).toEqual("name!=The Return of the King,The Two Towers");
    });
  });
  describe("exists", () => {
    it("generates the right filter rule", () => {
      const rule = existsFilter<Movie>("name");
      expect(rule).toEqual("name");
    });
  });
  describe("doesn't exist", () => {
    it("generates the right filter rule", () => {
      const rule = doesntExistFilter<Movie>("name");
      expect(rule).toEqual("!name");
    });
  });
  describe("regex", () => {
    it("generates the right filter rule", () => {
      const rule = regexFilter<Movie>("name", /King/i);
      expect(rule).toEqual("name=/King/i");
    });
  });
  describe("less than", () => {
    it("generates the right filter rule", () => {
      const rule = lessThanFilter<Movie>("budgetInMillions", 100);
      expect(rule).toEqual("budgetInMillions<100");
    });
  });
  describe("less than or equal", () => {
    it("generates the right filter rule", () => {
      const rule = lessThanOrEqualFilter<Movie>("budgetInMillions", 100);
      expect(rule).toEqual("budgetInMillions<=100");
    });
  });
  describe("greater than", () => {
    it("generates the right filter rule", () => {
      const rule = greaterThanFilter<Movie>("budgetInMillions", 100);
      expect(rule).toEqual("budgetInMillions>100");
    });
  });
  describe("greater than or equal", () => {
    it("generates the right filter rule", () => {
      const rule = greaterThanOrEqualFilter<Movie>("budgetInMillions", 100);
      expect(rule).toEqual("budgetInMillions>=100");
    });
  });
});
