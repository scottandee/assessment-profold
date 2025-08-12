const HttpRequest = require('@app-core/http-request');

async function makeHttpRequest(httpReq, url) {
  let result;
  try {
    if (httpReq.method === 'GET') {
      result = await HttpRequest.get(url, {
        headers: httpReq.headers,
      });
    } else {
      result = await HttpRequest.post(url, {
        headers: httpReq.headers,
        body: httpReq.body,
      });
    }
  } catch (error) {
    return error;
  }

  return result;
}

module.exports = makeHttpRequest;
