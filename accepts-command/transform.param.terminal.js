import { TARGET_PARAMS } from "./constants.js";

/**
 * Function validates commands.
 * @constructor
 * @returns {Array} - Returns commands with their values.
 */

const validCommand = () => {
  let receivedParams = [];
  const targetParams = TARGET_PARAMS;
  const rawParams = process.argv;
  for (const elementRawParam of rawParams) {
    const oneRawParam = elementRawParam.split("--")[1];
    if (oneRawParam) {
      let arrayOneParam = oneRawParam.split("=");
      const validReserveParam = targetParams.includes(arrayOneParam[0]);
      if (!validReserveParam) {
        throw `Not found param: --${arrayOneParam[0]}, reserve param: --${targetParams}`;
      }
      receivedParams.push(oneRawParam);
    }
  }
  return receivedParams;
};

/**
 * The function takes validated values and converts.
 * @constructor
 * @param {Array} params - validated values.
 * @returns {Array} - Returns new array of objects.
 */

const parseParams = (params) => {
  const parsedParams = [];
  for (const param of params) {
    const removeDashes = param.toString().replace(/[--]/gi, "");
    const rawParamArray = removeDashes.split("=");
    let rawParam;
    rawParam = { param: rawParamArray[0], value: rawParamArray[1] };
    parsedParams.push(rawParam);
  }
  return parsedParams;
};

export const transformParamTerminal = () => {
  const params = validCommand();
  const parsedParams = parseParams(params);
  return parsedParams;
};
