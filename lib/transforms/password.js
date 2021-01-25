const bcrypt = require('bcrypt');

const SALT = 10;

module.exports = (schema, value) => {
  return bcrypt.hash(value, SALT);
}