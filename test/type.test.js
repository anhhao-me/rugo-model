const { expect, assert } = require('chai');
const { Types, createType } = require('../lib');

describe('Type', () => {
  describe('Create Type', () => {
    it('should be create new type', (done) => {
      const type = createType({
        type: () => done()
      });
      type('hello');
    });

    it('should be required', (done) => {
      const type = createType({
        type: () => done()
      });
      type('hello', {
        required: true
      });
    });

    it('should be error because of required', () => {
      try {
        const type = createType({
          type: new Function()
        });
        type(undefined, {
          required: true
        });
      } catch(err){
        expect(err.message).to.be.equal('value is required');
        return;
      }

      assert.fail();
    });
  });

  require('./types/checkbox.test');
  require('./types/datetime.test');
  require('./types/document.test');
  require('./types/email.test');
  require('./types/list.test');
  require('./types/number.test');
  require('./types/password.test');
  require('./types/text.test');
});