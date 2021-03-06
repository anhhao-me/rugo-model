const { expect, assert } = require('chai');
const { Types } = require('../../lib');

describe('Number', () => {
  it('should be number', () => {
    const text = 1.2;
    expect(Types.number(text)).to.be.equal(text);
  });

  it('should be transformed to number', () => {
    const text = '1.2';
    expect(Types.number(text)).to.be.equal(parseFloat(text));
  });

  it('shoule be null', () => {
    expect(Types.number(null)).to.be.equal(null);
  });

  it('shoule be not number', () => {
    const value = { foo: 'bar' };

    try {
      Types.number(value)
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a number`);
      return;
    }
    assert.fail();
  });

  it('shoule be not number - wrong transform', () => {
    const value = 'abc';

    try {
      Types.number(value)
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a number`);
      return;
    }
    assert.fail();
  });

  it('should be valid min', () => {
    const value = 3;
    expect(Types.number(value, {
      min: 2
    })).to.be.equal(value);
  });

  it('should be not valid min', () => {
    try {
      const value = 3;
      Types.number(value, {
        min: 10
      });
    } catch(err){
      expect(err.message).to.be.equal('"3" is lower than 10');
      return;
    }
    assert.fail();
  });

  it('should be valid max', () => {
    const value = 3;
    expect(Types.number(value, {
      max: 5
    })).to.be.equal(value);
  });

  it('should be not valid max', () => {
    try {
      const value = 3;
      Types.number(value, {
        max: 2
      });
    } catch(err){
      expect(err.message).to.be.equal('"3" is greater than 2');
      return;
    }
    assert.fail();
  });
}); 