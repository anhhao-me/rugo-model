const { ObjectId } = require('mongodb');
const Types = require('./types');

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
  const collection = db.collection(modelId);
  let isPreHandle = false;

  const preHandle = async () => {
    if (isPreHandle)
      return;

    isPreHandle = true;

    // unique and index
    const uniqueFields = {};
    const indexFields = {};
  
    for (const [fieldName, fieldSchema] of Object.entries(modelSchema)){
      if (fieldSchema.index)
        indexFields[fieldName] = 1;

      if (fieldSchema.unique)
        uniqueFields[fieldName] = 1;
    }

    if (Object.keys(uniqueFields).length)
      await collection.createIndex(uniqueFields, { unique: true });

    if (Object.keys(indexFields).length)
      await collection.createIndex(indexFields);
  }

  // precheck schema
  for (const [fieldName, fieldSchema] of Object.entries(modelSchema)){
    if (!fieldSchema.type)
      throw new Error(`"${fieldName}" type must be specific`);

    let typeName = fieldSchema.type.toLowerCase().trim();
    if (!Types[typeName])
      throw new Error(`wrong type "${typeName}" for field "${fieldName}"`)
  }

  // main handle
  return {
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
        let typeName = fieldSchema.type.toLowerCase().trim();
        let value = Types[typeName](doc[fieldName], fieldSchema);
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

      const { doc: rawDoc, controls } = extractControls(doc, ['$inc']);
      const patchedDoc = {};

      for (let fieldName in modelSchema) {
        let fieldSchema = modelSchema[fieldName];
        let typeName = fieldSchema.type.toLowerCase().trim();

        if (rawDoc[fieldName] === undefined)
          continue;

        if (rawDoc[fieldName] === null)
          patchedDoc[fieldName] = null;
        else
          patchedDoc[fieldName] = Types[typeName](rawDoc[fieldName], fieldSchema);
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
    }
  }
}

module.exports = Model;