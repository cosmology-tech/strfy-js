interface StringifyOptions {
    space?: number;
    replacer?: (this: any, key: string, value: any) => any | null;
    quotes?: 'single' | 'double';
}
export declare function jsStringify(obj: any, options?: StringifyOptions): string;
export {};
