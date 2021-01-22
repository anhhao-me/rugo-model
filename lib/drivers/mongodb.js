const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const debug = require('debug')('driver:mongodb')

module.exports = uri => {
  var db = null;
  var client = null;

  const connect = () => {
    if (db)
      return db;

    return new Promise((resolve, reject) => {
      MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, _client) {
        if (err){
          reject(err);
          return;
        }
    
        client = _client;
        db = client.db();
        debug('Create new mongodb instance');

        resolve(db);
      });
    });
  }
  
  return name => {
    const handle = {
      id(id){
        if (!id)
          return ObjectId();

        try { ObjectId(id) } catch(err){ 
          throw new Error('Not valid id');
        };

        return ObjectId(id);
      },
      async list(_query){
        const db = await connect();
        const collection = db.collection(name);

        const controls = {
          $sort: null,
          $limit: 10,
          $skip: 0
        };
      
        let query = {};
        for (let key in _query){
          if (controls[key] !== undefined){
            controls[key] = _query[key];
            continue;
          }
      
          query[key] = _query[key];
        }
      
        let queryBuilder = collection.find(query);
      
        if (controls.$sort !== null){
          queryBuilder = queryBuilder.sort(controls.$sort);
        }
      
        if (!controls.$skip){
          queryBuilder = queryBuilder.skip(controls.$skip);
        }
      
        if (controls.$limit !== null && controls.$limit !== undefined && controls.$limit !== -1){
          queryBuilder = queryBuilder.limit(controls.$limit);
        }
      
        return {
          total: await collection.countDocuments(query),
          limit: controls.$limit,
          skip: controls.$skip,
          data: await queryBuilder.toArray()
        };
      },
      async get(id){
        const db = await connect();
        const collection = db.collection(name);
        return await collection.findOne({ _id: ObjectId(id) });
      },
      async create(doc){
        const db = await connect();
        const collection = db.collection(name);

        const res = await collection.insertOne(doc);

        return await handle.get(res.insertedId);
      },
      async patch(id, doc){
        const db = await connect();
        const collection = db.collection(name);

        await collection.updateOne(
          { _id: ObjectId(id) },
          { $set: doc }
        );

        return await handle.get(id);
      },
      async remove(id){
        const db = await connect();
        const collection = db.collection(name);

        const doc = await handle.get(id);
        if (!doc)
          return null;

        await collection.deleteOne({ _id: ObjectId(id) });

        return doc;
      },
      stop(){
        client.close();
      }
    }

    return handle;
  };
};