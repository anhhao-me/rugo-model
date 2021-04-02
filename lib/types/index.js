const { createType } = require('../type');

module.exports = {
  checkbox: createType(require('./checkbox')),
  datetime: createType(require('./datetime')),
  document: createType(require('./document')),
  email: createType(require('./email')),
  list: createType(require('./list')),
  number: createType(require('./number')),
  password: createType(require('./password')),
  relationship: createType(require('./relationship')),
  text: createType(require('./text')),
}