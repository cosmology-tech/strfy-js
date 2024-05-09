const minimatch = require("minimatch").minimatch;

function dirname(path) {
  return path.substring(0, path.lastIndexOf('/')) || '/';
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

// Tests
test('0', () => {
  expect(expandPaths([
    '/assets/*/type_asset',
    '/assets/*/denom_units',
    '/assets/*/base'
  ])).toEqual([
    "/assets/*/base",
    "/assets/*/denom_units",
    "/assets/*/type_asset",
    "/assets/*",
    "/assets",
  ]);

  expect(expandPaths([
    '/chains/*',
    '/chains/*/codebase'
  ])).toEqual([
    "/chains/*/codebase",
    "/chains/*",
    "/chains",
  ]);
});

test('1', () => {
  expect(hasAncestor('/assets/0/base', expandPaths([
    '/assets/*/type_asset',
    '/assets/*/denom_units',
    '/assets/*/base'
  ]))).toBe(true);

  expect(findNearestAncestor('/assets/0/denom_units/0/denom', [
    '/assets/*/type_asset',
    '/assets/*/denom_units',
    '/assets/*/base'
  ])).toBe('/assets/0/denom_units');

  expect(findNearestAncestor('/chain/0', [
    '/assets/*/type_asset',
    '/assets/*/denom_units',
    '/assets/*/base'
  ])).toBeNull();

  expect(findNearestAncestor('/assets/0/type_asset', expandPaths([
    '/assets/*/type_asset',
    '/assets/*/denom_units',
    '/assets/*/base'
  ]))).toBe('/assets/0');

  expect(findNearestAncestor('/chains/0/codebase/cosmwasm_version', [
    '/chains/*',
    '/chains/*/codebase'
  ])).toBe('/chains/0/codebase');

});