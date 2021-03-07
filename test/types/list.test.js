const { expect, assert } = require('chai');
const { Types, getType } = require('../../lib');

describe('List', () => {
  it('should be list', () => {
    const value = ['abc', 'def'];
    expect(Types.list(value).length).to.be.equal(value.length)
  });

  it('should be list with children field schema', () => {
    const value = ['abc', 'def'];
    expect(getType({
      type: 'list',
      children: {
        type: 'text'
      }
    })(value).length).to.be.equal(value.length)
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

    // not valid children schema
    const value3 = ['abc', 'def'];
    try {
      getType({
        type: 'list',
        children: {
          type: 'number',
        }
      })(value3);
      assert.fail();
    } catch(err){
      expect(err.message).to.be.equal(`"${value3[0]}" is not a number`);
    }
  });
});