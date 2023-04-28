## Overall design

### Architecture

I structured the library into two main components: a user-facing client (`theOneApiClient` in [client.ts](src/client.ts)) and an internal method for actually calling into The One API (`fetchHttp` in [http.ts](src/http.ts)). All of the other modules are in service of these two pieces.

Structuring the library in this way afforded me the following benefits:

- **Separation of concerns** - The One SDK is a thin abstraction around The One API. `theOneApiClient` function creates the facade that developers use to interact with the abstraction, and the `fetchHttp` method does the work of translating that abstraction into the HTTP calls to The One API. Separating this work results in more coherent code and helped keep me from making a mess of the abstraction.
- **Code reuse** - since The One API has a fairly standard interface across resources (movies, quotes, etc), I could use the `fetchHttp` method for movies and quotes. The client then only has to worry about a few resource-specific things (namely the endpoint path and any data mapping).
- **Testability** - With these two layers, it was easy to mock out interactions with The One API. Since the `fetchHttp` function has a narrower focus, I can easily mock out the underlying Axios HTTP calls and be confident I am testing it well (especially if I were to add integration testing, which I did not do due to time limits). Once I had tested `fetchHttp`, I could then easily mock it out when testing `theOneApiClient` methods.

### Design considerations

When thinking through the design of the SDK library, I had two categories of concerns: external, user facing concerns and internal, developer (me) facing concerns. In general, I tend to prioritize external facing concerns since I figure my job is to workaround any internal issues -- but both are important when designing software.

For the external concerns, I prioritized the following:

- **Clarity** - I wanted to make sure that it was clear to the user how to use the SDK. I tried to provide useful examples in the README.md, sample scripts, and JSDoc documentation (in code -- not yet exported to HTML / .md docs). Additionally, when handling errors, I tried to make sure that users saw something more helpful than `cannot read property 'X' of undefined` or a giant Axios response error.
- **Convenience** - A primary reason users install and use an SDK library is convenience. I wanted The One SDK to make it easier for users to interact with The One API. One goal I had was to reduce the burden of common operations (e.g. paginating through results, retrying failed queries).
- **Coherence** - I find abstractions in code can be tricky. It's easy to create a clean abstraction only to find out that it doesn't cover an important use case of the underlying technology. Worse, it's easy to let the underlying concepts leak through and force users to have to understand both your abstraction and the thing you are trying to abstract. One way I have found to avoid this problem is to make sure my abstractions are fairly thin. For this project, one goal I had was to avoid the user from having to look up information in The One API's documentation, hoping that my code and documentation would be enough for them be able to get what they need from the API.

Internal considerations (many of which were called out in the assignment):

- **Testability** - As I discussed above, testability was central to my architectural design of the SDK. Being able to easily validate that the code does what you think it does is crucial in any software project. However, I find that focusing on testability can often result in code with good separation of concerns, is more modular, and is well written. Well written tests can also serve as good supporting documentation for the code. I do not always aim for 100% code coverage, but I've never regretted added more tests to a project.
- **Readability** - I think one of the most important qualities of any codebase is its readable. Readability comes from many things, including: good naming, good API documentation, commenting around key decisions and important parts of the code. TypeScript as a language also helps. The goal for me is to ensure that whoever looks at the code next (another developer or even me 2 weeks from now) can understand what the intentions and expecations are. It's easy to overestimate how obvious your intentions are when writing code.
- **Extensibility** - Since I only implemented two of the endpoints from The One API, there is obviously more to add to complete the SDK. However, when working on any coding project, extensibility is usually a key requirement. Earlier in my career, I thought making software "extensible" meant trying to future proof it by predicting all of the ways it might change and baking options into the design at the beginning. This approach often resulted in a bunch of work and complexity that was unneeded, or worse actually made the code less extensible. These days, I focus more on not "backing myself into a corner" -- not making decisions that prevent future change.

### Some key decisions

- **Single record endpoints** - For fetching for a specific record, I implemented `fetchMovie` and `fetchQuote` as convenience methods separate from the multiple fetch / `ResultSet` based `fetchMovies` and `fetchQuotes`. Given a specific identity, it seemed easier for the user to just return a record or `null` and avoid making them check `ResultSet`
- **Normalize fields** - In the name of consistency, I did minor mapping of fields from The One API's schema to The One SDK's models. For example, I renamed `_id` to `id` to ensure consistency across models (the `/movie` endpoint returned `_id` and the `/quote` endpoint returned both `_id` and `id`.) I also renamed the `movie` and `character` fields to `movieId` and `characterId` to signal that these values were ID's and not the movie / character data itself.
- **Data validation** - I validate the response from The One API using a JSON schema and the Ajv library. I do this to ensure that my code is less likely to throw random `cannot read property` exceptions trying to process data from the API. I chose not to implement model-specific validation due to time constraints, but that could be a future improvement.
- **ResultSet** - In order to make it easier to page through the data coming back from the API, I added a simple iterator-like object to let the user easily pull down all records matching a query without having to track limits, offsets, etc.
- **FilterRule** - I wanted to add a simple abstraction around the filtration syntax of The One API. In the name of making a coherent SDK, I didn't want users to have to look to The One API documentation to figure out how to add filters to the query. So I created the `FilterRule` interface and corresponding functions to provide a simple API for generating filters that can be added to the `fetchXs` calls.
- **Retries** - Depending on the API, unexpected errors while calling an HTTP endpoint can be common enough to be an issue. Simple retry logic is usually fairly straightforward to implement, so I baked a simple retry in. I avoided getting to complex for this version (e.g., no progressive backoff, no circuit breaker, etc.), but I wanted to put in something to handle occasional blips.

## Further improvements

Given more time and barring explicit user feedback, I would want to look into the following:

- **Integration testing** - When working with APIs (and databases), it's hard to beat good integration testing. Unit testing can help easily validate basic assumptions, but the only way to truely validate your code is to make live calls. For this project, I leaned heavily on curl and the [get-data.ts](samples/get-data.ts) to poke the API as I went .. but having good automated integration tests would be helpful moving forward.
- **More data validation** - The SDK shouldn't hand the user bad data -- it should catch any invalid data from the API first. I am validating the bare minimum to ensure I don't explode, but given more time, model-specific validation would be useful.
- **API Documentation** - I wrote the README.md and I added JSDoc in the code, but I don't have any external API documentation (either .md or .html) for users to read. To get more details on the interfaces, syntax, etc., users will have to dive into the code right now, which isn't ideal. I started to explore `jsdoc2md` as a quick and dirty solution, but it started to feel like a rabbit hole, so I punted on this problem in the name of time.
- **More sample scripts** - Having more samples to illustrate how to use the library and to think through use cases would probably help evolve the SDK.
- **Query string generation** - I hand generate the query string for the URL to support The One API's syntax for filter search parameters. The `URLSearchParameters` class in the Node standard library wanted there to always be an `=`, which made it hard to do the exists / not exists filters. I am not 100% sure my solution is as robust as it could be, so I would want to revisit it given more time.
- **Better mapping** - I hand generated the functions to map from the API schema to my data models. As we add more models, it might make sense to use a third party mapper.. but for now, this works.
