import { jsonStringify } from "../src";

import chain from '../__fixtures__/chain.json';

it('chain', () => {
  expect(jsonStringify(chain, { camelCase: true, space: 2 })).toMatchSnapshot();
});