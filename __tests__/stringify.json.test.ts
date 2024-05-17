import { jsonStringify, JSStringifyPropertyReplacerOptions } from '../src';

it('serializes simple objects without quotes on keys where possible', () => {
  const obj = {
    id: 1,
    name: 'Alice',
    isActive: true
  };
  const output = jsonStringify(obj);
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
  const output = jsonStringify(obj, { space: 2 });
  expect(output).toMatchSnapshot();
});

it('uses single quotes for strings by default', () => {
  const obj = {
    greeting: "Hello, world!"
  };
  const output = jsonStringify(obj);
  expect(output).toMatchSnapshot();
});

it('switches to backticks when single quotes are in the string', () => {
  const obj = {
    message: "It's a wonderful day!"
  };
  const output = jsonStringify(obj);
  expect(output).toMatchSnapshot();
});

it('uses double quotes when backticks and single quotes are present', () => {
  const obj = {
    quote: "`This` is 'awesome'!"
  };
  const output = jsonStringify(obj, { quotes: 'double' });
  expect(output).toMatchSnapshot();
});

it('properly escapes strings when necessary', () => {
  const obj = {
    complexString: "She said, \"That's `incredible`!\""
  };
  const output = jsonStringify(obj, { quotes: 'double' });
  expect(output).toMatchSnapshot();
});

interface Person {
  firstName: string;
  lastName: string;
  age: number
}

it('applies replacer function if provided', () => {
  const obj: Person[] = [
    {
      firstName: 'Alice',
      lastName: 'Johnson',
      age: 30
    },
    {
      firstName: 'Dana',
      lastName: 'Johnson',
      age: 30
    }
  ]
  const output = jsonStringify(obj, {
    valueReplacer: {
      '*': (opts: JSStringifyPropertyReplacerOptions<Person, Person[]>) => {
        if (opts.obj.lastName === 'Johnson') {
          if (opts.currentKey === 'age') {
            return 20;
          }
        }
        return opts.value;
      },
      '/*/age': (opts: JSStringifyPropertyReplacerOptions<Person, Person[]>) => {
        if (opts.obj.firstName === 'Dana') return 46;
        return opts.value;
      },
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
  const output = jsonStringify(obj);
  expect(output).toMatchSnapshot();
});

it('serializes arrays without newlines when length is below the inlineArrayLimit', () => {
  const obj = {
    numbers: [1, 2, 3]
  };
  const options = {
    inlineArrayLimit: 3
  };
  const output = jsonStringify(obj, options);
  expect(output).toMatchSnapshot();
});

it('serializes arrays without newlines when length exceeds the inlineArrayLimit', () => {
  const obj = {
    numbers: [1, 2, 3, 4, 5]
  };
  const options = {
    inlineArrayLimit: 3
  };
  const output = jsonStringify(obj, options);
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
  const output = jsonStringify(obj, options);
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
  const output = jsonStringify(obj, options);
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
  const output = jsonStringify(obj, options);
  expect(output).toMatchSnapshot();
});
