module.exports = handle => (value, fieldSchema) => {
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
}