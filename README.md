# strfy-js

<p align="center" width="100%">
  <a href="https://github.com/pyramation/strfy-js/actions/workflows/run-tests.yaml">
    <img height="20" src="https://github.com/pyramation/strfy-js/actions/workflows/run-tests.yaml/badge.svg" />
  </a>
   <a href="https://github.com/pyramation/strfy-js/blob/main/LICENSE-MIT"><img height="20" src="https://img.shields.io/badge/license-MIT-blue.svg"/></a>
</p>

`strfy-js` is a custom JavaScript serialization library that extends the capabilities of JSON serialization. This library allows property names to be unquoted if they comply with JavaScript naming conventions and provides flexible quoting options for string values, including handling special characters with alternative quotes or escaping.

## Features

- **Custom Property Naming:** Serialize JavaScript object keys without quotes if they are valid JavaScript identifiers.
- **Flexible String Quoting:** Choose between single, double, or backtick quotes for string values depending on the content to avoid escaping.
- **Pretty Printing:** Control the indentation of the output for better readability.
- **Custom Replacers:** Similar to `JSON.stringify`, a replacer function can be used to filter or alter the values before they are serialized.

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

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your enhancements. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
