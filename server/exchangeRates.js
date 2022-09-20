import {
  getCashedExchange,
  exchangeObjectMapper,
  getOneFilial,
  httpRequest,
  checkExportDate,
  fileWriter,
  validateReceivedParams,
  mappedDelkey,
} from "./helpers.js";

/**
 * The function updates the rate data every 3 hours, converts the currency, shows the current exchange rate and the ratio of different currencies to each other.
 * @constructor
 * @param {Array} result
 * @example -[ { param: 'calc', value: '13 USD' }, { param: 'to', value: 'PLN' } ] || [ { param: 'base', value: 'RUB' } ] || []
 * @returns {String} returns calculated values.
 */

export async function exchangeRates(result) {
  const cash = getCashedExchange();
  let isActual;
  if (!cash) {
  } else {
    isActual = checkExportDate(cash);
  }
  let mappedExchangeObject;
  if (!isActual) {
    const data = await httpRequest();
    const oneFilial = getOneFilial(data);
    mappedExchangeObject = exchangeObjectMapper(oneFilial);
    fileWriter(mappedExchangeObject);
  } else {
    mappedExchangeObject = getCashedExchange();
  }
  const mappedDelkeyObject = mappedDelkey(mappedExchangeObject);
  const isParamsValidate = validateReceivedParams(result, mappedDelkeyObject);
  return isParamsValidate;
}
