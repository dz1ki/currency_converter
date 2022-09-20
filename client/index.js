import { transformParamTerminal } from "./transform.param.terminal.js";
import http from "http";

/**
 * The function sends an array of objects to the server for processing and waits for the execution result.
 * @constructor
 */

const postParram = async () => {
  new Promise(async (resolve, reject) => {
    let result;
    try {
      result = transformParamTerminal();
    } catch (error) {
      console.log(error);
      return;
    }
    const data = JSON.stringify(result);
    const options = {
      hostname: "localhost",
      port: 3001,
      path: "/",
      method: "POST",
    };
    const req = http.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);
      res.on("data", (data) => {
        resolve(data);
        process.stdout.write(data);
      });
    });
    req.on("error", (error) => {
      reject(error);
      console.error(error);
    });
    req.write(data);
    req.end();
  });
};

postParram();
