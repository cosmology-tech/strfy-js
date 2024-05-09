import { minimatch } from "minimatch";
import { jsStringify } from "../src";

const assetlist = {
  "$schema": "../assetlist.schema.json",
  "chain_name": "comdex",
  "assets": [
    {
      "description": "Native Token of Comdex Protocol",
      "denom_units": [
        {
          "denom": "ucmdx",
          "exponent": 0
        },
        {
          "denom": "cmdx",
          "exponent": 6
        }
      ],
      "base": "ucmdx",
      "name": "Comdex",
      "display": "cmdx",
      "symbol": "CMDX",
      "logo_URIs": {
        "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmdx.png",
        "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmdx.svg"
      },
      "coingecko_id": "comdex",
      "images": [
        {
          "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmdx.png",
          "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmdx.svg"
        }
      ]
    },
    {
      "type_asset": "sdk.Coin",
      "description": "Governance Token of Harbor protocol on Comdex network",
      "denom_units": [
        {
          "denom": "uharbor",
          "exponent": 0
        },
        {
          "denom": "harbor",
          "exponent": 6
        }
      ],
      "base": "uharbor",
      "name": "Harbor",
      "display": "harbor",
      "symbol": "HARBOR",
      "logo_URIs": {
        "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/harbor.png",
        "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/harbor.svg"
      },
      "coingecko_id": "harbor-2",
      "images": [
        {
          "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/harbor.png",
          "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/harbor.svg"
        }
      ]
    },
    {
      "description": "Stable Token of Harbor protocol on Comdex network",
      "denom_units": [
        {
          "denom": "ucmst",
          "exponent": 0
        },
        {
          "denom": "cmst",
          "exponent": 6
        }
      ],
      "base": "ucmst",
      "name": "CMST",
      "display": "cmst",
      "symbol": "CMST",
      "logo_URIs": {
        "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmst.png",
        "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmst.svg"
      },
      "coingecko_id": "composite",
      "images": [
        {
          "png": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmst.png",
          "svg": "https://raw.githubusercontent.com/cosmos/chain-registry/master/comdex/images/cmst.svg"
        }
      ]
    }
  ]
};


it('assetlist', () => {

  const options = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      "/assets/*/denom_units": "denominations",
      "/assets/[0-1]/logo_URIs": "logos"
    }
  };

  const jsonString = jsStringify(assetlist, options);

  expect(jsonString).toMatchSnapshot();
});

function propertyReplacer(
  currentKey: string,
  currentPath: string,
  propertyRenameMap: { [pattern: string]: string }
): string {
  let finalKey = currentKey;
  Object.keys(propertyRenameMap).forEach(pattern => {
    if (minimatch(currentPath, pattern)) {
      finalKey = propertyRenameMap[pattern];
    }
  });
  return finalKey;
}

it('replacer', () => {
  const options = {
    camelCase: true,
    space: 2,
    propertyRenameMap: {
      "/assets/*/denom_units": "denominations",
      "/assets/[0-1]/logo_URIs": "logos"
    },
    propertyReplacer
  };
  const jsonString = jsStringify(assetlist, options);
  expect(jsonString).toMatchSnapshot();
});