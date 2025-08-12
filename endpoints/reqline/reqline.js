const { createHandler } = require('@app-core/server');
const { throwAppError, ERROR_STATUS_CODE_MAPPING } = require('@app-core/errors');
const { ReqlineMessages } = require('@app-core/messages');
const { extractRequestParams, buildFullUrl, makeHttpRequest } = require('../../services/reqline');
const { getCurrentDateTime } = require('../../services/utils');

module.exports = createHandler({
  path: '/',
  method: 'post',
  async handler(rc, helpers) {
    const payload = rc.body.reqline;
    if (!payload) {
      throwAppError(
        ReqlineMessages.MISSING_REQLINE_KEY_VALUE,
        ERROR_STATUS_CODE_MAPPING.BAD_REQUEST
      );
    }

    const httpReq = extractRequestParams(payload);
    const fullUrl = buildFullUrl(httpReq);

    const reqStartTime = getCurrentDateTime();
    const result = await makeHttpRequest(httpReq, fullUrl);
    const reqEndTime = getCurrentDateTime();

    const duration = reqEndTime - reqStartTime;
    if (result.isApplicationError) {
      return {
        status: helpers.http_statuses.HTTP_200_OK,
        data: {
          request: {
            query: httpReq.query,
            body: httpReq.body,
            headers: httpReq.headers,
            full_url: fullUrl,
          },
          response: {
            http_status: result.context.response.statusCode,
            duration,
            request_start_timestamp: reqStartTime,
            request_stop_timestamp: reqEndTime,
            response_data: result.context.response.data,
          },
        },
      };
    }

    return {
      status: helpers.http_statuses.HTTP_200_OK,
      data: {
        request: {
          query: httpReq.query,
          body: httpReq.body,
          headers: httpReq.headers,
          full_url: fullUrl,
        },
        response: {
          http_status: result.statusCode,
          duration,
          request_start_timestamp: reqStartTime,
          request_stop_timestamp: reqEndTime,
          response_data: result.data,
        },
      },
    };
  },
});
