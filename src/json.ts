import { jsStringify, JSStringifyOptions } from "./js";

export interface JSONStringifyOptions extends Omit<JSStringifyOptions, 'json'> { }

export function jsonStringify(obj: any, options?: JSONStringifyOptions): string {
  // Set json option to true and spread the rest of the options
  return jsStringify(obj, { ...options, json: true });
}
