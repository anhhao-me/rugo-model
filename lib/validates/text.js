module.exports = (schema, value) => {
  if (typeof value !== 'string')
    throw new Error(`"${value}" is not a text`);

  if (schema.regex){
    const r = new RegExp(schema.regex, 'gi');
    if (!r.test(value))
      throw new Error(`"${value}" is not match regex`);
  }
    
  return value;
}