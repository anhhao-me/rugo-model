const { expect, assert } = require('chai');

describe('Validate', () => {
  const validate = require('../lib/validate');

  it('should throw error because of wrong schema type', async () => {
    try { 
      await validate({}, {
        type: 'John'
      }, '123');
    } catch (err){
      expect(err.message).to.be.equal('wrong schema type "john"');
      return;
    }

    assert.fail();
  });

  it('should throw error because of not text', async () => {
    try { 
      await validate({}, {
        type: 'Text',
      }, 123);
    } catch (err){
      expect(err.message).to.be.equal('"123" is not a text');
      return;
    }

    assert.fail();
  });

  it('should valid json type', async () => {
    const val = await validate({}, {
      type: 'JSON',
    }, { foo: 'bar' });

    expect(val).to.have.property('foo', 'bar');
  });

  it('should not valid json type', async () => {
    try { 
      await validate({}, {
        type: 'JSON',
      }, '123');
    } catch (err){
      expect(err.message).to.be.equal('"123" is not a json');
      return;
    }

    assert.fail();
  });
});