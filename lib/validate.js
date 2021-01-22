const { curry } = require('ramda');
const validates = require('./validates');

module.exports = curry((db, schema, value) => {
  if (schema.required && !value)
    throw new Error(`value is required`);

  if (!schema.required && !value)
    return;

  const type = schema.type.toLowerCase();
  if (!validates[type])
    throw new Error(`wrong schema type "${type}"`);

  if (type === 'id'){
    return db.id(value);
  };

  return validates[type](schema, value);
});