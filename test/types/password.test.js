const { expect, assert } = require('chai');
const { Types } = require('../../lib');

describe('Password', () => {
  it('should be password', () => {
    const text = 'hello';
    const bcrypt = require('bcrypt');
    const hash = Types.password(text);
    expect(bcrypt.compareSync(text, hash)).to.be.equal(true);
  });

  it('shoule be null and undefined', () => {
    expect(Types.password(undefined)).to.be.equal(undefined);
    expect(Types.password(null)).to.be.equal(null);
  });

  it('shoule be not password', () => {
    const value = { foo: 'bar' };

    try {
      Types.password(value);
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a password`);
      return;
    }
    assert.fail();
  });
});