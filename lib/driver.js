const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('driver:mongodb');

module.exports = uri => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(uri, { useUnifiedTopology: true }, function(err, _client) {
      if (err){
        reject(err);
        return;
      }
  
      const client = _client;
      debug('Create new mongodb instance');
      resolve(client);
    });
  });
};