module.exports = (schema, value) => {
  if (typeof value !== 'string')
    throw new Error(`"${value}" is not a password`);
    
  return value;
}