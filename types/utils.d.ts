export declare function camelCaseTransform(key: string): string;
export declare function isSimpleKey(key: string): boolean;
export declare function dirname(path: string): string;
export declare function escapeStringForSingleQuotes(str: string): string;
export declare function escapeStringForDoubleQuotes(str: string): string;
export declare function escapeStringForBacktickQuotes(str: string): string;
interface ShouldIncludeOptions {
    include: string[];
    exclude: string[];
}
export declare function expandPaths(paths: string[]): string[];
export declare const shouldInclude: (type: string, options: ShouldIncludeOptions) => boolean;
export {};
