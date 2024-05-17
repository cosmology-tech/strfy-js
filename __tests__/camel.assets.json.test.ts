import { jsonStringify } from "../src";

import assetList from '../__fixtures__/assets.json';

it('assetlist', () => {
  expect(jsonStringify(assetList, { camelCase: true, space: 2 })).toMatchSnapshot();
});