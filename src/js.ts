import { camelCaseTransform, escapeStringForBacktickQuotes, escapeStringForDoubleQuotes, escapeStringForSingleQuotes, isSimpleKey } from "./utils";

export interface JSStringifyOptions {
  space?: number; // defaults to 0
  replacer?: (this: any, key: string, value: any) => any | null; // defaults to null
  quotes?: 'single' | 'double'; // defaults to single
  inlineArrayLimit?: number; // default is undefined, allowing inline arrays below this length
  camelCase?: boolean; // defaults to false
  camelCaseFn?: (str: string) => string; // optional function to convert keys to camelCase
}

export function chooseQuotes(str: string, preferred: 'single' | 'double' | 'backtick'): string {
  switch (preferred) {
    case 'single':
      return `'${escapeStringForSingleQuotes(str)}'`;
    case 'double':
      return `"${escapeStringForDoubleQuotes(str)}"`;
    case 'backtick':
      return `\`${escapeStringForBacktickQuotes(str)}\``;
    default:
      throw new Error("Invalid quote type specified.");
  }
}


export function jsStringify(obj: any, options?: JSStringifyOptions): string {
  const { space = 0, replacer = null, quotes = 'single', inlineArrayLimit = undefined, camelCase = false, camelCaseFn = camelCaseTransform } = options || {};
  const isObject = (val: any): boolean => typeof val === 'object' && val !== null && !Array.isArray(val);
  let indentLevel: number = 0;

  const serialize = (obj: any): string => {
    if (replacer instanceof Function) {
      obj = replacer.call(null, '', obj); // Call replacer for the root element initially
    }

    if (Array.isArray(obj)) {
      const useInline = inlineArrayLimit !== undefined && obj.length <= inlineArrayLimit;
      indentLevel++;
      const result = '[' + (space && !useInline ? '\n' : '') + obj.map(item => {
        return ' '.repeat(useInline ? 0 : indentLevel * space) + serialize(item);
      }).join(',' + (space && !useInline ? '\n' : ' ')) + (space && !useInline ? '\n' + ' '.repeat((indentLevel - 1) * space) : '') + ']';
      indentLevel--;
      return result;
    } else if (isObject(obj)) {
      indentLevel++;
      const props = Object.keys(obj).map(key => {
        const value = replacer instanceof Function ? replacer.call(obj, key, obj[key]) : obj[key];
        const transformedKey = camelCase ? camelCaseFn(key) : key;
        const keyPart = isSimpleKey(transformedKey) ? transformedKey : `"${transformedKey}"`;
        const valuePart = serialize(value);
        return ' '.repeat(indentLevel * space) + `${keyPart}: ${valuePart}`;
      });
      const result = '{' + (space ? '\n' : '') + props.join(',' + (space ? '\n' : ' ')) + (space ? '\n' + ' '.repeat((indentLevel - 1) * space) : '') + '}';
      indentLevel--;
      return result;
    } else if (typeof obj === 'string') {
      return chooseQuotes(obj, quotes);
    } else {
      return String(obj);
    }
  };

  return serialize(obj);
}