const { expect, assert } = require('chai');
const { Types } = require('../../lib');

describe('Document', () => {
  it('should be document', () => {
    const value = {
      abc: "def"
    };
    expect(Types.document(value)).to.has.property('abc', value.abc);
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
});