const { Model, NeDB } = require('../lib');
const { expect, assert } = require('chai');

describe('Model NeDB', () => {
  const db = NeDB();
  const Schema = {
    name: {
      type: 'Text',
      required: true
    },
    email: {
      type: 'Email',
      required: true
    }
  };

  const UserModel = Model(db, 'users', Schema);

  it('should get null when get non-exists doc', async () => {
    const user = await UserModel.get('123');
    expect(user).to.be.equal(null);
  });

  it('should create doc successs', async () => {
    const preDoc = {
      name: 'John',
      email: 'john@example.com'
    };

    const user = await UserModel.create(preDoc);

    expect(user).to.have.property('_id');
    expect(user).to.have.property('name', preDoc.name);
    expect(user).to.have.property('email', preDoc.email);
  });

  it('should not create doc because missing field', async () => {
    const preDoc = {
      email: 'john@example.com'
    };

    try {
      await UserModel.create(preDoc);
    } catch(err){
      expect(err.message).to.be.equal('value is required');
      return;
    }

    assert.fail();
  });


  it('should not create doc because of not validate field', async () => {
    const preDoc = {
      name: 'John',
      email: 'john'
    };

    try {
      await UserModel.create(preDoc);
    } catch(err){
      expect(err.message).to.be.equal('"john" is not a email');
      return;
    }

    assert.fail();
  });

  it('should get doc', async () => {
    const preDoc = {
      name: 'Lucky',
      email: 'lucky@example.com'
    };

    const createdUser = await UserModel.create(preDoc);
    const user = await UserModel.get(createdUser._id);

    expect(user).to.have.property('_id');
    expect(user).to.have.property('name', preDoc.name);
    expect(user).to.have.property('email', preDoc.email);
  });

  it('should patch doc', async () => {
    const preDoc = {
      name: 'Patchee',
      email: 'unpatchee@example.com'
    };
    const patchDoc = {
      email: 'patchee@example.com'
    };

    const preUser = await UserModel.create(preDoc);
    const user = await UserModel.patch(preUser._id, patchDoc);

    expect(user).to.have.property('_id');
    expect(user).to.have.property('name', preDoc.name);
    expect(user).to.have.property('email', patchDoc.email);
  });

  it('should remove doc', async () => {
    const preDoc = {
      name: 'Removee',
      email: 'removee@example.com'
    };

    const preUser = await UserModel.create(preDoc);
    const user = await UserModel.remove(preUser._id);

    expect(user).to.have.property('_id');
    expect(user).to.have.property('name', preDoc.name);
    expect(user).to.have.property('email', preDoc.email);

    const nulluser = await UserModel.get(user._id);
    expect(nulluser).to.be.equal(null);
  });
});