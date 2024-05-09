import { jsStringify } from "../src";

import chain from '../__fixtures__/chain.json';

it('chain', () => {
  expect(jsStringify(chain, { camelCase: true, space: 2 })).toMatchSnapshot();
});