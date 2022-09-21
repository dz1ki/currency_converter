## Description

Console utility for viewing current exchange rates.
Features:
Divided into 2 microservices, communication takes place over the http protocol.

1. "accepts-command"
   1.1.Accepts commands from the terminal.
   1.2.Validates commands.
   1.3.Sends the validated data as an array of objects.

2. "web-api"
   2.1.Accepts a request.
   2.2.Validates the request.
   2.3.Count.
   2.4.Sends a response.
   2.5.Gets data about current rates from a third-party API.
   2.6.When receiving courses, the data is saved in the cache - a json file.
   2.7.If more than 3 hours have passed, the json file is updated.
   2.8.Implemented using pure js, without any additional npm libraries.

## Running the app

```bash
# You need to download the code from the repository.

# Start the server:
node server/index.js

# Display exchange rates in relation to BYN:
node client/index.js

# Displays the rate in relation to the currency specified in the parameters (in relation to USD):
node client/index.js --base="USD"

# Currency conversion. Returns a string indicating the translation and course:
node client/index.js --calc="100 USD" --to="EUR"

```
