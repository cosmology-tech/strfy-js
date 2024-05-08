import { camelCaseTransform, isSimpleKey } from "./utils";

export interface JSONStringifyOptions {
  space?: number; // defaults to 0
  replacer?: (this: any, key: string, value: any) => any; // defaults to null
  quotes?: 'single' | 'double'; // defaults to double
  inlineArrayLimit?: number; // default is undefined, allowing inline arrays below this length
  camelCase?: boolean; // defaults to false
  camelCaseFn?: (str: string) => string; // optional function to convert keys to camelCase
}

function escapeString(str: string): string {
  str = str.replace(/\\/g, '\\\\');  // Escape backslashes first
  str = str.replace(/\n/g, '\\n');  // Escape newlines
  str = str.replace(/\r/g, '\\r');  // Escape carriage returns
  str = str.replace(/\t/g, '\\t');  // Escape tabs
  str = str.replace(/"/g, '\\"');  // Escape double quotes
  return str;
}

function chooseQuotes(str: string): string {
  return `"${escapeString(str)}"`;
}

export function jsonStringify(obj: any, options?: JSONStringifyOptions): string {
  const { space = 0, replacer = null, quotes = 'double', inlineArrayLimit = undefined, camelCase = false, camelCaseFn = camelCaseTransform } = options || {};
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
        const keyPart = isSimpleKey(transformedKey) ? transformedKey : chooseQuotes(transformedKey);
        const valuePart = serialize(value);
        return ' '.repeat(indentLevel * space) + `${keyPart}: ${valuePart}`;
      });
      const result = '{' + (space ? '\n' : '') + props.join(',' + (space ? '\n' : ' ')) + (space ? '\n' + ' '.repeat((indentLevel - 1) * space) : '') + '}';
      indentLevel--;
      return result;
    } else if (typeof obj === 'string') {
      return chooseQuotes(obj);
    } else {
      return String(obj);
    }
  };

  return serialize(obj);
}
