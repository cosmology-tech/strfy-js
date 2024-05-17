import { jsStringify } from "../src";

import assetList from '../__fixtures__/assets.json';

it('assetlist', () => {
  expect(jsStringify(assetList, { camelCase: true, space: 2 })).toMatchSnapshot();
});