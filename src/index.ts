interface StringifyOptions {
  space?: number; // defaults to 0
  replacer?: (this: any, key: string, value: any) => any | null; // defaults to null
  quotes?: 'single' | 'double'; // defaults to single
}

function isSimpleKey(key: string): boolean {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key);
}

function chooseQuotes(str: string, preferred: 'single' | 'double'): string {
  if (preferred === 'single') {
    if (!str.includes('\'')) return `'${str}'`;
    else if (!str.includes('`')) return `\`${str}\``;
    else if (!str.includes('"')) return `"${str}"`;
  } else {
    if (!str.includes('"')) return `"${str}"`;
    else if (!str.includes('`')) return `\`${str}\``;
    else if (!str.includes('\'')) return `'${str}'`;
  }
  return JSON.stringify(str); // Fallback: use JSON.stringify to escape the string properly
}

export function jsStringify(obj: any, options?: StringifyOptions): string {
  const { space = 0, replacer = null, quotes = 'single' } = options || {};
  const isObject = (val: any): boolean => typeof val === 'object' && val !== null && !Array.isArray(val);
  let indentLevel: number = 0;

  const serialize = (obj: any): string => {
    if (replacer instanceof Function) {
      obj = replacer.call(null, '', obj); // Call replacer for the root element initially
    }

    if (Array.isArray(obj)) {
      indentLevel++;
      const result = '[' + (space ? '\n' : '') + obj.map(item => {
        return ' '.repeat(indentLevel * space) + serialize(item);
      }).join(',' + (space ? '\n' : ' ')) + (space ? '\n' + ' '.repeat((indentLevel - 1) * space) : '') + ']';
      indentLevel--;
      return result;
    } else if (isObject(obj)) {
      indentLevel++;
      const props = Object.keys(obj).map(key => {
        const value = replacer instanceof Function ? replacer.call(obj, key, obj[key]) : obj[key];
        const keyPart = isSimpleKey(key) ? key : `"${key}"`;
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
