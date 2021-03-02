const bcrypt = require('bcrypt');
const SALT = 10;

module.exports = {
  type(value){
    if (typeof value !== 'string')
      throw new Error(`"${value}" is not a password`);

    return bcrypt.hashSync(value, SALT);
  }
}