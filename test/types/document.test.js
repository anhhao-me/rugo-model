const { expect, assert } = require('chai');
const { Types, getType } = require('../../lib');

describe('Document', () => {
  it('should be document', () => {
    const value = {
      abc: "def"
    };
    expect(Types.document(value)).to.has.property('abc', value.abc);
  });

  it('should be document with schema', () => {
    const value = {
      abc: "def",
    };
    const newValue = getType({
      type: 'document',
      schema: { 
        abc: {
          type: 'text'
        },
        xyz: {
          type: 'number',
          default: 10
        }
      }
    })(value);

    expect(newValue).to.has.property('abc', value.abc);
    expect(newValue).to.has.property('xyz', 10);
  });

  it('should be not document', () => {
    // string
    const value = 'abc';

    try {
      Types.document(value);
      assert.fail();
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a document`);
    }

    // array
    const value2 = ['abc'];
    try {
      Types.document(value2);
      assert.fail();
    } catch(err){
      expect(err.message).to.be.equal(`"${value2}" is not a document`);
    }
  });

  it('should be not document with schema', () => {
    const value = {
      abc: "def",
    };
    try {
      getType({
        type: 'document',
        schema: { 
          abc: {
            type: 'number'
          }
        }
      })(value);
      assert.fail();
    } catch(err){
      expect(err.message).to.be.equal(`"${value.abc}" is not a number`);
    }
  });
});