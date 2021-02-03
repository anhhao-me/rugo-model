const { expect, assert } = require('chai');

describe('Validate', () => {
  const validate = require('../lib/validate');
  const { Model, Type } = require('../lib/index');

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

  it('should valid datetime type', async () => {
    const d = await validate({}, {
      type: 'datetime',
    }, new Date());

    expect(d.constructor.name).to.be.equal('Date');
  });

  it('should not valid datetime type', async () => {
    try {
      await validate({}, {
        type: 'datetime',
      }, '123');
      assert.fail();
    }catch(err){
      expect(err.message).to.be.equal('"123" is not a datetime');
    };
  });

  it('should valid password type', async () => {
    const d = await validate({}, {
      type: 'password',
    }, '123');

    expect(d).to.be.equal('123');
  });

  it('should throw error because of not password', async () => {
    try { 
      await validate({}, {
        type: 'password',
      }, 123);
    } catch (err){
      expect(err.message).to.be.equal('"123" is not a password');
      return;
    }

    assert.fail();
  });

  it('should throw error because of unique with no name', async () => {
    try { 
      await validate({}, {
        type: 'Text',
        unique: true
      }, '123');
    } catch (err){
      expect(err.message).to.be.equal('name must not be empty with unique');
      return;
    }

    assert.fail();
  });

  it('should not throw error because of unique with no name and disable unique check', async () => {
    const res = await validate({}, {
      type: 'Text',
      unique: true
    }, '123', { disableUniqueCheck: true });
    expect(res).to.be.equal('123');
  });

  it('should success because type was defined', async () => {
    const Permission = Type();
    Model.use('Permission', Permission);

    const res = await validate({}, {
      type: 'Permission'
    }, '123');

    expect(res).to.be.equal('123');
  });
});