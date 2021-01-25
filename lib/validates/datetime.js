module.exports = (schema, value) => {
  if (value.constructor.name !== 'Date')
    throw new Error(`"${value}" is not a datetime`);

  return value;
}