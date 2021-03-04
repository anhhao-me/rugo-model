const { expect, assert } = require('chai');
const { Types } = require('../../lib');

describe('checkbox', () => {
  it('should be checkbox', () => {
    const value = true;
    expect(Types.checkbox(value)).to.be.equal(value);
  });

  it('should be transform checkbox from number', () => {
    const value2 = 0;
    expect(Types.checkbox(value2)).to.be.equal(false);
  });

  it('should be transform checkbox from string', () => {
    const value = 'true';
    expect(Types.checkbox(value)).to.be.equal(true);
  });

  it('should be not checkbox', () => {
    const value = 'nocheckbox';
    
    try {
      Types.checkbox(value);
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a checkbox`);
      return;
    }
    assert.fail();
  });
});