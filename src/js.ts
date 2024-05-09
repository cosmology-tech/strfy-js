import { camelCaseTransform, dirname, escapeStringForBacktickQuotes, escapeStringForDoubleQuotes, escapeStringForSingleQuotes, isSimpleKey, shouldInclude } from "./utils";

export interface JSStringifySetterOptions<ObjType, RootType> {
  currentKey: string;
  currentPath: string;
  value: any;
  obj: ObjType;
  root: RootType;
  defaultValuesMap: { [path: string]: any };
};

export interface JSStringifyPropertyReplacerOptions<ObjType, RootType> {
  currentKey: string;
  currentPath: string;
  propertyRenameMap: { [pattern: string]: string };
  obj: ObjType;
  root: RootType
  value?: any;
}

export type JSStringifySetter = (options: JSStringifySetterOptions<any, any>) => any;
export type JSStringifyReplacer = (options: JSStringifyPropertyReplacerOptions<any, any>) => any;
export interface JSStringifyOptions {
  space?: number;
  propertyReplacer?: (options: JSStringifyPropertyReplacerOptions<any, any>) => string
  valueReplacer?: Record<string, (options: JSStringifyPropertyReplacerOptions<any, any>) => any>;
  quotes?: 'single' | 'double' | 'backtick';
  inlineArrayLimit?: number;
  camelCase?: boolean;
  camelCaseFn?: (str: string) => string;
  include?: string[];
  exclude?: string[];
  defaultValuesMap?: { [path: string]: any };
  propertyRenameMap?: { [path: string]: any };
  defaultValuesSetter?: { [path: string]: JSStringifySetter } | JSStringifySetter;
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

function matchesPattern(path: string, pattern: string) {
  if (pattern === '*') return true;
  if (path === pattern) return true;
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
    propertyReplacer = null,
    valueReplacer = {},
    quotes = 'single',
    inlineArrayLimit = undefined,
    camelCase = false,
    camelCaseFn = camelCaseTransform,
    propertyRenameMap = {},
    defaultValuesMap = {},
    defaultValuesSetter = {},
    include = [],
    exclude = [],
    json = false  // JSON compliance mode
  } = options || {};

  const isObject = (val: any): boolean => typeof val === 'object' && val !== null && !Array.isArray(val);

  let indentLevel: number = 0;

  const serialize = (root: any, obj: any, currentPath = ""): string => {
    if (valueReplacer[''] instanceof Function) {
      obj = valueReplacer['']({
        currentKey: '',
        currentPath,
        obj,
        propertyRenameMap,
        root,
        value: obj
      }); // Call valueReplacer for the root element initially
    }

    if (Array.isArray(obj)) {
      const useInline = inlineArrayLimit !== undefined && obj.length <= inlineArrayLimit;
      indentLevel++;
      const result = '[' + (space && !useInline ? '\n' : '') + obj.map((item, index) => {
        return ' '.repeat(useInline ? 0 : indentLevel * space) + serialize(root, item, `${currentPath}/${index}`);
      }).join(',' + (space && !useInline ? '\n' : ' ')) + (space && !useInline ? '\n' + ' '.repeat((indentLevel - 1) * space) : '') + ']';
      indentLevel--;
      return result;
    } else if (isObject(obj)) {
      indentLevel++;

      // Apply custom default values setter if available
      Object.keys(valueReplacer).forEach(pattern => {
        if (matchesPattern(currentPath, dirname(pattern))) {
          const replacer: JSStringifyReplacer = valueReplacer[pattern];
          const property = pattern.split('/').pop(); // get the last segment as property name
          if (property === '*') {
            // Apply setter to all properties if needed
            Object.keys(obj).forEach(prop => {
              obj[prop] = replacer({
                currentKey: prop,
                currentPath: `${currentPath}/${prop}`,
                obj,
                value: obj[prop],
                root,
                propertyRenameMap
              });
            });
          } else if (property) {
            obj[property] = replacer({
              currentKey: property,
              currentPath,
              obj,
              value: obj[property],
              root,
              propertyRenameMap
            });
          }

        }
      });

      // Apply custom default values setter if available
      Object.keys(defaultValuesSetter).forEach(pattern => {
        if (matchesPattern(currentPath, dirname(pattern))) {
          const setter: JSStringifySetter = defaultValuesSetter[pattern];
          const property = pattern.split('/').pop(); // get the last segment as property name
          if (property === '*') {
            // Apply setter to all properties if needed
            Object.keys(obj).forEach(prop => {
              if (obj[prop] === undefined) {
                obj[prop] = setter({
                  currentKey: prop,
                  currentPath: `${currentPath}/${prop}`,
                  obj,
                  value: obj[prop],
                  root,
                  defaultValuesMap
                });
              }
            });
          } else if (property && obj[property] === undefined) {
            obj[property] = setter({
              currentKey: property,
              currentPath,
              obj,
              value: obj[property],
              root,
              defaultValuesMap
            });
          }
        }
      });

      // Apply default values based on currentPath
      Object.keys(defaultValuesMap).forEach(pattern => {
        if (matchesPattern(currentPath, pattern)) {
          const property = pattern.split('/').pop(); // get the last segment as property name
          if (property === '*') {
            // Apply to all properties if needed
            Object.keys(obj).forEach(prop => {
              if (obj[prop] === undefined) {
                obj[prop] = defaultValuesMap[pattern];
              }
            });
          } else if (property && obj[property] === undefined) {
            obj[property] = defaultValuesMap[pattern];
          }
        }
      });


      // INCLUDES EXCLUDES

      obj = Object.keys(obj).reduce((m, key) => {
        const fullPath = `${currentPath}/${key}`;
        if (shouldInclude(fullPath, {
          exclude,
          include
        })) {
          m[key] = obj[key];
        }
        return m;
      }, {});


      // CHANGE PROPERTY NAMES

      const props = Object.keys(obj).map(key => {
        const fullPath = `${currentPath}/${key}`;
        const value = valueReplacer instanceof Function ? valueReplacer({
          currentKey: key,
          currentPath: fullPath,
          obj: obj[key],
          propertyRenameMap,
          root
        }) : obj[key];

        let replacedKey: string;
        switch (true) {
          case propertyReplacer instanceof Function:
            replacedKey = propertyReplacer({ root, obj, currentKey: key, currentPath: fullPath, propertyRenameMap });
            break;
          default:
            replacedKey = defaultPropertyReplacer(key, fullPath, propertyRenameMap);
        }

        const finalKey = camelCase ? camelCaseFn(replacedKey) : replacedKey;
        const keyPart = json ? `"${finalKey}"` : isSimpleKey(finalKey) ? finalKey : `"${finalKey}"`;
        const valuePart = serialize(root, value, fullPath);
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

  return serialize(obj, obj);
}
