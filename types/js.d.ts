export interface JSStringifySetterOptions<ObjType, RootType> {
    currentKey: string;
    currentPath: string;
    value: any;
    obj: ObjType;
    root: RootType;
    defaultValuesMap: {
        [path: string]: any;
    };
}
export interface JSStringifyPropertyReplacerOptions<ObjType, RootType> {
    currentKey: string;
    currentPath: string;
    propertyRenameMap: {
        [pattern: string]: string;
    };
    obj: ObjType;
    root: RootType;
    value?: any;
}
export type JSStringifySetter = (options: JSStringifySetterOptions<any, any>) => any;
export type JSStringifyReplacer = (options: JSStringifyPropertyReplacerOptions<any, any>) => any;
export interface JSStringifyOptions {
    space?: number;
    propertyReplacer?: (options: JSStringifyPropertyReplacerOptions<any, any>) => string;
    valueReplacer?: Record<string, (options: JSStringifyPropertyReplacerOptions<any, any>) => any>;
    quotes?: 'single' | 'double' | 'backtick';
    inlineArrayLimit?: number;
    camelCase?: boolean;
    camelCaseFn?: (str: string) => string;
    include?: string[];
    exclude?: string[];
    defaultValuesMap?: {
        [path: string]: any;
    };
    propertyRenameMap?: {
        [path: string]: any;
    };
    defaultValuesSetter?: {
        [path: string]: JSStringifySetter;
    } | JSStringifySetter;
    json?: boolean;
}
export declare function chooseQuotes(str: string, preferred: 'single' | 'double' | 'backtick'): string;
export declare function jsStringify(obj: any, options?: JSStringifyOptions): string;
