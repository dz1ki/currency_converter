import { BASE_CURRENCY } from "./constants.js";
import {
  mappedDelkeyAddKey,
  mappedAddKeyBase,
  mappedTransformToString,
} from "./mappers.js";

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
 * The function checks the incoming data and performs actions based on it.
 * @constructor
 * @param {Array} params
 * @param {Object} mappedDelkeyObject
 * @returns {String} - return string .
 */

export const validateReceivedParams = (params, mappedDelkeyObject) => {
  if (!params[0]) {
    return mappedTransformToString(mappedDelkeyObject);
  }
  if (params[0].param === "base") {
    const result = relationToAnotherCurrency(params, mappedDelkeyObject);
    return mappedTransformToString(result);
  }
  if (!(params[0] && params[1])) {
    return "There should be two parameters 'calc' and 'to' ";
  }
  if (params[0].param === "calc" && params[1].param === "to") {
    return currencyConverter(params, mappedDelkeyObject);
  }
  return "Invalid parameters ";
};
