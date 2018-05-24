'use strict'

const Serializer = require(`${process.cwd()}/lib/serializer`)

test('get random cipher key fallback default', () => {
  let serializer = new Serializer()
  expect(serializer).toBeTruthy()
})

test('encode payload', () => {
  let serializer = new Serializer()
  let data = 'abcdef'
  expect(serializer.encode(data)).not.toBe(data)
})

test('encodes-decodes payload strings', () => {
  let serializer = new Serializer()
  let data = '123xyz'
  let encrypted = serializer.encode(data)
  expect(serializer.decode(encrypted)).toBe(data)
})

test('encodes-decodes payload numbers', () => {
  let serializer = new Serializer()
  let data = 37128937218
  let encrypted = serializer.encode(data)
  expect(serializer.decode(encrypted)).toBe(data)
})

test('encodes-decodes payload booleans', () => {
  let serializer = new Serializer()

  let testCases = [true, false, 'true', 'false']
  testCases
    .forEach((data) => {
      let encrypted = serializer.encode(data)
      expect(serializer.decode(encrypted)).toBe(data)
    })
})

test('encodes-decodes payload data Object', () => {
  let serializer = new Serializer()
  let data = { abc: 123, xyz: { def: 'jkl' } }
  let encrypted = serializer.encode(data)
  expect(serializer.decode(encrypted)).toEqual(data)
})
