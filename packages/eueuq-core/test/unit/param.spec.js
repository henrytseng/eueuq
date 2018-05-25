'use strict';

const params = require(`${process.cwd()}/lib/param`);

test('value equivalency', () => {
  expect(params({ abc: 1, def: 2 })).toEqual({ abc: 1, def: 2 });
});

test('properties not altered', () => {
  let data = { abc: 1, def: 2 };
  let parametrizedData = params(data);
  expect(Object.keys(parametrizedData).indexOf('require')).toEqual(-1);
  expect(Object.keys(parametrizedData).indexOf('permit')).toEqual(-1);
});

test('missing property throws an error when required', () => {
  let data = { abc: 1, def: 2 };
  expect(() => {
    params(data).require('xyz');
  }).toThrowError('A required parameter is missing');
});

test('missing property allowed when permitted', () => {
  let data = { abc: 1, def: 2 };
  let parametrizedData = params(data).permit('def');
  expect(parametrizedData).toEqual({ def: 2 });
});
