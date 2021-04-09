const { expect, assert } = require('chai');
const { Types } = require('../../lib');

describe('Text', () => {
  it('should be text', () => {
    const text = 'hello';
    expect(Types.text(text)).to.be.equal(text);
  });

  it('shoule be null and undefined', () => {
    expect(Types.text(undefined)).to.be.equal(undefined);
    expect(Types.text(null)).to.be.equal(null);
  });

  it('shoule be not text', () => {
    const value = { foo: 'bar' };

    try {
      Types.text(value)
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a text`);
      return;
    }
    assert.fail();
  });

  it('should be valid min length', () => {
    const text = 'hello';
    expect(Types.text(text, {
      minLength: 3
    })).to.be.equal(text);
  });

  it('should be not valid min length', () => {
    const text = 'hello';
    try {
      Types.text(text, {
        minLength: 10
      });
    } catch(err){
      expect(err.message).to.be.equal('"hello" length is lower than 10');
      return;
    }
    assert.fail();
  });

  it('should be valid max length', () => {
    const text = 'hello';
    expect(Types.text(text, {
      maxLength: 10
    })).to.be.equal(text);
  });

  it('should be not valid max length', () => {
    const text = 'hello';
    try {
      Types.text(text, {
        maxLength: 3
      });
    } catch(err){
      expect(err.message).to.be.equal('"hello" length is greater than 3');
      return;
    }
    assert.fail();
  });

  it('should be valid regex', () => {
    const text = 'hello';
    expect(Types.text(text, {
      regex: '^.ell.$'
    })).to.be.equal(text);
  });

  it('should be not valid regex', () => {
    const text = 'hello';
    try {
      Types.text(text, {
        regex: 'he.+llo'
      });
    } catch(err){
      expect(err.message).to.be.equal('"hello" is not match regex');
      return;
    }
    assert.fail();
  });

  it('should be transform', () => {
    const text = '  heLlO  ';
    expect(Types.text(text, { trim: true })).to.be.equal(text.trim());
    expect(Types.text(text, { lowercase: true })).to.be.equal(text.toLowerCase());
    expect(Types.text(text, { uppercase: true })).to.be.equal(text.toUpperCase());
  });

  it('should be valid enum', () => {
    const text = 'foo';
    expect(Types.text(text, {
      enum: ['foo', 'bar']
    })).to.be.equal(text);
  });

  it('should be not valid enum', () => {
    const text = 'hello';
    try {
      Types.text(text, {
        enum: ['foo', 'bar']
      });
      assert.fail();
    } catch(err){
      expect(err.message).to.be.equal('"hello" is not valid enum');
    }
  });
}); 