module.exports = (schema, value) => {
  if (!value)
    return '';

  if (schema.lowercase)
    value = value.toLowerCase();

  if (schema.uppercase)  
    value = value.toUpperCase();
    
  if (schema.trim)
    value = value.trim();

  return value;
}