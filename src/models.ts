/**
 * Valid direction values for sorting columns.
 */
export type SortDirection = "asc" | "desc";

/**
 * Incoming quote data from The One API.
 */
export interface QuoteIn {
  _id: string;
  dialog: string;
  movie: string;
  character: string;
}

/**
 * Info for a quote from a LotR movie.
 */
export interface MovieQuote {
  id: string;
  dialog: string;
  movieId: string;
  characterId: string;
}

/**
 * Info about a LotR movie.
 */
export interface Movie {
  id: string;
  name: string;
  runtimeInMinutes: number;
  budgetInMillions: number;
  boxOfficeRevenueInMillions: number;
  academyAwardNominations: number;
  academyAwardWins: number;
  rottenTomatoesScore: number;
}

/**
 * Incoming movie data from The One API.
 */
export interface MovieIn {
  _id: string;
  name: string;
  runtimeInMinutes: number;
  budgetInMillions: number;
  boxOfficeRevenueInMillions: number;
  academyAwardNominations: number;
  academyAwardWins: number;
  rottenTomatoesScore: number;
}

/**
 * Convert API quote data into our MovieQuote model.
 * @param quoteIn Incoming quote data from The One API.
 * @returns {MovieQuote}
 */
export function convertQuoteIn(quoteIn: QuoteIn): MovieQuote {
  return {
    id: quoteIn._id,
    dialog: quoteIn.dialog,
    movieId: quoteIn.movie,
    characterId: quoteIn.character,
  };
}
/**
 * Convert API movie data into our Movie model.
 * @param movieIn Incoming movie data from The One API.
 * @returns {Movie}
 */
export function convertMovieIn(movieIn: MovieIn): Movie {
  return {
    id: movieIn._id,
    name: movieIn.name,
    runtimeInMinutes: movieIn.runtimeInMinutes,
    budgetInMillions: movieIn.budgetInMillions,
    boxOfficeRevenueInMillions: movieIn.boxOfficeRevenueInMillions,
    academyAwardNominations: movieIn.academyAwardNominations,
    academyAwardWins: movieIn.academyAwardWins,
    rottenTomatoesScore: movieIn.rottenTomatoesScore,
  };
}
