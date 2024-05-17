import { minimatch } from "minimatch";
import { jsStringify, JSStringifyOptions, JSStringifyReplacer, JSStringifyPropertyReplacerOptions, JSStringifySetterOptions } from "../src";

import assetList from '../__fixtures__/assets.json';

it('assetlist', () => {

  const options = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      "/assets/*/denom_units": "denominations",
      "/assets/[0-1]/logo_URIs": "logos"
    }
  };

  const jsonString = jsStringify(assetList, options);

  expect(jsonString).toMatchSnapshot();
});

function propertyReplacer(options: JSStringifyPropertyReplacerOptions<any, any>): string {
  let finalKey = options.currentKey;
  Object.keys(options.propertyRenameMap).forEach(pattern => {
    if (minimatch(options.currentPath, pattern)) {
      finalKey = options.propertyRenameMap[pattern];
    }
  });
  return finalKey;
}

it('replacer', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      "/assets/*/denom_units": "denominations",
      "/assets/[0-1]/logo_URIs": "logos"
    },
    propertyReplacer
  };
  const jsonString = jsStringify(assetList, options);
  expect(jsonString).toMatchSnapshot();
});
