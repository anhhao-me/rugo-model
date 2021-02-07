const Datastore = require('nedb');
const uniqid = require('uniqid');

module.exports = _ => {
  const dbs = {};

  return name => {
    if (!dbs[name]){
      dbs[name] = new Datastore();
    }

    const db = dbs[name];

    const handle = {
      id(id){
        if (!id)
          return uniqid();
        return id;
      },
      async list(_query){
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
      
        let queryBuilder = db.find(query);
      
        if (controls.$sort !== null){
          queryBuilder = queryBuilder.sort(controls.$sort);
        }
      
        if (controls.$skip){
          queryBuilder = queryBuilder.skip(controls.$skip);
        }
      
        if (controls.$limit !== null && controls.$limit !== undefined && controls.$limit !== -1){
          queryBuilder = queryBuilder.limit(controls.$limit);
        }
        
        return {
          total: await (new Promise(resolve => db.count(query, (err, count) => resolve(count)))),
          limit: controls.$limit,
          skip: controls.$skip,
          data: await (new Promise(resolve => queryBuilder.exec( (err, docs) => resolve(docs) )))
        };
      },
      get(id){
        return new Promise((resolve, _) => {
          db.findOne({ _id: id }, (_, doc) => {
            resolve(doc);
          });
        });
      },
      create(doc){
        return new Promise((resolve, _) => {
          db.insert(Object.assign({ _id: handle.id() }, doc), (_, newDoc) => {
            resolve(newDoc);
          });
        });
      },
      patch(id, doc) {
        return new Promise((resolve, _) => {
          db.update({ _id: id }, { $set: doc }, async () => {
            const updatedDoc = await handle.get(id);
            resolve(updatedDoc);
          });
        });
      },
      remove(id){
        return new Promise(async (resolve, _) => {
          const doc = await handle.get(id);
          db.remove({ _id: id }, () => {
            resolve(doc);
          });
        });
      }
    }

    return handle;
  };
};