import http from "http";
import { exchangeRates } from "./exchangeRates.js";
import { PORT } from "./constants.js";

http
  .createServer((request, response) => {
    let data = "";
    request.on("data", (chunk) => {
      data += chunk;
    });
    request.on("end", async () => {
      try {
        const result = await exchangeRates(JSON.parse(data));
        response.end(result);
      } catch (error) {
        const errorString = JSON.stringify(error);
        response.end(errorString);
      }
    });
  })
  .listen(PORT, () => console.log(`Server start port:${PORT}`));
