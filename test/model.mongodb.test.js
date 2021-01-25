const { MongoMemoryServer } = require('mongodb-memory-server');
const { Model, MongoDB } = require('../lib');
const { expect, assert } = require('chai');

const mongoServer = new MongoMemoryServer();

describe('Model MongoDB', () => {
  let db;

  const Schema = {
    name: {
      type: 'Text',
      required: true
    },
    email: {
      type: 'Email',
      required: true,
    },
    hobby: {
      type: 'Text'
    },
    __timestamp: true
  };

  before(async () => {
    const uri = await mongoServer.getUri();
    db = MongoDB(uri);
  });

  after(async () => {
    await mongoServer.stop();
    await db().stop();
  });

  it('should wrong connect', async () => {
    let db = MongoDB('wrong-uri');
    const UserModel = Model(db, 'users', Schema);
    try {
      await UserModel.get(UserModel.id())
    } catch(err){
      return;
    }
    assert.fail();
  });

  it('should get error not valid id', async () => {
    const UserModel = Model(db, 'users', Schema);

    try {
      await UserModel.get('123');
      assert.fail();
    } catch(err){
      expect(err.message).to.be.equal('Not valid id');
    }
  });

  it('should get null when get non-exists doc', async () => {
    const UserModel = Model(db, 'users', Schema);

    const user = await UserModel.get(UserModel.id());
    expect(user).to.be.equal(null);
  });

  it('should create doc successs', async () => {
    const UserModel = Model(db, 'users', Schema);

    const preDoc = {
      name: 'John',
      email: 'john@example.com'
    };

    const user = await UserModel.create(preDoc);

    expect(user).to.have.property('_id');
    expect(user).to.have.property('name', preDoc.name);
    expect(user).to.have.property('email', preDoc.email);
    expect(user).to.have.property('createdAt');
    expect(user).to.have.property('updatedAt');
    expect(user).not.to.have.property('hobby');
  });

  it('should not create doc because missing field', async () => {
    const UserModel = Model(db, 'users', Schema);

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
    const UserModel = Model(db, 'users', Schema);

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
    const UserModel = Model(db, 'users', Schema);

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
    const UserModel = Model(db, 'users', Schema);

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

  it('should not patch because of not found', async () => {
    const UserModel = Model(db, 'users', Schema);

    const patchDoc = {
      email: 'patchee@example.com'
    };

    const user = await UserModel.patch(UserModel.id(), patchDoc);

    expect(user).to.be.equal(null);
  });

  it('should remove doc', async () => {
    const UserModel = Model(db, 'users', Schema);

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

  it('should not remove because of not found', async () => {
    const UserModel = Model(db, 'users', Schema);

    const user = await UserModel.remove(UserModel.id());

    expect(user).to.be.equal(null);
  });

  it('should get list doc with empty query', async () => {
    const UserModel = Model(db, 'users', Schema);

    const list = await UserModel.list();

    expect(list).to.have.property('total');
    expect(list).to.have.property('limit');
    expect(list).to.have.property('skip');
    expect(list).to.have.property('data');
  });

  it('should get list doc', async () => {
    const UserModel = Model(db, 'users', Schema);

    const list = await UserModel.list({
      email: "abc@example.com",
      $limit: -1,
      $skip: 2,
      $sort: {
        email: 1
      }
    });

    expect(list).to.have.property('total');
    expect(list).to.have.property('limit', -1);
    expect(list).to.have.property('skip', 2);
    expect(list).to.have.property('data');
  });
});