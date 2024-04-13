interface StringifyOptions {
    space?: number;
    replacer?: (this: any, key: string, value: any) => any | null;
    quotes?: 'single' | 'double';
    inlineArrayLimit?: number;
    camelCase?: boolean;
    camelCaseFn?: (str: string) => string;
}
export declare function chooseQuotes(str: string, preferred: 'single' | 'double' | 'backtick'): string;
export declare function jsStringify(obj: any, options?: StringifyOptions): string;
export {};
