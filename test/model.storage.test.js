const { Model, Storage } = require('../lib');
const { expect, assert } = require('chai');
const randomString = require('randomstring');
const fs = require('fs');
const path = require('path');
const { Readable } = require("stream");
const uniqid = require('uniqid');
const { createCanvas } = require('canvas');
const { FilePath } = Storage;

describe('Model Storage', () => {
  const tmpDir = path.join(__dirname, './tmp');

  const s = Storage({
    secret: randomString.generate(32),
    root: path.join(__dirname, './tmp/storage')
  });

  const TestFileModel = Model(s, 'tests', Storage.schema);

  beforeEach(async () => {
    if (fs.existsSync(tmpDir)){
      fs.rmdirSync(tmpDir, { recursive: true });
    }
    fs.mkdirSync(tmpDir, { recursive: true });
  });

  it('should get new id', async () => {
    const id = TestFileModel.id();
    expect(typeof id).to.be.equal('string');
  });

  it('should create a new file', async () => {
    const message = 'hello world';
    const rs = Readable.from([ message ]);

    const file = await TestFileModel.create({
      data: rs,
      type: 'text/plain'
    });

    const result = file.data.toString();
    file.data.toStream();
    file.data.toBuffer();
    expect(file).to.have.property('data');
    expect(file).to.have.property('type', 'text/plain');
    expect(result).to.be.equal(message);
  });

  it('should create a new png file', async () => {
    const canvas = createCanvas(100, 100);
    const file = await TestFileModel.create({
      data: canvas.createPNGStream(),
      type: 'text/plain'
    });

    expect(file).to.have.property('data');
    expect(file).to.have.property('type', 'image/png');
  });

  it('should create a new file width specific name', async () => {
    const message = 'hello world';
    const rs = Readable.from([ message ]);

    const file = await TestFileModel.create({
      data: rs,
      name: 'hello',
      type: 'text/plain',
    });

    const result = file.data.toString();
    expect(file).to.have.property('data');
    expect(file).to.have.property('name', 'hello');
    expect(file).to.have.property('type', 'text/plain');
    expect(result).to.be.equal(message);
  });

  it('should not create a new file because no data', async () => {
    try {
      await TestFileModel.create({
        type: 'text/plain'
      });
    } catch(err){
      expect(err.message).to.be.equal('No file data');
      return;
    }

    assert.fail();
  });

  it('should not create a new file because no type', async () => {
    try {
      const message = 'hello world';
      const rs = Readable.from([ message ]);

      await TestFileModel.create({
        data: rs,
      });
    } catch(err){
      expect(err.message).to.be.equal('Cannot detect file type');
      return;
    }

    assert.fail();
  });

  it('should create a new directory', async () => {
    const file = await TestFileModel.create({
      type: 'inode/directory'
    });

    expect(file).not.to.have.property('data');
    expect(file).to.have.property('type', 'inode/directory');
  });

  it('should create a new file width specific name and dir', async () => {
    const message = 'hello world';
    const rs = Readable.from([ message ]);

    const file = await TestFileModel.create({
      data: rs,
      name: 'hello',
      dir: 'foo/bar',
      type: 'text/plain',
    });

    const result = file.data.toString();
    expect(file).to.have.property('data');
    expect(file).to.have.property('name', 'hello');
    expect(file).to.have.property('dir', 'foo/bar');
    expect(file).to.have.property('type', 'text/plain');
    expect(result).to.be.equal(message);
  });

  it('should not get non-exists file', async () => {
    const file = await TestFileModel.get(uniqid());
    expect(file).to.be.equal(null);
  });

  it('should list', async () => {
    const list = await TestFileModel.list();
    expect(list).to.have.property('total');
    expect(list).to.have.property('limit');
    expect(list).to.have.property('skip');
    expect(list).to.have.property('data');
  });

  it('should list empty', async () => {
    const list = await TestFileModel.list({
      dir: 'abc/xyz'
    });

    expect(list).to.have.property('total');
    expect(list.total).to.be.equal(0);
    expect(list).to.have.property('limit');
    expect(list).to.have.property('skip');
    expect(list).to.have.property('data');
  });

  it('should patch', async () => {
    const message = 'hello world';
    const rs = Readable.from([ message ]);

    const file = await TestFileModel.create({
      data: rs,
      name: 'patchme',
      type: 'text/plain',
    });

    const filePatched = await TestFileModel.patch(file._id, {
      name: 'me',
      dir: 'foo/bar',
      type: 'text/html'
    });

    const result = filePatched.data.toString();
    expect(filePatched).to.have.property('data');
    expect(filePatched).to.have.property('name', 'me');
    expect(filePatched).to.have.property('dir', 'foo/bar');
    expect(filePatched).to.have.property('type', 'text/html');
    expect(result).to.be.equal(message);
  });

  it('should not patch to non-text file', async () => {
    const message = 'hello world';
    const rs = Readable.from([ message ]);

    const file = await TestFileModel.create({
      data: rs,
      name: 'patchme',
      type: 'text/plain',
    });

    try {
      await TestFileModel.patch(file._id, {
        name: 'me',
        dir: 'foo/bar',
        type: 'image/jpg'
      });
    } catch(err){
      expect(err.message).to.be.equal('Cannot change non-text type');
      return;
    }

    assert.fail();
  });

  it('should patch content', async () => {
    const message = 'hello world';
    const rs = Readable.from([ message ]);

    const file = await TestFileModel.create({
      data: rs,
      name: 'patchme',
      type: 'text/plain',
    });

    const newMessage = 'say hi';
    const newRs = Readable.from([ newMessage ]);

    const filePatched = await TestFileModel.patch(file._id, {
      data: newRs,
      name: 'me',
      dir: 'foo/bar',
      type: 'text/html'
    });

    const result = filePatched.data.toString();
    expect(filePatched).to.have.property('data');
    expect(filePatched).to.have.property('name', 'me');
    expect(filePatched).to.have.property('dir', 'foo/bar');
    expect(filePatched).to.have.property('type', 'text/html');
    expect(result).to.be.equal(newMessage);

    const removed = await TestFileModel.get(file._id);
    expect(removed).to.be.equal(null);
  });

  it('should patch child to parent dir', async () => {
    const message = 'hello world';
    const rs = Readable.from([ message ]);

    const file = await TestFileModel.create({
      data: rs,
      name: 'patchme',
      dir: 'foo/bar',
      type: 'text/plain',
    });

    const filePatched = await TestFileModel.patch(file._id, {
      name: 'me',
      dir: '',
      type: 'text/html'
    });

    const result = filePatched.data.toString();
    expect(filePatched).to.have.property('data');
    expect(filePatched).to.have.property('name', 'me');
    expect(filePatched).to.have.property('dir', '');
    expect(filePatched).to.have.property('type', 'text/html');
    expect(result).to.be.equal(message);
  });

  it('should move dir and its content', async () => {
    const message = 'hello world';
    const rs = Readable.from([ message ]);

    const dir = await TestFileModel.create({
      name: 'rootdir',
      type: 'inode/directory',
    });

    await TestFileModel.create({
      data: rs,
      name: 'patchme',
      dir: 'rootdir',
      type: 'text/plain',
    });

    const tmp = await TestFileModel.patch(dir._id, {
      dir: 'tmpdir'
    });

    const { total } = await TestFileModel.list({ dir: tmp._id });

    expect(total).to.be.equal(1);
  });

  it('should patch only directory name', async () => {
    const file = await TestFileModel.create({
      name: 'rootdir',
      type: 'inode/directory',
    });

    const result = await TestFileModel.patch(file._id, {
      name: 'newdir'
    });

    expect(result).to.have.property('name', 'newdir');
    expect(result).to.have.property('dir', '');
    expect(result).to.have.property('type', 'inode/directory');
  });

  it('should patch only directory dir', async () => {
    const file = await TestFileModel.create({
      name: 'rootdir',
      type: 'inode/directory',
    });

    const result = await TestFileModel.patch(file._id, {
      dir: 'parentdir'
    });

    expect(result).to.have.property('name', 'rootdir');
    expect(result).to.have.property('dir', 'parentdir');
    expect(result).to.have.property('type', 'inode/directory');
  });

  it('should not move parent dir into it', async () => {
    const file = await TestFileModel.create({
      name: 'rootdir',
      type: 'inode/directory',
    });

    try {
      await TestFileModel.patch(file._id, {
        dir: 'rootdir'
      });
    } catch(err){
      expect(err.message).to.be.equal('Cannot move parent dir into it');
      return;
    }

    assert.fail();
  });

  it('should remove directory', async () => {
    const file1 = await TestFileModel.create({
      name: 'removeme',
      dir: '/foo',
      type: 'inode/directory'
    });

    const file = await TestFileModel.remove(file1._id);

    expect(file).not.to.have.property('data');
    expect(file).to.have.property('name', 'removeme');
    expect(file).to.have.property('dir', '/foo');
    expect(file).to.have.property('type', 'inode/directory');
  });

  it('should not patch non-exists file', async () => {
    const file = await TestFileModel.patch(uniqid(), {});
    expect(file).to.be.equal(null);
  });

  it('should not remove non-exists file', async () => {
    const file = await TestFileModel.remove(uniqid());
    expect(file).to.be.equal(null);
  });

  it('should get new FilePath', async () => {
    const filePath = FilePath(path.join(__dirname, 'assets/cat.jpg'))
    expect(filePath).to.have.property('path');
  });

  it('should create a new file from real', async () => {
    const file = await TestFileModel.create({
      data: FilePath(path.join(__dirname, 'assets/cat.jpg'))
    });

    expect(file).to.have.property('data');
    expect(file).to.have.property('name');
    expect(file).to.have.property('dir');
    expect(file).to.have.property('type', 'image/jpeg');
  });
});