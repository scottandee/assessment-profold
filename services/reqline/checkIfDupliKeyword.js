const { ERROR_STATUS_CODE_MAPPING, throwAppError } = require('@app-core/errors');
const { ReqlineMessages } = require('@app-core/messages');

function checkIfDupliKeyword(keyword, processedKeywords) {
  if (processedKeywords.includes(keyword)) {
    throwAppError(ReqlineMessages.DUPLICATE_KEYWORD, ERROR_STATUS_CODE_MAPPING.BAD_REQUEST);
  }
}
module.exports = checkIfDupliKeyword;
