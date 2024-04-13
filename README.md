# strfy-js

## Stringify JSON as JavaScript 🌴

<p align="center" width="100%">
  <a href="https://github.com/pyramation/strfy-js/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/pyramation/strfy-js/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://github.com/pyramation/strfy-js/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/></a>
</p>

`strfy-js` is a custom JavaScript serialization library designed to extend the capabilities of JSON serialization. This library is particularly useful for generating JavaScript objects directly from JSON, enabling developers to work with JSON data more effectively within JavaScript environments.

## Features

### Features

- **🛠️ Extended Serialization**: Converts JSON to JavaScript objects, supporting output, such as properties without quotes, not typically handled by standard JSON. 

- **⚙️ Customizable**: Offers various options to customize the output, making it suitable for different use cases. Tailor the serialization process to meet your specific requirements.

- **⚡ Lightweight and Fast**: Optimized for performance, making it a practical choice for applications that require fast serialization of large amounts of data. Ideal for handling high-load environments efficiently.

## Installation

To install `strfy-js`, use npm or yarn:

```bash
npm install strfy-js
# or
yarn add strfy-js
``` 

## Usage

Import `jsStringify` from `strfy-js` and use it to serialize JavaScript objects:

```javascript
import { jsStringify } from 'strfy-js';

const obj = {
    name: "Alice",
    details: {
        age: 30,
        hobbies: ['reading', 'cycling']
    }
};

const options = {
    space: 2,
    quotes: 'single'
};

console.log(jsStringify(obj, options));
```

## Options

`jsStringify` accepts the following options in the `StringifyOptions` interface:

- `space` (optional): Specifies the number of spaces to use for indentation, defaults to `0`.
- `replacer` (optional): A function that alters the behavior of the stringification process by filtering and transforming the values.
- `quotes` (optional): Determines the type of quotes around strings. Can be `'single'`, `'double'`, or determined automatically to avoid escapes.
- `inlineArrayLimit` (optional): Allows arrays to be serialized inline if they have fewer elements than the specified limit.
- `camelCase` (optional): When set to `true`, object keys are transformed into camelCase.
- `camelCaseFn` (optional): A custom function that can be provided to convert object keys into camelCase using a custom transformation logic.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
