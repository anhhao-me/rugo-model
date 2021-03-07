const { getType } = require('../type');

module.exports = {
  type: _value => {
    let value = _value;
    if (typeof value === 'string')
      try {
        value = JSON.parse(value);
      } catch(err){
        throw new Error(`"${_value}" is not a list`);
      }

    if (typeof value !== 'object' || !Array.isArray(value))
      throw new Error(`"${_value}" is not a list`);

    return value;
  },
  children: (value, schemaValue) => {
    const type = getType(schemaValue);
    const res = [];
    for (let subValue of value){
      res.push(type(subValue));
    }
    return res;
  }
}