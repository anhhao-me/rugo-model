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

  it('should transform json', async () => {
    const transform = require('../lib/transform');
    
    const undefinedObj = await transform({}, {
      type: 'JSON',
    }, null);

    expect(typeof undefinedObj).to.be.equal('object');

    const stringObj = await transform({}, {
      type: 'JSON',
    }, '{"foo":"bar"}');

    expect(stringObj).to.have.property('foo', 'bar');

    const defaultObj = await transform({}, {
      type: 'JSON',
    }, { foo: 'bar' });

    expect(defaultObj).to.have.property('foo', 'bar');
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

  it('should transform datetime', async () => {
    const transform = require('../lib/transform');
    
    const d = await transform({}, {
      type: 'datetime'
    }, 'Mon Jan 25 2021 12:09:23 GMT+0700 (Indochina Time)');
    expect(d.constructor.name).to.be.equal('Date');

    const d1 = await transform({}, {
      type: 'datetime'
    }, null);
    expect(d1.constructor.name).to.be.equal('Date');
  });
});