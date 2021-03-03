module.exports = {
  type(_value){
    let value = _value;
    if (typeof value === 'string')
      value = new Date(value);

    if (!(value instanceof Date) || isNaN(value))
      throw new Error(`"${_value}" is not a datetime`);

    return value;
  }
}