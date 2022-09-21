import https from "https";
import { CASH_FILE_PATH, EXCHANGE_URL, BASE_CURRENCY } from "./constants.js";
import fs from "fs";

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
 * The function gets the first object from the array of objects.
 * @constructor
 * @returns {Object} - returns an object.
 */

export const getOneFilial = (data) => {
  return data[0];
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
 * The function deletes the key DATE.
 * @constructor
 * @param {Object} mappedExchangeObject
 * @returns {Object} - returns new object
 */

export const mappedDelkey = (mappedExchangeObject) => {
  const res = { ...mappedExchangeObject };
  delete res.DATE;
  return res;
};

/**
 * Function remove key add key.
 * @constructor
 * @param {Array} params
 * @param {Object} mappedExchangeObject
 * @returns {Object} - returns new object
 */

const mappedDelkeyAddKey = (params, mappedExchangeObject) => {
  const res = { ...mappedExchangeObject };
  delete res[params[0].value];
  res[BASE_CURRENCY] = 1;
  return res;
};

/**
 * Function add key.
 * @constructor
 * @param {Object} mappedDelkeyObject
 * @returns {Object} - returns new object
 */

const mappedAddKeyBase = (mappedDelkeyObject) => {
  const res = { ...mappedDelkeyObject };
  res[BASE_CURRENCY] = 1;
  return res;
};

/**
 * Checks if there is a value, if not, returns an error.
 * @constructor
 * @param {Number} costСurrency
 * @returns {Object} - returns Error
 */

const ceckСurrency = (costСurrency) => {
  if (!costСurrency) {
    throw `Unknown currency`;
  }
};

/**
 * Iterates over an object fetches a value by key.
 * @constructor
 * @param {String} params - key name.
 * @param {Object} mappedExchangeObject -iterable object.
 * @returns {Number} - returns value.
 */

const getValueOfOneCurrency = (params, mappedExchangeObject) => {
  let costСurrency = null;
  for (const сurrency in mappedExchangeObject) {
    if (сurrency === params) {
      costСurrency = mappedExchangeObject[сurrency];
    }
  }
  return costСurrency;
};

/**
 * Checks for the existence of a key and returns its value.
 * @constructor
 * @param {String} params - key name.
 * @param {Object} mappedExchangeObject - checked object.
 * @returns {Number} - returns value.
 */

const valueOfOneCurrency = (params, mappedExchangeObject) => {
  const costСurrency = getValueOfOneCurrency(params, mappedExchangeObject);
  ceckСurrency(costСurrency);
  return costСurrency;
};

/**
 * Сonsiders the ratio of the base currency to others.
 * @constructor
 * @param {Object} transformObject - object.
 * @param {Number} costСurrency - object : currencies with their meaning.
 * @returns {Object} - returns object with calculated relation .
 */

const relationToOtherCurrencies = (transformObject, costСurrency) => {
  let resultСurrency = {};
  for (const element in transformObject) {
    resultСurrency[element] = costСurrency / transformObject[element];
  }
  return resultСurrency;
};

/**
 * Сhecks if the value is not the base one with the parameter base ,if true return an error.
 * @constructor
 * @param {Array} params - array.
 * @returns {Object} - error.
 */

const baseValueCheck = (params) => {
  if (params[0].value === BASE_CURRENCY) {
    throw `Parameter 'base' cannot be with a value ${params[0].value}`;
  }
};

/**
 * The function calculates the relation to the currency returns the object and the calculated values.
 * @constructor
 * @param {Array} params - array.
 * @param {Object} mappedExchangeObject - the value of currencies.
 * @returns {Object} - calculated ratio.
 */

const relationToAnotherCurrency = (params, mappedExchangeObject) => {
  baseValueCheck(params);
  const costСurrency = valueOfOneCurrency(
    params[0].value,
    mappedExchangeObject
  );
  const transformObject = mappedDelkeyAddKey(params, mappedExchangeObject);
  const resultСurrency = relationToOtherCurrencies(
    transformObject,
    costСurrency
  );
  return resultСurrency;
};

/**
 * Сheck the value of the parameter "to" if it is not present, assign the base value.
 * @constructor
 * @param {Array} params - array.
 * @returns {String} - return  value parameter "to".
 */

const parameterToCheck = (params) => {
  let to = params[1].value;
  if (!params[1].value) {
    to = BASE_CURRENCY;
  }
  return to;
};

/**
 * Function converts currency.
 * @constructor
 * @param {Array} params - array.
 * @param {Object} mappedDelkeyObject - object with currencies and their values.
 * @returns {String} - return string ".
 */

const currencyConverter = (params, mappedDelkeyObject) => {
  const transformObject = mappedAddKeyBase(mappedDelkeyObject);
  const parametrTo = parameterToCheck(params);
  const spliеValue = params[0].value.split(" ");
  const costСurrencyCalc = valueOfOneCurrency(spliеValue[1], transformObject);
  const costСurrencyTo = valueOfOneCurrency(parametrTo, transformObject);
  const rate = costСurrencyCalc / costСurrencyTo;
  const summ = spliеValue[0] * rate;
  return ` ${spliеValue[0]} ${spliеValue[1]} = ${summ} ${parametrTo}; (rate = ${rate}) `;
};

/**
 * Converts a string object removing extra characters.
 * @constructor
 * @param {Object} object
 * @returns {String} - return string .
 */

const transformToString = (object) => {
  return JSON.stringify(object).replace(/["",{}]/g, " ");
};

/**
 * The function checks the incoming data and performs actions based on it.
 * @constructor
 * @param {Array} params
 * @param {Object} mappedDelkeyObject
 * @returns {String} - return string .
 */

export const validateReceivedParams = (params, mappedDelkeyObject) => {
  if (!params[0]) {
    return transformToString(mappedDelkeyObject);
  }
  if (params[0].param === "base") {
    const result = relationToAnotherCurrency(params, mappedDelkeyObject);
    return transformToString(result);
  }
  if (!(params[0] && params[1])) {
    return "There should be two parameters 'calc' and 'to' ";
  }
  if (params[0].param === "calc" && params[1].param === "to") {
    return currencyConverter(params, mappedDelkeyObject);
  }
  return "Invalid parameters ";
};
