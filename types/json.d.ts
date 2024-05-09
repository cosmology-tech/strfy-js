export interface JSONStringifyOptions {
    space?: number;
    replacer?: (this: any, key: string, value: any) => any;
    quotes?: 'single' | 'double';
    inlineArrayLimit?: number;
    camelCase?: boolean;
    camelCaseFn?: (str: string) => string;
}
export declare function jsonStringify(obj: any, options?: JSONStringifyOptions): string;
