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
  }); 

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

  require('./types/checkbox.test');
  require('./types/datetime.test');
});