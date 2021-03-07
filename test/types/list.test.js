const { expect, assert } = require('chai');
const { Types } = require('../../lib');

describe('List', () => {
  it('should be list', () => {
    const value = ['abc', 'def'];
    expect(Types.list(value).length).to.be.equal(value.length)
  });

  it('should be not list', () => {
    // string
    const value = 'abc';

    try {
      Types.list(value);
      assert.fail();
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a list`);
    }

    // object
    const value2 = { "abc": "def" };
    try {
      Types.list(value2);
      assert.fail();
    } catch(err){
      expect(err.message).to.be.equal(`"${value2}" is not a list`);
    }
  });
});