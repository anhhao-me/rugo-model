const { composeWith, curry } = require('ramda');
const composeP = (...args) => composeWith(async (fn, res) => await fn(await res))(args);
const validate = require('./validate');
const transform = require('./transform');

const cloneObject = function(obj){
  return JSON.parse(JSON.stringify(obj));
}

const Model = (db, name, _schema) => {
  _schema = cloneObject(_schema);
  const schema = {};

  // skip double under character head of key
  for (let key in _schema){
    if (key.indexOf('__') === 0)
      continue;
    schema[key] = _schema[key];
  }

  // add id
  schema._id = {
    type: 'ID',
    required: true,
    unique: true
  };
  
  return {
    id: db(name).id,
    // get(ID)
    get: composeP(
      db(name).get, 
      validate(db(name), { type: 'ID', required: true })
    ),
    // create(doc)
    create: composeP(
      db(name).create,
      // validate
      async (value) => {
        for (let entry in schema) {
          await validate(db(name), schema[entry], value[entry]);
        }

        return value;
      },
      // transform
      async (_value) => {
        const value = {};

        for (let entry in schema) {
          if (schema[entry].required || _value[entry] !== undefined){
            value[entry] = await transform(db(name), schema[entry], _value[entry]);
          }
        }

        return value;
      }
    ),
    // patch(id, doc)
    patch: async (id, doc) => await composeP(
      curry(db(name).patch)(id),
      // validate
      async (value) => {
        for (let entry in schema) {
          if (value[entry] !== undefined)
            await validate(db(name), schema[entry], value[entry]);
        }

        return value;
      },
      // transform
      async (_value) => {
        const value = {};

        for (let entry in schema) {
          if (_value[entry] !== undefined)
            value[entry] = await transform(db(name), schema[entry], _value[entry]);
        }

        return value;
      }
    )(doc),
    // remove(id)
    remove: composeP(
      db(name).remove, 
      validate(db(name), { type: 'ID', required: true })
    ),
    // list([query])
    list: composeP(
      db(name).list,
      // validate
      async (value) => {
        for (let entry in schema) {
          if (value[entry] !== undefined)
            await validate(db(name), schema[entry], value[entry]);
        }

        return value;
      },
      // transform
      async (_value) => {
        const value = {};

        for (let entry in schema) {
          if (_value[entry] !== undefined)
            value[entry] = await transform(db(name), schema[entry], _value[entry]);
        }

        for (let entry in _value)
          if (entry[0] === '$')
            value[entry] = _value[entry];

        return value;
      },
      // default
      val => val || {}
    )
  }
}

module.exports = Model;