const { expect, assert } = require('chai');
const { Types } = require('../../lib');

describe('datetime', () => {
  it('should be datetime', () => {
    const value = new Date();
    expect(Types.datetime(value)).to.be.equal(value);
  });

  it('should be transform datetime from string', () => {
    const value = '2021/03/14';
    expect(Types.datetime(value) instanceof Date && !isNaN(Types.datetime(value))).to.be.equal(true);
  });

  it('should be not datetime', () => {
    const value = 'nodate';
    
    try {
      Types.datetime(value);
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a datetime`);
      return;
    }
    assert.fail();
  });
});