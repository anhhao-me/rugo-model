module.exports = (schema, value) => {
  if (!value)
    return [];
  
  if (typeof value === 'string')
    return JSON.parse(value);

  return value;
}