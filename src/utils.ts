import { minimatch } from 'minimatch';

export function camelCaseTransform(key: string): string {
  return key.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
}

export function isSimpleKey(key: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
}

export function dirname(path: string): string {
  return path.replace(/\/[^\/]*$/, ''); // Removes last segment after the last '/'
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


const globPattern = /\*+([^+@!?\*\[\(]*)/;

interface ShouldIncludeOptions {
  include: string[];
  exclude: string[];
}

export function expandPaths(paths: string[]): string[] {
  const pathSet = new Set<string>();

  paths.forEach(path => {
    let currentPath = path;
    // Ensure the path is added to the set
    pathSet.add(currentPath);

    // Generate and add all parent directories to the set
    while (currentPath !== '') {
      const lastSlashIndex = currentPath.lastIndexOf('/');
      if (lastSlashIndex === -1) break; // No more slashes, stop processing

      currentPath = currentPath.substring(0, lastSlashIndex) || '';
      if (currentPath !== '')
        pathSet.add(currentPath);
    }
  });

  return sortPaths(Array.from(pathSet));
}

function sortPaths(paths) {
  // First sort alphabetically
  paths.sort((a, b) => a.localeCompare(b));

  // Then sort by depth (number of '/' in the path)
  paths.sort((a, b) => {
    const depthA = (a.match(/\//g) || []).length;
    const depthB = (b.match(/\//g) || []).length;
    return depthB - depthA;  // Sort from deepest to shallowest
  });

  return paths;
}


function hasAncestor(currentPath, includePaths) {
  return !!findNearestAncestor(currentPath, includePaths);
}

function findNearestAncestor(currentPath, includePaths) {
  let pathToCheck = currentPath;
  while (pathToCheck !== '/' && pathToCheck !== '') {
    if (includePaths.some(includePath => minimatch(pathToCheck + '/', includePath))) {
      if (pathToCheck !== currentPath)
        return pathToCheck; // Return the matching parent directory
    }
    pathToCheck = dirname(pathToCheck); // Move to the next parent directory
  }
  return null; // Return null if no matching parent is found
}

export const shouldInclude = (type: string, options: ShouldIncludeOptions): boolean => {
  // Determine if 'include' and 'exclude' are effectively set
  const includesEffectivelySet = options.include && options.include.length > 0;
  const excludesEffectivelySet = options.exclude && options.exclude.length > 0;

  // Function to check if any patterns in the array match the type
  const matchesPattern = (patterns: string[], type: string): boolean =>
    patterns.some(pattern => globPattern.test(pattern) ? minimatch(type, pattern) : type === pattern);

  const isIncluded = includesEffectivelySet ? matchesPattern(expandPaths(options.include), type) : true;
  const isIncludedByAncestor = !!findNearestAncestor(type, options.include);
  const isExcluded = excludesEffectivelySet ? matchesPattern(options.exclude, type) : false;

  const toInclude = isIncluded;

  // Apply the logic based on whether includes or excludes are effectively set
  if (includesEffectivelySet && excludesEffectivelySet) {
    if (isIncludedByAncestor && !isExcluded) {
      return true;
    }
    return toInclude && !isExcluded;
  } else if (includesEffectivelySet) {
    if (isIncludedByAncestor) {
      return true;
    }
    return toInclude;
  } else if (excludesEffectivelySet) {
    return !isExcluded;
  }

  // Default behavior if neither is effectively set
  return true;
}