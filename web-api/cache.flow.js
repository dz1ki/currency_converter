import https from "https";
import { CASH_FILE_PATH, EXCHANGE_URL } from "./constants.js";
import fs from "fs";
import { mappedGetOneFilial } from "./mappers.js";

/**
 * The function saves the file in the format .json.
 * @constructor
 * @param {Object} data
 */

export const fileWriter = (data) => {
  fs.writeFileSync(CASH_FILE_PATH, Buffer.from(JSON.stringify(data)), (err) => {
    if (err) {
      console.log("Error in writing cash file");
    } else {
      console.log("Cash file writed");
    }
  });
};

/**
 * The function compares the current date by the date key with the date in the object.
 * @constructor
 * @param {Object} cash
 * @returns {Boolean} - if more than 3 hours fasle otherwise true.
 */

export const checkExportDate = (cash) => {
  const { DATE } = cash;
  const cashedDate = new Date(DATE);
  const now = new Date();
  const diff = now.getTime() - cashedDate.getTime();
  const hoursDiff = Math.floor(diff / (1000 * 60 * 60));
  if (hoursDiff > 3) {
    return false;
  } else {
    return true;
  }
};

/**
 * Function reads .json file.
 * @constructor
 * @returns {Object} - returns an object.
 */

export const getCashedExchange = () => {
  try {
    const cash = fs.readFileSync(CASH_FILE_PATH, "utf-8");
    if (!cash) {
      return false;
    }
    return JSON.parse(cash);
  } catch (e) {
    return false;
  }
};

/**
 * The function creates a new object by adding date fields.
 * @constructor
 * @param {Object} exchangesObject
 * @returns {Object}  returns an object.
 */

export const exchangeObjectMapper = (exchangesObject) => {
  const responseObject = {
    USD: parseFloat(exchangesObject.USD_out),
    EUR: parseFloat(exchangesObject.EUR_out),
    RUB: parseFloat(exchangesObject.RUB_out) / 100,
    PLN: parseFloat(exchangesObject.PLN_out) / 10,
    GBP: parseFloat(exchangesObject.GBP_out),
    DATE: String(new Date()),
  };
  return responseObject;
};

/**
 * Downloads a file from a third-party service converts it to an object.
 * @constructor
 * @returns {Array} - returns an array
 */

export let httpRequest = async () => {
  return new Promise(async (resolve, reject) => {
    console.log("Exchange rate update...");
    let data = "";
    let request = https.request(EXCHANGE_URL, (response) => {
      response.on("data", (chunk) => {
        data = data + chunk.toString();
      });

      response.on("end", () => {
        let result = JSON.parse(data);
        resolve(result);
        console.log("Updated..");
      });
    });
    request.on("error", (error) => {
      console.log("An error", error);
      reject(error);
    });
    request.end();
  });
};
/**
 * Checks for file caching, downloads and updates if necessary.
 * @constructor
 * @returns {Object} - returns object
 */

export const checkFile = async () => {
  const cash = getCashedExchange();
  let isActual;
  if (!cash) {
  } else {
    isActual = checkExportDate(cash);
  }
  let mappedExchangeObject;
  if (!isActual) {
    const data = await httpRequest();
    const oneFilial = mappedGetOneFilial(data);
    mappedExchangeObject = exchangeObjectMapper(oneFilial);
    fileWriter(mappedExchangeObject);
  } else {
    mappedExchangeObject = getCashedExchange();
  }
  return mappedExchangeObject;
};
