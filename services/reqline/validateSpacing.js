const { ERROR_STATUS_CODE_MAPPING, throwAppError } = require('@app-core/errors');
const { ReqlineMessages } = require('@app-core/messages');
const { REQUEST_KEYWORDS } = require('../../core/constants');

function validateSpacing(parameter, idxOfParam, totalNoOfParams) {
  const subParams = parameter.split(' ');
  const result = [];

  if (idxOfParam > 1 && subParams < 2) {
    throwAppError(ReqlineMessages.INVALID_REQLINE_VALUE, ERROR_STATUS_CODE_MAPPING);
  }
  const lenOfSubParam = subParams.length;
  const firstEleInSubParam = 0;
  const lastEleInSubParam = lenOfSubParam - 1;
  const noOfWhiteSpace = subParams.reduce((acc, item) => (item === '' ? acc + 1 : acc), 0);
  const hasMissingSpace = REQUEST_KEYWORDS.some((keyword) => {
    const p = parameter.trim();
    if (p.startsWith(keyword)) {
      const nextChar = p[keyword.length];
      return nextChar && nextChar !== ' ';
    }
    return false;
  });

  if (idxOfParam === 0) {
    // Spacing validation for first parameter in command string
    if (subParams[lastEleInSubParam] !== '') {
      throwAppError(
        ReqlineMessages.INVALID_SPACING_AROUND_DELIMETER,
        ERROR_STATUS_CODE_MAPPING.BAD_REQUEST
      );
    }
    if (lenOfSubParam < 3) {
      throwAppError(ReqlineMessages.MISSING_SPACE_KEYWORD, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
    }
    if (noOfWhiteSpace > 1) {
      throwAppError(ReqlineMessages.MULTIPLE_SPACES_FOUND, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
    }

    result.push(subParams[firstEleInSubParam]);
    result.push(subParams[firstEleInSubParam + 1]);
  } else if (idxOfParam === totalNoOfParams - 1) {
    // Spacing validation for last parameter in command string
    if (hasMissingSpace) {
      throwAppError(ReqlineMessages.MISSING_SPACE_KEYWORD, ERROR_STATUS_CODE_MAPPING);
    }
    if (subParams[firstEleInSubParam] !== '') {
      throwAppError(
        ReqlineMessages.INVALID_SPACING_AROUND_DELIMETER,
        ERROR_STATUS_CODE_MAPPING.BAD_REQUEST
      );
    }
    if (noOfWhiteSpace > 1) {
      throwAppError(ReqlineMessages.MULTIPLE_SPACES_FOUND, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
    }
    result.push(subParams[1]);
    result.push(subParams.slice(2).join(' ').trim());
  } else {
    // Spacing Validation for middle parameters
    if (hasMissingSpace) {
      throwAppError(ReqlineMessages.MISSING_SPACE_KEYWORD, ERROR_STATUS_CODE_MAPPING);
    }
    if (subParams[lenOfSubParam - 1] !== '' || subParams[0] !== '') {
      throwAppError(
        ReqlineMessages.INVALID_SPACING_AROUND_DELIMETER,
        ERROR_STATUS_CODE_MAPPING.BAD_REQUEST
      );
    }
    if (noOfWhiteSpace > 2) {
      throwAppError(ReqlineMessages.MULTIPLE_SPACES_FOUND, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
    }

    result.push(subParams[1]);
    result.push(subParams.slice(2).join(' ').trim());
  }
  return result;
}

module.exports = validateSpacing;
