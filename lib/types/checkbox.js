const STRING_MAP = {
  'true': true,
  'false': false,
  '1': true,
  '0': false
}

module.exports = {
  type(_value){
    let value = _value;

    if (typeof value === 'number')
      value = value !== 0;

    if (typeof value === 'string')
      value = STRING_MAP[value.trim().toLowerCase()];

    if (typeof value !== 'boolean')
      throw new Error(`"${_value}" is not a checkbox`);

    return value;
  }
}