const { MongoMemoryServer } = require('mongodb-memory-server');
const { Driver } = require('../lib');
const { expect } = require('chai');

const mongoServer = new MongoMemoryServer();

describe('Driver', () => {
  let db;

  it('should be connect', async () => {
    const uri = await mongoServer.getUri();
    const client = await Driver(uri);
    db = client.db();
    expect(db).to.be.not.equal(undefined);
    await mongoServer.stop();
    await client.close();
  });

  it('should wrong connect', async () => {
    try {
      await Driver('wrong-uri');
    } catch(err){
      return;
    }
    assert.fail();
  });
});