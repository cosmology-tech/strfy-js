import { jsStringify } from "../src";

const chain = {
  "$schema": "schema.json",
  "chain_id": "cosmos-1",
  "logo_URIs": {
    "png": "cosmos.png"
  },
  "binaries": {
    "linux/amd64": "cosmos-bin.tar.gz"
  }
};

it('chain', () => {
  expect(jsStringify(chain, { camelCase: true, space: 2 })).toMatchSnapshot();
});