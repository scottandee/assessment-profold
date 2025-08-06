const validator = require('@app-core/validator');

const parsedSpec = validator.parse(`root{
  name is a required string
  email is a required email
  password is a required string
}`);

async function getCurrentDateTime(serviceData) {
  const data = validator.validate(serviceData, parsedSpec);
  return data;
}

module.exports = getCurrentDateTime;
