module.exports = Object.assign({}, require('./text'), {
  type(value){
    if (typeof value !== 'string')
      throw new Error(`"${value}" is not a email`);

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(value).toLowerCase()))
      throw new Error(`"${value}" is not a email`);
      
    return value;
  }
});