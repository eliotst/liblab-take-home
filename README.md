# The One SDK

[The One API](https://the-one-api.dev/) is a web API that aims to be the one API _to rule them all_. It provides detailed data about the Lorder of the Rings books and movies, including character info, quotes, and more. The One SDK aims to provide a simple client to make it easier to access The One API in JavaScript.

At this time, we have only implemented access to **movie** and **quote** data, but more is on the way!

## Getting Started

### Installation

This library is distributed through npm. In order to add it to your project, run the following from the root of your project:

```bash
> npm install es-liblab-take-home-project
```

### Getting Set up with the API

In order to use The One API SDK, you will need an API access token. If you do not already have one, you will need to [sign up](https://the-one-api.dev/sign-up) to create an account with The One API. Once you are signed up, you can find your access token on your "Account" page accessible from the menu.

### Using the SDK

In order to make calls to The One API with the SDK, you will need to initialize an SDK client with your access token.

#### Fetching Data

```javascript
import theOneAPIClient from "es-liblab-take-home-project";

// Initialize our client with our access token
const client = theOneAPIClient({ accessToken: "my-access-token" });
```

Once you have a client, you can then proceed to make calls to the API using methods like `fetchMovies` or `fetchQuotes`. These methods return a `ResultSet`, which has properties like `total` (the total number of matching records in The One API).

```javascript
// Fetch data about all of the LotR movies from The One API (promise-based)
client
  .fetchMovies()
  .then((results) => console.log(`There are ${results.total} LotR movies`));

// Fetch data about all of the LotR movies from The One API (async/await)
const results = await client.fetchMovies();
console.log(`There are still ${results.total} LotR movies`);
```

By default, the SDK will fetch 100 results for each query, but this can be configured per fetch call. The `ResultSet` has a `data` propertyth at allows you to access the records pulled down from the API.

```javascript
// Let's only return 10 results per call
const resultSet = await client.fetchMovies({ limit: 10 });

const movieTitles = resultSet.data.map((movie) => movie.name);
console.log(
  `Pulled down data for the following movies: ${movieTitles.toString()}`
);
```

#### Fetching one record

The One SDK provides convenience methods for fetching data by its unique identifier. These methods take a single argument and return the matching record or `null`.

```javascript
// Let's grab some quotes from the API
const resultSet = await client.fetchQuotes();

// Let's grab the movie for the first quote
const firstQuote = resultSet.data[0];
const movie = await client.fetchMovie(firstQuote.id);

console.log(`The quote ${quote.dialog} is from ${movie.name}`);
```

#### Pagination

The `ResultSet` object has properties to make it easier to get the next set of records for a query through its `fetchNextPage` function. Combined with the `hasNext` property, it can be easy to pull down all of the records in The One API across multiple calls. The One API has a rate limit of 100 queries per 10 minutes, so be mindful of this as you pull down data.

```javascript
// One call will only get 100 quotes, but there are way more quotes in the API's database.
let resultSet = await client.fetchQuotes({ limit: 100 });
let allQuotes = [];

// Keep fetching until there's nothing left to fetch
while (resultSet.hasNext) {
  allQuotes = allQuotes.concat(resultSet.data);
  resultSet = await resultSet.fetchNextPage();
}

console.log(`Pulled down all ${allQuotes.length} quotes from The One API`);
```

It is also possible to manage pagination yourself by calling the `fetchXs` method and passing in your own `offset`.

```javascript
const pageTwo = await client.fetchQuotes({ limit: 100, offset: 100 });
```

#### Sorting

Results from The One API can be sorted by any of the columns on the model by passing in the `sortBy` and `sortDirection` parameters to the `fetchXs` methods.

```javascript
const alphabeticalMovies = await client.fetchMovies({
  sortBy: "name",
  sortDirection: "asc",
});

const movieTitles = alphabeticalMovies.data.map((movie) => movie.name);
console.log(
  `Pulled down data for the following movies alphabetically: ${movieTitles.toString()}`
);
```

#### Filtering

It is possible to filter results when fetching results from The One API. The [filters](src/filters.ts) module has methods for defining to filter data, and these `FilterRule` can be passed into the `filter` parameter of the `fetchXs` methods. Data can be filtered by matching value, regular expression, numeric comparison, and more.

```javascript
import { matchFilter, regexFilter } from "es-liblab-take-home-project";

const returnOfTheKing = await client.fetchMovies({
  filters: matchFilter("name", "The Return Of The King"),
});
console.log(
  `The Return of the King has a Rotten Tomatoes score of ${returnOfTheKing.data[0].rottenTomatoesScore}`
);

const talkingAboutSam = await client.fetchQuotes({
  filters: regexFilter("dialog", /Sam/),
});
console.log(`There are ${talkingAboutSam.total} quotes that mention Sam.`);
```

#### Error Handling

Errors calling into The One API are raised by The One SDK as [TheOneAPIError](src/error.ts). The error includes information about what the error was, as well as any errors that were encountered (e.g. the underlying HTTP response error).

The One SDK will retry calls to The One API if an error is encountered. The `retries` and `retryDelayMs` parameters can be configured when initializing the `theOneApiClient`. By default, the SDK will retry 2 times and wait 200ms between each retry.

### Sample Scripts

We have some [sample scripts](src/samples) in TypeScript that can serve as examples on how to use the client library.

## API Documentation

Please refer to the JS Doc comments in the code for detailed documentation on the API. Formatted API documentation coming soon ...

## Testing

The SDK's tests live under the [test/](test/) folder at the root of the repository.

To run the tests, clone the repository locally and run the following from the root of the repository:

```
> npm install
> npm run test
```
