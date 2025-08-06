const { createHandler } = require('@app-core/server');

module.exports = createHandler({
  path: '/',
  method: 'get',
  async handler(rc, helpers) {
    return {
      status: helpers.http_statuses.HTTP_201_CREATED,
      data: { reqline: 'Good to go' },
    };
  },
});
