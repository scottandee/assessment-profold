function buildFullUrl(httpReq) {
  let fullUrl = httpReq.url;
  if (Object.keys(httpReq.query).length) {
    const queryStr = Object.entries(httpReq.query)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&');
    fullUrl += `?${queryStr}`;
  }
  return fullUrl;
}

module.exports = buildFullUrl;
