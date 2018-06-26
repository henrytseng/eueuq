const Serializer = require('../../lib/serializer');

function _getRandom() { return Math.round(Math.random() * 0xffffff).toString(16); }

describe('Serializer', () => {

  test('get random cipher key fallback default', () => {
    let serializer = Serializer({ cipherKey: _getRandom() });
    expect(serializer).toBeTruthy();
  });

  test('encode payload', () => {
    let serializer = Serializer({ cipherKey: _getRandom() });
    let data = 'abcdef';
    expect(serializer.encode(data)).not.toBe(data);
  });

  test('encodes-decodes payload strings', () => {
    let serializer = Serializer({ cipherKey: _getRandom() });
    let data = '123xyz';
    let encrypted = serializer.encode(data);
    expect(serializer.decode(encrypted)).toBe(data);
  });

  test('encodes-decodes payload numbers', () => {
    let serializer = Serializer({ cipherKey: _getRandom() });
    let data = 37128937218;
    let encrypted = serializer.encode(data);
    expect(serializer.decode(encrypted)).toBe(data);
  });

  test('encodes-decodes payload booleans', () => {
    let serializer = Serializer({ cipherKey: _getRandom() });

    let testCases = [true, false, 'true', 'false'];
    testCases
      .forEach((data) => {
        let encrypted = serializer.encode(data);
        expect(serializer.decode(encrypted)).toBe(data);
      });
  });

  test('encodes-decodes payload data Object', () => {
    let serializer = Serializer({ cipherKey: _getRandom() });
    let data = { abc: 123, xyz: { def: 'jkl' } };
    let encrypted = serializer.encode(data);
    expect(serializer.decode(encrypted)).toEqual(data);
  });

});
