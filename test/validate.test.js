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
        type: 'Text'
      }, undefined);
    } catch (err){
      expect(err.message).to.be.equal('"undefined" is not a text');
      return;
    }

    assert.fail();
  });
});