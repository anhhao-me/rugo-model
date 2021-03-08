const { getType } = require('../type');

module.exports = {
  type: _value => {
    let value = _value;
    if (typeof value === 'string')
      try {
        value = JSON.parse(value);
      } catch(err){
        throw new Error(`"${_value}" is not a document`);
      }

    if (typeof value !== 'object' || Array.isArray(value))
      throw new Error(`"${_value}" is not a document`);

    return value;
  },
  schema: (doc, schemaValue) => {
    const newDoc = {};

    for (const [fieldName, fieldSchema] of Object.entries(schemaValue)){
      let value = getType(fieldSchema, fieldName)(doc[fieldName]);

      if (value !== null && value !== undefined){
        newDoc[fieldName] = value;
      }

      if ((value === null || value === undefined) && fieldSchema.default !== undefined){
        newDoc[fieldName] = fieldSchema.default;
      }
    }

    return newDoc;
  }
}