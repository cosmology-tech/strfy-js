import { jsStringify, JSStringifyOptions, JSStringifyPropertyReplacerOptions, JSStringifySetterOptions } from "../src";
import assetList from '../__fixtures__/assetlist.schema.json';

it('AssetList Modification', () => {
  const options: JSStringifyOptions = {
    space: 2,
    propertyRenameMap: {
      '/$defs/asset/properties/type_asset': 'asset_type',
      '/$defs/asset/if/properties/type_asset': 'asset_type'
    },
    valueReplacer: {
      '/$defs/asset/if/required': (opts: JSStringifyPropertyReplacerOptions<any, any>) => {
        return ['asset_type']
      },
    }
  };
  const jsonString = jsStringify(assetList, options);
  expect(jsonString).toMatchSnapshot();
});
