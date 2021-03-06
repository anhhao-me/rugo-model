module.exports = {
  type(value){
    if (typeof value !== 'string')
      throw new Error(`"${value}" is not a text`);

    return value;
  },
  minLength: (value, schemaValue) => {
    if (value.length < schemaValue)
      throw new Error(`"${value}" length is lower than ${schemaValue}`);
    return value;
  },
  maxLength: (value, schemaValue) => {
    if (value.length > schemaValue)
      throw new Error(`"${value}" length is greater than ${schemaValue}`);
    return value;
  },
  regex: (value, schemaValue) => {
    const r = new RegExp(schemaValue);
    if (!r.test(value))
      throw new Error(`"${value}" is not match regex`);
    return value;
  },
  trim: value => value.trim(),
  lowercase: value => value.toLowerCase(),
  uppercase: value => value.toUpperCase()
}