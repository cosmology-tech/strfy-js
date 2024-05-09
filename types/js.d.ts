export interface JSStringifyOptions {
    space?: number;
    replacer?: (key: string, value: any) => any | null;
    propertyReplacer?: (currentKey: string, currentPath: string, propertyRenameMap: {
        [pattern: string]: string;
    }) => string;
    quotes?: 'single' | 'double' | 'backtick';
    inlineArrayLimit?: number;
    camelCase?: boolean;
    camelCaseFn?: (str: string) => string;
    propertyRenameMap?: {
        [key: string]: string;
    };
    defaultValuesMap?: {
        [path: string]: any;
    };
    defaultValuesSetter?: {
        [path: string]: (currentKey: string, currentPath: string, value: any, obj?: any) => any;
    };
    json?: boolean;
}
export declare function chooseQuotes(str: string, preferred: 'single' | 'double' | 'backtick'): string;
export declare function jsStringify(obj: any, options?: JSStringifyOptions): string;
