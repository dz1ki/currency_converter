import { BASE_CURRENCY } from "./constants.js";
/**
 * The function gets the first object from the array of objects.
 * @constructor
 * @returns {Object} - returns an object.
 */

export const mappedGetOneFilial = (data) => {
  return data[0];
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

export const mappedDelkeyAddKey = (params, mappedExchangeObject) => {
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

export const mappedAddKeyBase = (mappedDelkeyObject) => {
  const res = { ...mappedDelkeyObject };
  res[BASE_CURRENCY] = 1;
  return res;
};

/**
 * Converts a string object removing extra characters.
 * @constructor
 * @param {Object} object
 * @returns {String} - return string .
 */

export const mappedTransformToString = (object) => {
  return JSON.stringify(object).replace(/["",{}]/g, " ");
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
