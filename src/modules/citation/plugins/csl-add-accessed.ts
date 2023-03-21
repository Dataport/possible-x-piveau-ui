// @ts-nocheck
/**
 * Citation-js plugin to add accessed date to CSL object
 */

/**
 * Attaches the current date to the 'accessed' property in a CSL object
 * @param {Array} input the CSL object array
 * @returns a new CSL object with the accessed property attached
 */
function addAccessed(input) {
  // Get current year, month and day
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const accessed = { 'date-parts': [[year, month, day]] };

  // Add accessed property to each CSL object in input
  return input.map(csl => ({ ...csl, accessed }));
}

export default function install(plugins: typeof import('@citation-js/core').plugins) {
  plugins.input.add('@piveau/list+csl', {
    parse: addAccessed,
    parseType: {
      dataType: 'Array',
      elementConstraint: '@csl/object',
      predicate: input => input.some(item => !item.accessed),
    },
  });
}
