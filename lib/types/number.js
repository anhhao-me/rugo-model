module.exports = {
  type(_value){
    let value = _value;

    if (typeof value === 'string')
      value = parseFloat(value);

    if (typeof value !== 'number' || isNaN(value))
      throw new Error(`"${_value}" is not a number`);

    return value;
  },
  min(value, schemaValue){
    if (value < schemaValue)
      throw new Error(`"${value}" is lower than ${schemaValue}`);
    return value;
  },
  max(value, schemaValue){
    if (value > schemaValue)
      throw new Error(`"${value}" is greater than ${schemaValue}`);
    return value;
  }
}