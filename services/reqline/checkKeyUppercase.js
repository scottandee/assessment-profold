const { throwAppError, ERROR_STATUS_CODE_MAPPING } = require('@app-core/errors');
const { ReqlineMessages } = require('@app-core/messages');

function checkIfKeyUppercase(keyword) {
  if (keyword !== keyword.toUpperCase()) {
    throwAppError(ReqlineMessages.KEYWORDS_UPPERCASE, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
  }
}

module.exports = checkIfKeyUppercase;
