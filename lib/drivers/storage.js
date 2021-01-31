const debug = require('debug')('driver:storage');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');
const streamToPromise = require('stream-to-promise');
const FileType = require('file-type');
const mime = require('mime');
const stream = require('stream');
const readChunk = require('read-chunk');

const DIR_TYPE = 'inode/directory';

const Storage = function({ root }){
  return name => {
    const modelRoot = path.join(root, name);

    const getInfo = async _id => {
      _id = path.normalize(_id);
      const up = path.parse(_id);
      const itemPath = path.join(modelRoot, _id);

      if (!fs.existsSync(itemPath))
        return null;
      
      return {
        _id,
        name: up.name,
        dir: up.dir,
        type: fs.statSync(itemPath).isDirectory() ? DIR_TYPE : mime.getType(itemPath)
      };
    }

    const handle = {
      id(id){
        if (!id)
          return uniqid();

        return id;
      },
      async list(_query){
        const query = Object.assign({ dir: '.' }, _query);
        const props = Object.keys(query).filter(i => i[0] !== '$');
        
        if (props.length !== 1)
          return {
            total: 0,
            limit: -1,
            skip: 0,
            data: []
          };

        query.dir = path.normalize(query.dir);
        const fullDir = path.join(modelRoot, query.dir);

        const items = fs.existsSync(fullDir) ? fs.readdirSync(fullDir) : [];

        return {
          total: items.length,
          limit: -1,
          skip: 0,
          data: await Promise.all(items.map(name => handle.get(path.join(query.dir, name))))
        }
      },
      async get(_id){
        const info = await getInfo(_id);

        if (!info)
          return info;

        if (info.type === DIR_TYPE)
          return info;

        const itemPath = path.join(modelRoot, _id);
        info.data = FilePath(itemPath);

        return info;
      },
      async create(doc){
        doc._id = path.normalize(doc._id);
        const up = path.parse(doc._id);
        if (doc.name !== undefined)
          up.name = path.normalize(doc.name);
        if (doc.dir !== undefined)
          up.dir = path.normalize(doc.dir);

        const reGenDocId = () => {
          up.base = `${up.name}${up.ext}`;
          doc._id = path.join(up.dir, up.base);
        }

        reGenDocId();

        // create dir
        const dir = path.join(modelRoot, up.dir);
        await fs.promises.mkdir(dir, { recursive: true });

        // directory type
        if (doc.type === 'inode/directory'){
          await fs.promises.mkdir(path.join(dir, up.base));
          return await handle.get(doc._id);
        }

        // file type
        if (!doc.data)
          throw new Error('No file data');

        let fileType;
        let fileTypeStream, readStream;

        if (doc.data instanceof FilePath){
          fileType = await doc.data.getType();
        } else {
          fileTypeStream = doc.data.pipe(new stream.PassThrough());
          readStream = doc.data.pipe(new stream.PassThrough());
          fileType = await FileType.fromStream(fileTypeStream);
        }

        // file type check
        if (!fileType && !(doc.type && doc.type.indexOf('text') === 0))
          throw new Error('Cannot detect file type');

        if (!fileType)
          fileType = mime.getExtension(doc.type);
        else
          fileType = fileType.ext;

        up.ext = `.${fileType}`;
        reGenDocId();

        // write to file
        if (doc.data instanceof FilePath){
          doc.data.writeTo(path.join(dir, up.base));
        } else {
          const ws = fs.createWriteStream(path.join(dir, up.base));
          readStream.pipe(ws);
          await streamToPromise(ws);
        }

        return await handle.get(doc._id);
      },
      async patch(id, doc){
        const lastDoc = await handle.get(id);
        if (!lastDoc)
          return null;

        const newDoc = Object.assign({}, lastDoc, doc);
        const createdDoc = await handle.create(newDoc);

        await handle.remove(id);

        return createdDoc;
      },
      async remove(id){
        const doc = await handle.get(id);
        if (!doc)
          return null;

        fs.rmdirSync(path.join(modelRoot, doc._id), { recursive: true });

        return doc;
      }
    }

    return handle;
  };
};

Storage.schema = {
  name: {
    type: 'Text'
  },
  dir: {
    type: 'Text'
  },
  type: {
    type: 'Text'
  },
  data: {
    type: 'Any'
  }
}

function FilePath(path){
  if (!(this instanceof FilePath)) return new FilePath(path);
  this.path = path;
}

FilePath.prototype.getType = async function(){
  return await FileType.fromBuffer(readChunk.sync(this.path, 0, 4100));
}

FilePath.prototype.writeTo = async function(dest){
  fs.copyFileSync(this.path, dest);
}

FilePath.prototype.toStream = function(){
  return fs.createReadStream(this.path);
}

FilePath.prototype.toBuffer = function(){
  return fs.readFileSync(this.path);
}

FilePath.prototype.toString = function(){
  return fs.readFileSync(this.path).toString();
}

Storage.FilePath = FilePath;

module.exports = Storage;