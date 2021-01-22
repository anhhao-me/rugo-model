module.exports = (schema, value) => {
  if (!value || typeof value !== 'object')
    throw new Error(`"${value}" is not a json`);
    
  return value;
}