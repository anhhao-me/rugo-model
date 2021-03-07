const { curry, __ } = require('ramda');

module.exports.createType = handle => (value, fieldSchema) => {
  if (fieldSchema && fieldSchema.required && !value)
    throw new Error(`value is required`);

  if (value === undefined || value === null)
    return value;

  value = handle.type(value);

  if (fieldSchema)
    for (let [triggerName, triggerValue] of Object.entries(fieldSchema)){
      if (triggerName === 'type')
        continue;

      if (handle[triggerName]){
        value = handle[triggerName](value, triggerValue);
      }
    }

  return value;
};

module.exports.getType = (fieldSchema, fieldName) => {
  const Types = require('./types');
  
  if (!fieldSchema.type)
    throw new Error(`"${fieldName}" type must be specific`);

  let typeName = fieldSchema.type.toLowerCase().trim();
  if (!Types[typeName])
    throw new Error(`wrong type "${typeName}" for field "${fieldName}"`)

  return curry(Types[typeName])(__, fieldSchema);
}