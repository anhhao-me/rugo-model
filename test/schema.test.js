const { expect } = require('chai');
const { getType } = require('../lib')

describe('Schema', () => {
  it('should simple schema', async () => {
    const raw = 'hello';
    
    const result = getType({
      type: 'text'
    })(raw);

    expect(result).to.be.equal(raw);
  });
});