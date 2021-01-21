const { curry } = require('ramda');
const transforms = require('./transforms');

module.exports = curry((db, schema, value) => {
  const type = schema.type.toLowerCase();

  if (type === 'id'){
    return db.id(value);
  };

  if (!transforms[type])
    throw new Error(`wrong schema type "${type}"`);

  return transforms[type](schema, value);
});