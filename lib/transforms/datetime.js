module.exports = (schema, value) => {
  if (!value)
    return new Date();

  return new Date(value);
}