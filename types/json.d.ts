import { JSStringifyOptions } from "./js";
export interface JSONStringifyOptions extends Omit<JSStringifyOptions, 'json'> {
}
export declare function jsonStringify(obj: any, options?: JSONStringifyOptions): string;
