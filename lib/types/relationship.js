const { ObjectId } = require('mongodb');

module.exports = {
  type(value){
    try {
      return ObjectId(value);
    } catch(err){
      throw new Error(`"${value}" is not a relationship`);
    }
  }
}