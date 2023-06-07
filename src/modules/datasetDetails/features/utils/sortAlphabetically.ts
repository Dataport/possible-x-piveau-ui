/**
 * Assuming array's elements are objects, looks at the values
 * @param array
 * @param property
 * @param locale
 */

export function sortAlphabetically(array: Array<unknown>, property: string, locale: string) {
  try {
    array.sort((a, b) => {
      const propA = getValueFromProperty(a, property, locale)?.toLowerCase() || "";
      const propB = getValueFromProperty(b, property, locale)?.toLowerCase() || "";
      return propA  > propB ? 1 : -1;
    });
  } catch (e) {
    // Catch TypeErrors for undefined Keyword titles
    console.warn('CATCHED ERROR - UNDEFINED KEYWORD TITLES'); // eslint-disable-line
    console.warn(e); // eslint-disable-line
  }
}

function getValueFromProperty(data: any, property: string, locale: string): string | undefined {
  const value = data[property];
  if (typeof value === 'object') {
    return value[locale];
  } else {
    return value;
  }
}
