import { jsStringify, JSStringifyOptions, JSStringifySetterOptions } from "../src";
import assetList from '../__fixtures__/assets.json';
import { Asset, AssetList } from '../test-utils';
import chain from '../__fixtures__/chain.json';

it('AssetList Modification', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      '/assets/*/type_asset': 'asset_type'
    },
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
    include: [
      '/assets/*/type_asset'
    ],
    exclude: [
      '/assets/*/denom_units'
    ]
  };
  const jsonString = jsStringify(assetList, options);
  expect(jsonString).toMatchSnapshot();
});


it('AssetList Modification', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      '/assets/*/type_asset': 'asset_type'
    },
    exclude: [
      '/assets/*/denom_units',
      '/assets/*/logo_URIs',
      '/assets/*/images/*/svg',
    ]
  };
  const jsonString = jsStringify(assetList, options);
  expect(jsonString).toMatchSnapshot();
});


it('AssetList Modification 0', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      '/assets/*/type_asset': 'asset_type'
    },
    include: [
      '/assets/*/type_asset',
      '/assets/*/denom_units',
      '/assets/*/base'
    ],
    exclude: [
      '/assets/*/denom_units/*/exponent'
    ]
  };
  const jsonString = jsStringify(assetList, options);
  expect(jsonString).toMatchSnapshot();
});

it('AssetList Modification 1', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      '/assets/*/type_asset': 'asset_type'
    },
    include: [
      '/assets/*/type_asset',
      '/assets/*/denom_units/*/denom',
      '/assets/*/base'
    ],
  };
  const jsonString = jsStringify(assetList, options);
  expect(jsonString).toMatchSnapshot();
});

it('AssetList Modification 2', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      '/assets/*/type_asset': 'asset_type'
    },
    include: [
      '/assets/*/type_asset',
      '/assets/*/denom_units',
      '/assets/*/base'
    ],
  };
  const jsonString = jsStringify(assetList, options);
  expect(jsonString).toMatchSnapshot();
});

it('AssetList Modification 3', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      '/assets/*/type_asset': 'asset_type',
      '/assets/*/logo_URIs': 'logos'
    },
    include: [
      '/assets/*/logo_URIs',
      '/assets/*/denom_units',
    ],
    exclude: [
      '/assets/*/logo_URIs/svg'
    ],
  };
  const jsonString = jsStringify(assetList, options);
  expect(jsonString).toMatchSnapshot();
});

it('Chain Modification 3', () => {
  const options: JSStringifyOptions = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {

    },
    include: [
      '/fees/fee_tokens',
      '/bech32_prefix',
      '/chain_id',
      '/pretty_name',
      '/chain_name',
      '/codebase/cosmos_sdk_version',
      '/codebase/cosmwasm_version',
      '/codebase/cosmwasm_enabled',
      '/codebase/versions/*/name',
    ],
    exclude: [
    ],
  };
  const jsonString = jsStringify(chain, options);
  expect(jsonString).toMatchSnapshot();
});

