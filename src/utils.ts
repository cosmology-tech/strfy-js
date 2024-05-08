
export function camelCaseTransform(key: string): string {
  return key.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

export function isSimpleKey(key: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

export function escapeStringForSingleQuotes(str: string): string {
  // Escape backslashes first
  str = str.replace(/\\/g, '\\\\');
  // Escape control characters
  str = str.replace(/\n/g, '\\n');
  str = str.replace(/\r/g, '\\r');
  str = str.replace(/\t/g, '\\t');
  // Escape only single quotes
  str = str.replace(/'/g, "\\'");
  return str;
}

export function escapeStringForDoubleQuotes(str: string): string {
  // Escape backslashes first
  str = str.replace(/\\/g, '\\\\');
  // Escape control characters
  str = str.replace(/\n/g, '\\n');
  str = str.replace(/\r/g, '\\r');
  str = str.replace(/\t/g, '\\t');
  // Escape only double quotes
  str = str.replace(/"/g, '\\"');
  return str;
}


export function escapeStringForBacktickQuotes(str: string): string {
  // Escape backslashes first
  str = str.replace(/\\/g, '\\\\');
  // Escape control characters
  str = str.replace(/\n/g, '\\n');
  str = str.replace(/\r/g, '\\r');
  str = str.replace(/\t/g, '\\t');
  // Escape backticks
  str = str.replace(/`/g, '\\`');
  return str;
}
