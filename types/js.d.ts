export interface JSStringifyOptions {
    space?: number;
    replacer?: (this: any, key: string, value: any) => any | null;
    quotes?: 'single' | 'double' | 'backtick';
    inlineArrayLimit?: number;
    camelCase?: boolean;
    camelCaseFn?: (str: string) => string;
    propertyRenameMap?: {
        [key: string]: string;
    };
}
export declare function chooseQuotes(str: string, preferred: 'single' | 'double' | 'backtick'): string;
export declare function jsStringify(obj: any, options?: JSStringifyOptions): string;
