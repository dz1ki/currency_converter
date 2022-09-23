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
