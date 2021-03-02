const createType = require('../type');

module.exports = {
  email: createType(require('./email')),
  number: createType(require('./number')),
  password: createType(require('./password')),
  text: createType(require('./text')),
}