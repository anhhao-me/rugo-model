module.exports = (schema, value) => {
  if (!Array.isArray(value))
    throw new Error(`value is not a tag`);
    
  return value;
}