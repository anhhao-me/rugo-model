module.exports = (schema, value) => {
  if (!schema.enum){
    throw new Error(`enum was not defined`);
  }

  if (schema.enum.indexOf(value) === -1){
    throw new Error(`"${value}" is not in enumeration`);
  }
    
  return value;
}