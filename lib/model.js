const { ObjectId } = require('mongodb');
const { getType } = require('./type');

const DEFAULT_LIMIT = 10;

const extractControls = (doc, controlNames) => {
  const controls = {};
  const newDoc = {};

  for (let key in doc){
    if (controlNames.indexOf(key) !== -1){
      controls[key] = doc[key];
      continue;
    }

    newDoc[key] = doc[key];
  }

  return {
    controls, 
    doc: newDoc
  };
}

const Model = (db, modelId, modelSchema) => {
  let isPreHandle = false;
  let collection;

  const preHandle = async () => {
    if (isPreHandle)
      return;

    collection = typeof db === 'function' ? db().collection(modelId) : db.collection(modelId);
    isPreHandle = true;

    // unique and index
    const uniqueFields = {};
    const indexFields = {};
  
    for (const [fieldName, fieldSchema] of Object.entries(modelSchema)){
      let indexType = fieldSchema.type.toLowerCase() === 'text' ? 'text' : 1;

      if (fieldSchema.index)
        indexFields[fieldName] = indexType;

      if (fieldSchema.unique)
        uniqueFields[fieldName] = indexType;
    }

    if (Object.keys(uniqueFields).length)
      await collection.createIndex(uniqueFields, { unique: true });

    if (Object.keys(indexFields).length)
      await collection.createIndex(indexFields);
  }

  // precheck schema
  for (const [fieldName, fieldSchema] of Object.entries(modelSchema)){
    getType(fieldSchema, fieldName);
  }

  // main handle
  return {
    // normal handles
    async get(id){
      await preHandle();

      try {
        ObjectId(id);
      } catch (err){
        return null;
      }

      return await collection.findOne({ _id: ObjectId(id) });
    },
    async list(query){
      await preHandle();

      const { doc: doQuery, controls } = extractControls(query, [
        '$sort', 
        '$limit', 
        '$skip'
      ]);
    
      let queryBuilder = collection.find(doQuery);
    
      if (controls.$sort){
        queryBuilder = queryBuilder.sort(controls.$sort);
      }
    
      if (controls.$skip){
        queryBuilder = queryBuilder.skip(controls.$skip);
      }

      if (controls.$limit !== -1){
        if (typeof controls.$limit !== 'number')
          controls.$limit = DEFAULT_LIMIT;

        queryBuilder = queryBuilder.limit(controls.$limit);
      }

      return {
        total: await collection.countDocuments(doQuery),
        limit: controls.$limit,
        skip: controls.$skip || 0,
        data: await queryBuilder.toArray()
      };
    },
    async create(doc){
      await preHandle();

      const insertedDoc = {};

      // validate and transform data
      for (let fieldName in modelSchema) {
        let fieldSchema = modelSchema[fieldName];
        let value = getType(fieldSchema)(doc[fieldName]);
        if (value !== null && value !== undefined){
          insertedDoc[fieldName] = value;
        }

        // default value
        if ((value === null || value === undefined) && fieldSchema.default !== undefined){
          insertedDoc[fieldName] = fieldSchema.default;
        }
      }
    
      // default properties
      insertedDoc['createdAt'] = new Date();
      insertedDoc['updatedAt'] = new Date();
      insertedDoc['version'] = 1;

      // do create
      const res = await collection.insertOne(insertedDoc);
      return await this.get(res.insertedId);
    },
    async patch(id, doc){
      await preHandle();

      const { doc: rawDoc, controls } = extractControls(doc, ['$inc', '$push']);
      const patchedDoc = {};

      for (let fieldName in modelSchema) {
        let fieldSchema = modelSchema[fieldName];

        if (rawDoc[fieldName] === undefined)
          continue;

        if (rawDoc[fieldName] === null)
          patchedDoc[fieldName] = null;
        else
          patchedDoc[fieldName] = getType(fieldSchema)(rawDoc[fieldName]);
      }

      // default properties
      patchedDoc['updatedAt'] = new Date();
      controls.$inc = controls.$inc || {};
      controls.$inc.version = 1;
      controls.$set = patchedDoc;

      const query = { _id: ObjectId(id) };

      for (let [fieldName, fieldSchema] of Object.entries(modelSchema)){
        // $inc control
        let incAmount = controls.$inc[fieldName];
        if (incAmount){
          // min trigger
          if (incAmount < 0 && fieldSchema.min !== undefined){
            query[fieldName] = { $gte: fieldSchema.min - incAmount };
          }

          // max trigger
          if (incAmount > 0 && fieldSchema.max !== undefined){
            query[fieldName] = { $lte: fieldSchema.max - incAmount}
          }
        }

        // $push control
        if (controls.$push && controls.$push[fieldName] !== undefined){
          let pushValue = controls.$push[fieldName];
          if (typeof pushValue === 'object' && (pushValue.$each || pushValue.$slice)){
            controls.$push[fieldName] = pushValue;
            controls.$push[fieldName].$each = (pushValue.$each || []).map(value => getType(fieldSchema)([value])[0])
          } else {
            controls.$push[fieldName] = {
              $each: getType(fieldSchema)([pushValue])
            };
          }
        }
      }

      const res = await collection.updateOne(query, controls);
      
      if (res.modifiedCount === 0)
        throw new Error('cannot patch');

      return await this.get(id);
    },
    async remove(id){
      await preHandle();

      const doc = await this.get(id);
      if (!doc)
        return null;

      await collection.deleteOne({ _id: ObjectId(id) });
      return doc;
    },

    // extra handles
    async stats(){
      await preHandle();

      return await collection.stats();
    }
  }
}

module.exports = Model;