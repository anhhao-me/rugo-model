const { expect, assert } = require('chai');

describe('Transform', () => {
  const transform = require('../lib/transform');
  
  it('should throw error because of wrong schema type', async () => {
    try { 
      await transform({}, {
        type: 'John'
      }, '123');
    } catch (err){
      expect(err.message).to.be.equal('wrong schema type "john"');
      return;
    }

    assert.fail();
  });

  it('should transform text', async () => {
    const transform = require('../lib/transform');
    
    const lowercase = await transform({}, {
      type: 'text',
      lowercase: true
    }, 'HELLO WORLD');
    expect(lowercase).to.be.equal('hello world');

    const uppercase = await transform({}, {
      type: 'text',
      uppercase: true
    }, 'hello world');
    expect(uppercase).to.be.equal('HELLO WORLD');

    const trim = await transform({}, {
      type: 'text',
      trim: true
    }, '    hello world      ');
    expect(trim).to.be.equal('hello world');
  });
});