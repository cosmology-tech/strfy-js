import { jsStringify } from '../src';

it('serializes arrays without newlines when length is below the inlineArrayLimit', () => {
  const obj = {
    numbers: [1, 2, 3]
  };
  const options = {
    inlineArrayLimit: 3
  };
  const output = jsStringify(obj, options);
  expect(output).toMatchSnapshot();
});

it('serializes arrays without newlines when length exceeds the inlineArrayLimit', () => {
  const obj = {
    numbers: [1, 2, 3, 4, 5]
  };
  const options = {
    inlineArrayLimit: 3
  };
  const output = jsStringify(obj, options);
  expect(output).toMatchSnapshot();
});
it('serializes arrays with newlines when length exceeds the inlineArrayLimit with space set', () => {
  const obj = {
    numbers: [1, 2, 3, 4, 5]
  };
  const options = {
    inlineArrayLimit: 3,
    space: 2
  };
  const output = jsStringify(obj, options);
  expect(output).toMatchSnapshot();
});

it('serializes arrays without newlines when length equals the inlineArrayLimit', () => {
  const obj = {
    numbers: [1, 2, 3, 4, 5]
  };
  const options = {
    inlineArrayLimit: 5,
    space: 2
  };
  const output = jsStringify(obj, options);
  expect(output).toMatchSnapshot();
});

it('handles nested arrays with inlineArrayLimit', () => {
  const obj = {
    matrix: [
      [1, 2],
      [3, 4]
    ]
  };
  const options = {
    inlineArrayLimit: 2, // Applies to inner arrays
    space: 2
  };
  const output = jsStringify(obj, options);
  expect(output).toMatchSnapshot();
});
