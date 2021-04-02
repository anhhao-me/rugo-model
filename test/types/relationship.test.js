const { expect, assert } = require('chai');
const { Types } = require('../../lib');
const { ObjectId } = require('mongodb');

describe('checkbox', () => {
  it('should be relationship', () => {
    const value = ObjectId();
    expect(Types.relationship(value).toString()).to.be.equal(value.toString());
  });

  it('should be transform relationship from string', () => {
    const value = ObjectId().toString();
    expect(Types.relationship(value).toString()).to.be.equal(value);
  });

  it('should be not relationship', () => {
    const value = 'norel';
    
    try {
      Types.relationship(value);
    } catch(err){
      expect(err.message).to.be.equal(`"${value}" is not a relationship`);
      return;
    }
    assert.fail();
  });
});