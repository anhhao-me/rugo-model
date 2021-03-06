const { expect, assert } = require('chai');
const { Types } = require('../../lib');

describe('Email', () => {
  it('should be email', () => {
    const text = 'hello@example.com';
    expect(Types.email(text)).to.be.equal(text);
  });

  it('shoule be null and undefined', () => {
    expect(Types.email(undefined)).to.be.equal(undefined);
    expect(Types.email(null)).to.be.equal(null);
  });

  it('shoule be not email', () => {
    const value = { foo: 'bar' };

    try {
      Types.email(value);
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a email`);
      return;
    }
    assert.fail();
  });

  it('shoule be not email', () => {
    const value = 'hello';

    try {
      Types.email(value);
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a email`);
      return;
    }
    assert.fail();
  });
}); 