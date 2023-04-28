import * as commandLineArgs from "command-line-args";
import theOneApiClient, { regexFilter } from "..";

/**
 * Command line tool for fetching data from The One API.
 */
async function main() {
  const options = commandLineArgs(
    [
      { name: "accessToken", alias: "t", type: String },
      { name: "dialog", alias: "d", type: String },
      { name: "limit", alias: "l", type: String },
    ],
    { partial: true }
  );

  const client = theOneApiClient({ accessToken: options.accessToken });

  const quotes = await client.fetchQuotes({
    filters: [regexFilter("dialog", new RegExp(options.dialog))],
    limit: options.limit,
  });
  quotes.data.forEach(async (quote) => {
    const movie = await client.fetchMovie(quote.movieId);
    if (movie === null) {
      console.log(`From unknown movie: ${quote.dialog}`);
    } else {
      console.log(`From "${movie.name}": ${quote.dialog}`);
    }
  });
}

main();
