const { curryN } = require('ramda');
const validates = require('./validates');

module.exports = curryN(3, async (db, schema, value, options = {}) => {
  let name;

  // new schema with name
  if (Array.isArray(schema)){
    name = schema[0];
    schema = schema[1];
  }

  if (schema.required && !value)
    throw new Error(`value is required`);

  if (!schema.required && !value)
    return;

  if (!options.disableUniqueCheck && schema.unique && !name)
    throw new Error(`name must not be empty with unique`);

  if (!options.disableUniqueCheck && schema.unique && name){
    const { total } = await db.list({
      $limit: 0,
      [name]: value
    });

    if (total)
      throw new Error(`${name} "${value}" must be unique`);
  }

  const type = schema.type.toLowerCase();
  if (!validates[type])
    throw new Error(`wrong schema type "${type}"`);

  if (type === 'id'){
    return db.id(value);
  };

  return validates[type](schema, value);
});