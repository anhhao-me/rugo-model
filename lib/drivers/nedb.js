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
      id(){
        return uniqid()
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