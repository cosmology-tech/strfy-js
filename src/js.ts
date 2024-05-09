import { camelCaseTransform, escapeStringForBacktickQuotes, escapeStringForDoubleQuotes, escapeStringForSingleQuotes, isSimpleKey } from "./utils";

export interface JSStringifyOptions {
  space?: number;
  replacer?: (key: string, value: any) => any | null;
  propertyReplacer?: (currentKey: string, currentPath: string, propertyRenameMap: { [pattern: string]: string }) => string
  quotes?: 'single' | 'double' | 'backtick';
  inlineArrayLimit?: number;
  camelCase?: boolean;
  camelCaseFn?: (str: string) => string;
  propertyRenameMap?: { [key: string]: string };
  json?: boolean;
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

function matchesPattern(path, pattern) {
  const pathSegments = path.split('/');
  const patternSegments = pattern.split('/');
  if (pathSegments.length !== patternSegments.length) {
    return false;
  }
  for (let i = 0; i < pathSegments.length; i++) {
    if (patternSegments[i] !== '*' && patternSegments[i] !== pathSegments[i]) {
      return false;
    }
  }
  return true;
}

function defaultPropertyReplacer(
  currentKey: string,
  currentPath: string,
  propertyRenameMap: { [pattern: string]: string }
): string {
  let finalKey = currentKey;
  Object.keys(propertyRenameMap).forEach(pattern => {
    if (matchesPattern(currentPath, pattern)) {
      finalKey = propertyRenameMap[pattern];
    }
  });
  return finalKey;
}


export function jsStringify(obj: any, options?: JSStringifyOptions): string {
  const {
    space = 0,
    replacer = null,
    propertyReplacer = null,
    quotes = 'single',
    inlineArrayLimit = undefined,
    camelCase = false,
    camelCaseFn = camelCaseTransform,
    propertyRenameMap = {},
    json = false  // JSON compliance mode
  } = options || {};

  const isObject = (val: any): boolean => typeof val === 'object' && val !== null && !Array.isArray(val);

  let indentLevel: number = 0;

  const serialize = (obj: any, currentPath = "", isArray: boolean = false): string => {
    if (replacer instanceof Function) {
      obj = replacer.call(null, '', obj); // Call replacer for the root element initially
    }

    if (Array.isArray(obj)) {
      const useInline = inlineArrayLimit !== undefined && obj.length <= inlineArrayLimit;
      indentLevel++;
      const result = '[' + (space && !useInline ? '\n' : '') + obj.map((item, index) => {
        return ' '.repeat(useInline ? 0 : indentLevel * space) + serialize(item, `${currentPath}/${index}`, true);
      }).join(',' + (space && !useInline ? '\n' : ' ')) + (space && !useInline ? '\n' + ' '.repeat((indentLevel - 1) * space) : '') + ']';
      indentLevel--;
      return result;
    } else if (isObject(obj)) {
      indentLevel++;
      const props = Object.keys(obj).map(key => {
        const fullPath = `${currentPath}/${key}`;
        const value = replacer instanceof Function ? replacer.call(obj, key, obj[key]) : obj[key];


        let replacedKey: string;
        switch (true) {
          case propertyReplacer instanceof Function:
            replacedKey = propertyReplacer.call(obj, key, fullPath, propertyRenameMap);
            break;
          default:
            replacedKey = defaultPropertyReplacer(key, fullPath, propertyRenameMap);
        }

        const finalKey = camelCase ? camelCaseFn(replacedKey) : replacedKey;
        const keyPart = json ? `"${finalKey}"` : isSimpleKey(finalKey) ? finalKey : `"${finalKey}"`;
        const valuePart = serialize(value, fullPath);
        return ' '.repeat(indentLevel * space) + `${keyPart}: ${valuePart}`;
      });
      const result = '{' + (space ? '\n' : '') + props.join(',' + (space ? '\n' : ' ')) + (space ? '\n' + ' '.repeat((indentLevel - 1) * space) : '') + '}';
      indentLevel--;
      return result;
    } else if (typeof obj === 'string') {
      return json ? `"${escapeStringForDoubleQuotes(obj)}"` : chooseQuotes(obj, quotes);
    } else {
      return String(obj);
    }
  };

  return serialize(obj);
}
