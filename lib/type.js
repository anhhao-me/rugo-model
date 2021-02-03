function Type(trans = (_, i) => i, valid = (_, i) => i){
  if (!(this instanceof Type))
    return new Type(trans, valid);

  this.transform = trans;
  this.validate = valid;
}

module.exports = Type;