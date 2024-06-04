import { jsStringify, JSStringifyOptions, JSStringifySetterOptions } from "../src";
import { Asset, AssetList } from '../test-utils';
import assetList from '../__fixtures__/assets.json';
import assetList2 from '../__fixtures__/assets2.json';

it('defaultValue', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    defaultValuesSetter: {
      "/assets/*/type_asset": function (options: JSStringifySetterOptions<Asset, AssetList>): any {
        const asset = options.obj;
        switch (true) {
          case asset.base.startsWith('factory/'):
            return 'sdk.Factory';

          case asset.base.startsWith('ft') && options.root.chain_name === 'bitsong':
            return 'bitsong';

          case asset.base.startsWith('erc20/'):
            return 'erc.Token';

          case asset.base.startsWith('ibc/'):
            return 'ibc'

          case asset.base.startsWith('cw20:'):
            return 'cw20'

          default:
            return 'unknown'
        }
      }
    },
    propertyRenameMap: {
      '/assets/*/type_asset': 'asset_type'
    }
  };
  const jsonString = jsStringify(assetList, options);
  expect(jsonString).toMatchSnapshot();
});

it('defaultValue undefined', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    defaultValuesSetter: {
      "/assets/*/type_asset": function (options: JSStringifySetterOptions<Asset, AssetList>): any {
        const asset = options.obj;
        switch (true) {
          case asset.base.startsWith('factory/'):
            return 'sdk.Factory';

          case asset.base.startsWith('ft') && options.root.chain_name === 'bitsong':
            return 'bitsong';

          case asset.base.startsWith('erc20/'):
            return 'erc.Token';

          case asset.base.startsWith('ibc/'):
            return 'ibc'

          case asset.base.startsWith('cw20:'):
            return 'cw20'

          default:
            return;
        }
      }
    },
    propertyRenameMap: {
      '/assets/*/type_asset': 'asset_type'
    }
  };
  const jsonString = jsStringify(assetList2, options);
  expect(jsonString).toMatchSnapshot();
});