import { validateReceivedParams } from "./exchange.rates.js";
import { mappedDelkey } from "./mappers.js";
import { checkFile } from "./cache.flow.js";

/**
 * The function updates the rate data every 3 hours, converts the currency, shows the current exchange rate and the ratio of different currencies to each other.
 * @constructor
 * @param {Array} result
 * @example -[ { param: 'calc', value: '13 USD' }, { param: 'to', value: 'PLN' } ] || [ { param: 'base', value: 'RUB' } ] || []
 * @returns {String} returns calculated values.
 */

export async function converter(result) {
  const mappedExchangeObject = await checkFile();
  const mappedDelkeyObject = mappedDelkey(mappedExchangeObject);
  const isParamsValidate = validateReceivedParams(result, mappedDelkeyObject);
  return isParamsValidate;
}
