import { TARGET_PARAMS } from "./constants.js";

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

const parseParams = (params) => {
  const parsedParams = [];
  for (const param of params) {
    const removeDashes = param.toString().replace(/[--]/gi, "");
    const rawParamArray = removeDashes.split("=");
    let rawParam;
    if (rawParamArray.length == 1) {
      rawParam = { param: rawParamArray[0], value: null };
    }
    if (rawParamArray.length == 2) {
      rawParam = { param: rawParamArray[0], value: rawParamArray[1] };
    }
    parsedParams.push(rawParam);
  }
  return parsedParams;
};

export const transformParamTerminal = () => {
  const params = validCommand();
  const parsedParams = parseParams(params);
  return parsedParams;
};
