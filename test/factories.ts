import { Movie, MovieIn, MovieQuote, QuoteIn } from "../src/models";

export function movieInFactory(overrides?: Partial<MovieIn>): MovieIn {
  const base = {
    _id: "5cd95395de30eff6ebccde5d",
    name: "The Return of the King",
    runtimeInMinutes: 201,
    budgetInMillions: 94,
    boxOfficeRevenueInMillions: 1120,
    academyAwardNominations: 11,
    academyAwardWins: 11,
    rottenTomatoesScore: 95,
  };
  return {
    ...base,
    ...overrides,
  };
}

export function quoteInFactory(overrides?: Partial<QuoteIn>): QuoteIn {
  const base = {
    dialog: "I didn't think it would end this way.",
    movie: "5cd95395de30eff6ebccde5d",
    character: "5cd99d4bde30eff6ebccfe2e",
    _id: "5cd96e05de30eff6ebcce84c",
  };
  return {
    ...base,
    ...overrides,
  };
}
