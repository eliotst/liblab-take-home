import * as commandLineArgs from "command-line-args";
import oneApiClient, { FilterRule, matchFilter } from "..";

/**
 * Command line tool for fetching data from The One API.
 *
 * Examples
 * --------
 *
 * Get all movies sorted by alphabetically by name:
 * > node get-data.js movie --token my-token --sort name
 *
 * Get info about "The Return of the King":
 * > node get-data.js movie --token my-token --match name="The Return of the King"
 *
 * Find up to 5 quotes about Samwise Gamgee:
 * > node get-data.js quote --token my-token --filter "dialog=/Sam/" --limit 5
 */
async function main() {
  const options = commandLineArgs(
    [
      { name: "id", alias: "i", type: String },
      { name: "token", alias: "t", type: String },
      { name: "limit", alias: "l", type: String },
      { name: "offset", alias: "o", type: String },
      { name: "sort", alias: "s", type: String },
      { name: "direction", alias: "d", type: String },
      { name: "match", alias: "m", type: String, multiple: true },
      // Catch all for our other filters to reduce the surface of our command line args
      // For more info on expected value here, see:
      // https://the-one-api.dev/documentation#5
      { name: "filter", alias: "f", type: String, multiple: true },
    ],
    { partial: true }
  );

  const client = oneApiClient({ accessToken: options.token });
  if (!options._unknown || options._unknown.length !== 1) {
    console.error("Usage: get-data.ts <model-type> [<options>]");
    console.error('Please provide one <model-type>, e.g. "movie"');
    process.exit(1);
  }
  if (options.id !== undefined) {
    // Since we have only two data types, a simple ternary operator will do;
    // we'll have to make this a switch as we add more types
    const fetcher =
      options._unknown[0] === "movie" ? client.fetchMovie : client.fetchQuote;
    const results = await fetcher(options.id);
    console.log(results);
  } else {
    // Since we have only two data types, a simple ternary operator will do;
    // we'll have to make this a switch as we add more types
    const fetcher =
      options._unknown[0] === "movie" ? client.fetchMovies : client.fetchQuotes;
    const filters: FilterRule[] = [];
    if (options.match) {
      options.match.forEach((match: string) => {
        const [name, ...rest] = match.split("=");
        filters.push(matchFilter(name, rest.join("=")));
      });
    }
    if (options.filter) {
      options.filter.forEach((filter: string) => {
        filters.push(filter);
      });
    }
    const results = await fetcher({
      limit: options.limit,
      offset: options.offset,
      sortBy: options.sort,
      sortDirection: options.dir,
      filters,
    });
    console.log(results);
  }
}

main();
