import { jsStringify } from '../src';

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
  const replacer = (key: string, value: any) => {
    if (key === 'age') return undefined;
    return value;
  };
  const output = jsStringify(obj, { replacer });
  expect(output).toMatchSnapshot();
});

