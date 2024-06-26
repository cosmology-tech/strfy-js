import { jsStringify, JSStringifyPropertyReplacerOptions, JSStringifyReplacer } from '../src';

it('serializes simple objects without quotes on keys where possible', () => {
  const obj = {
    id: 1,
    name: 'Alice',
    isActive: true
  };
  const output = jsStringify(obj);
  expect(output).toMatchSnapshot();
});

it('handles complex nested objects with arrays', () => {
  const obj = {
    user: {
      id: 2,
      details: {
        name: 'Bob',
        hobbies: ['skiing', 'cycling']
      }
    }
  };
  const output = jsStringify(obj, { space: 2 });
  expect(output).toMatchSnapshot();
});

it('uses single quotes for strings by default', () => {
  const obj = {
    greeting: "Hello, world!"
  };
  const output = jsStringify(obj);
  expect(output).toMatchSnapshot();
});

it('switches to backticks when single quotes are in the string', () => {
  const obj = {
    message: "It's a wonderful day!"
  };
  const output = jsStringify(obj);
  expect(output).toMatchSnapshot();
});

it('uses double quotes when backticks and single quotes are present', () => {
  const obj = {
    quote: "`This` is 'awesome'!"
  };
  const output = jsStringify(obj, { quotes: 'double' });
  expect(output).toMatchSnapshot();
});

it('properly escapes strings when necessary', () => {
  const obj = {
    complexString: "She said, \"That's `incredible`!\""
  };
  const output = jsStringify(obj, { quotes: 'double' });
  expect(output).toMatchSnapshot();
});

it('applies replacer function if provided', () => {
  const obj = {
    firstName: 'Alice',
    lastName: 'Johnson',
    age: 30
  };
  const valueReplacer = (opts: JSStringifyPropertyReplacerOptions<any, any>) => {
    if (opts.currentKey === 'age') return 45;
    return opts.value;
  };
  const output = jsStringify(obj, {
    valueReplacer: {
      '/age': valueReplacer
    }
  });
  expect(output).toMatchSnapshot();
});

it('serializes objects with keys starting with $ correctly', () => {
  const obj = {
    $id: 1,
    name: 'Alice',
    $type: 'user'
  };
  const output = jsStringify(obj);
  expect(output).toMatchSnapshot();
});

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
