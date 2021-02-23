const { MongoMemoryServer } = require('mongodb-memory-server');
const {  Model, Driver } = require('../lib');
const { expect, assert } = require('chai');
const { ObjectId } = require('mongodb');

const mongoServer = new MongoMemoryServer();

describe('Model MongoDB', () => {
  let db;

  beforeEach(async () => {
    const uri = await mongoServer.getUri();
    db = await Driver(uri);
  });

  afterEach(async () => {
    await mongoServer.stop();
    await db.stop();
  });

  it('should be throw error because of not specific type', async () => {
    try {
      Model(db, "demoId", {
        name: {}
      });
    } catch (err){
      expect(err.message).to.be.equal('"name" type must be specific')
      return;
    }

    assert.fail();
  });

  it('should be throw error because of wrong type', async () => {
    try {
      Model(db, "demoId", {
        name: {
          type: 'notype'
        }
      });
    } catch (err){
      expect(err.message).to.be.equal('wrong type "notype" for field "name"')
      return;
    }

    assert.fail();
  });

  it('should be create and get', async () => {
    const schema = {
      name: {
        type: 'text'
      },
      age: {
        type: 'number'
      }
    }

    const DemoModel = Model(db, "demoId", schema);
    const doc = await DemoModel.create({
      name: 'foo'
    });
    expect(doc).to.has.property('name', 'foo');
    expect(doc).to.has.not.property('age');
    expect(doc).to.has.property('createdAt');
    expect(doc).to.has.property('updatedAt');
    expect(doc).to.has.property('version', 1);

    const getDoc = await DemoModel.get(doc._id);
    expect(getDoc).to.has.property('name', 'foo');
    expect(getDoc).to.has.not.property('age');
    expect(getDoc).to.has.property('createdAt');
    expect(getDoc).to.has.property('updatedAt');
    expect(getDoc).to.has.property('version', 1);
  });

  it('should be unique create', async () => {
    const schema = {
      name: {
        type: 'text',
        unique: true
      },
      age: {
        type: 'number',
        index: true
      }
    }

    const DemoModel = Model(db, "demoId", schema);
    const raw = {
      name: 'foo'
    };
    await DemoModel.create(raw);

    try {
      await DemoModel.create(raw);
    } catch(err){
      return;
    }

    assert.fail();
  });

  it('should get null when get non-exists doc', async () => {
    const schema = {
      name: {
        type: 'text'
      }
    };

    const DemoModel = Model(db, 'demoId', schema);

    const doc = await DemoModel.get('abc');
    expect(doc).to.be.equal(null);

    const ndoc = await DemoModel.get(ObjectId());
    expect(ndoc).to.be.equal(null);
  });

  it('should not create doc because missing field', async () => {
    const schema = {
      name: {
        type: 'text'
      },
      age: {
        type: 'number',
        required: true
      }
    };

    const DemoModel = Model(db, 'demoId', schema);
    const preDoc = {
      name: 'hello'
    };

    try {
      await DemoModel.create(preDoc);
    } catch(err){
      expect(err.message).to.be.equal('value is required');
      return;
    }

    assert.fail();
  });

  it('should not create doc because of not validate field', async () => {
    const schema = {
      name: {
        type: 'text'
      }
    };

    const DemoModel = Model(db, 'demoId', schema);
    const preDoc = {
      name: 123
    };

    try {
      await DemoModel.create(preDoc);
    } catch(err){
      expect(err.message).to.be.equal('"123" is not a text');
      return;
    }

    assert.fail();
  });

  it('should get list doc with empty query', async () => {
    const Schema = {
      name: {
        type: 'text'
      }
    }
    const UserModel = Model(db, 'users', Schema);

    const list = await UserModel.list();

    expect(list).to.have.property('total');
    expect(list).to.have.property('limit');
    expect(list).to.have.property('skip');
    expect(list).to.have.property('data');
  });

  it('should get list doc with pagination', async () => {
    const PetModel = Model(db, 'pets', {
      name: {
        type: 'text'
      }
    });

    for (let i = 0; i < 11; i++)
      await PetModel.create({ name: `pet-${i}` });

    const list = await PetModel.list({
      $skip: 10,
      $limit: 10
    });

    expect(list).to.have.property('total');
    expect(list).to.have.property('limit');
    expect(list).to.have.property('skip');
    expect(list).to.have.property('data');
    expect(list.data.length).to.be.equal(1);
  });

  it('should get list exact value', async () => {
    const PetModel = Model(db, 'pets', {
      name: {
        type: 'text'
      }
    });

    for (let i = 0; i < 11; i++)
      await PetModel.create({ name: `pet-${i}` });

    const list = await PetModel.list({
      name: `pet-7`
    });

    expect(list).to.have.property('total');
    expect(list).to.have.property('limit');
    expect(list).to.have.property('skip');
    expect(list).to.have.property('data');
    expect(list.data.length).to.be.equal(1);
  });

  it('should get list doc', async () => {
    const Schema = {
      email: {
        type: 'text'
      }
    };

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

  it('should remove doc', async () => {
    const Schema = {
      email: {
        type: 'text'
      }
    };

    const UserModel = Model(db, 'users', Schema);

    const preDoc = {
      email: 'removee@example.com'
    };

    const preUser = await UserModel.create(preDoc);
    const user = await UserModel.remove(preUser._id);

    expect(user).to.have.property('_id');
    expect(user).to.have.property('email', preDoc.email);

    const nulluser = await UserModel.get(user._id);
    expect(nulluser).to.be.equal(null);
  });

  it('should not remove because of not found', async () => {
    const Schema = {
      email: {
        type: 'text'
      }
    };

    const UserModel = Model(db, 'users', Schema);

    const user = await UserModel.remove(ObjectId());

    expect(user).to.be.equal(null);
  });

  it('should patch doc', async () => {
    const Schema = {
      email: {
        type: 'text'
      },
      name: {
        type: 'text'
      },
      numPatch: {
        type: 'number'
      }
    };

    const UserModel = Model(db, 'users', Schema);

    const preDoc = {
      email: 'unpatchee@example.com',
      name: 'unpatchee',
      numPatch: 0
    };
    const patchDoc = {
      email: 'patchee@example.com',
      name: null,
      $inc: {
        numPatch: 1
      }
    };

    const preUser = await UserModel.create(preDoc);
    const user = await UserModel.patch(preUser._id, patchDoc);

    expect(user).to.have.property('_id');
    expect(user).to.have.property('name', null);
    expect(user).to.have.property('email', patchDoc.email);
    expect(user.numPatch).to.be.equal(preUser.numPatch + 1);
    expect(user.version).to.be.equal(preUser.version + 1);
    expect(user.updatedAt).to.be.not.equal(preUser.updatedAt);
  });

  it('should not patch because of not found', async () => {
    const Schema = {
      email: {
        type: 'text'
      }
    };

    const UserModel = Model(db, 'users', Schema);

    const patchDoc = {
      email: 'patchee@example.com'
    };

    try {
      await UserModel.patch(ObjectId(), patchDoc);
    } catch(err){
      expect(err.message).to.be.equal('cannot patch');
      return;
    }
    assert.fail();
  });

  it('should not patch with $inc controls because of number trigger', async () => {
    const DemoModel = Model(db, 'demoId', {
      age: {
        type: 'number',
        min: 0,
        max: 2
      }
    });

    const doc = await DemoModel.create({ age: 1 });

    try {
      await DemoModel.patch(doc._id, {
        $inc: { age: -2 }
      });
      assert.fail();
    } catch (err) {
      expect(err.message).to.be.equal('cannot patch');
    }

    try {
      await DemoModel.patch(doc._id, {
        $inc: { age: 2 }
      });
      assert.fail();
    } catch (err) {
      expect(err.message).to.be.equal('cannot patch');
    }
  });
});