const { throwAppError, ERROR_STATUS_CODE_MAPPING } = require('@app-core/errors');
const { ReqlineMessages } = require('@app-core/messages');
const validateType = require('@app-core/validator/rule-validators/type-validation');
const validateSpacing = require('./validateSpacing');
const checkIfDupliKeyword = require('./checkIfDupliKeyword');
const { REQUEST_METHODS, REQUEST_KEYWORDS } = require('../../core/constants');

function extractRequestParams(command) {
  const parameters = command.trim().split('|');

  if (parameters.length < 2) {
    throwAppError(ReqlineMessages.INVALID_REQLINE_VALUE, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
  }

  const processedKeywords = [];
  const httpReq = { body: {}, headers: {}, query: {}, url: '', method: '' };
  let requestMethod;
  let url;

  // Loop through each parameter
  for (let i = 0; i < parameters.length; i++) {
    const [keyword, value] = validateSpacing(parameters[i], i, parameters.length);

    if (keyword !== keyword.toUpperCase()) {
      throwAppError(ReqlineMessages.KEYWORDS_UPPERCASE, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
    }

    if (i === 0) {
      // First parameter validation: HTTP
      if (keyword === 'HTTP') {
        checkIfDupliKeyword(keyword, processedKeywords);

        if (value !== value.toUpperCase()) {
          throwAppError(
            ReqlineMessages.HTTTP_METHOD_UPPERCASE,
            ERROR_STATUS_CODE_MAPPING.BAD_REQUEST
          );
        }
        if (!REQUEST_METHODS.includes(value)) {
          throwAppError(ReqlineMessages.INVALID_HTTP_METHOD, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
        }

        requestMethod = value;
        processedKeywords.push(keyword);
      } else {
        throwAppError(ReqlineMessages.MISSING_HTTP_KEYWORD, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
      }
    } else if (i === 1) {
      // Second parameter validation: URL
      if (keyword === 'URL') {
        checkIfDupliKeyword(keyword, processedKeywords);

        const result = validateType(value, 'uri');
        if (!result) {
          throwAppError(ReqlineMessages.INVALID_URL_URI, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
        }

        url = result.value;
        processedKeywords.push(keyword);
      } else {
        throwAppError(ReqlineMessages.MISSING_URL_KEYWORD, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
      }
    } else if (REQUEST_KEYWORDS.includes(keyword)) {
      // HEADER / QUERY / BODY validation
      checkIfDupliKeyword(keyword, processedKeywords);

      if (requestMethod === 'GET' && keyword === 'BODY') {
        throwAppError(
          ReqlineMessages.CANT_ADD_BODY_TO_GET_REQUEST,
          ERROR_STATUS_CODE_MAPPING.BAD_REQUEST
        );
      }

      try {
        const parsed = JSON.parse(value);
        const result = validateType(parsed, 'object');
        if (!result) {
          throw new Error();
        }
        httpReq[keyword.toLowerCase()] = result.value;
      } catch (err) {
        throwAppError(
          `Invalid JSON format in ${keyword} section`,
          ERROR_STATUS_CODE_MAPPING.BAD_REQUEST
        );
      }

      processedKeywords.push(keyword);
    } else {
      throwAppError(
        `${keyword} ${ReqlineMessages.UNSUPPORTED_KEYWORD}`,
        ERROR_STATUS_CODE_MAPPING.BAD_REQUEST
      );
    }
  }

  httpReq.url = url;
  httpReq.method = requestMethod;
  return httpReq;
}

module.exports = extractRequestParams;
