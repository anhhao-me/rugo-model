const createType = require('../type');

module.exports = {
  text: createType(require('./text')),
  number: createType(require('./number')),
}