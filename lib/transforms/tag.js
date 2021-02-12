module.exports = (schema, value) => {
  if (!value)
    return [];
  
  if (typeof value === 'string')
    try {
      return JSON.parse(value);
    } catch(err){
      return value;
    }

  return value;
}