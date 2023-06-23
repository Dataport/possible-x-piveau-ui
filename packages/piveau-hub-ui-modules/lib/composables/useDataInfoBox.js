import { computed, getCurrentInstance, unref } from "vue";
import { getTranslationFor, truncate, getImg } from "../utils/helpers";
import { toPairs, uniqBy, groupBy, has } from "lodash-es";

export function useDataInfoBox({ datasets, locale }) {

  const vm = getCurrentInstance();
  const $env = vm.proxy.$env;

  function getCatalogImage(catalog) {
    return $env.content.catalogs.useCatalogCountries
      ? `${$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'country.id') ? catalog.country.id : $env.content.catalogs.defaultCatalogCountryID}`
      : `${$env.content.catalogs.defaultCatalogImagePath}/${has(catalog, 'id') ? catalog.id : $env.content.catalogs.defaultCatalogID}`;
  }


  /**
 * @description Cuts badge format string (max 8 chars)
 * @param label {String} - badge label or id (e.g. csv)
 */
  function getBadgeFormat(label) {
    return truncate(label, 8, true);
  }

  /**
   * @description Removes the duplicates of the given array
   * @param array {Array} - The array to remove duplicates from
   * @returns {Array}
   */
  function removeDuplicatesOf(array) {
    const correctedFormatArray = array.map(format => (
      {
        ...format,
        id: getBadgeFormat(format.id),
        label: getBadgeFormat(format.label),
      }
    ));
    // sorts after # of occurences (highest occurence first)
    // possibility #1
    const sortedArray = toPairs(groupBy(correctedFormatArray, "id")).sort((a, b) => b[1].length - a[1].length);
    const onlyFormatObjectsArray = sortedArray.map(arr => arr[1][0]);
    // lodash uniqBy funtion removes duplicate id´s from array of objects
    const uniqById = uniqBy(onlyFormatObjectsArray, "id");
    const uniqByIdAndLabel = uniqBy(uniqById, "label");
    return uniqByIdAndLabel;
  }
  
  return computed(() => {
    const dsList = unref(datasets);
    const l = unref(locale);

    if (!datasets || !dsList) {
      return null;
    }

    return dsList.map((ds) => {
      return {
        src: getImg(getCatalogImage(ds.catalog)),
        dataset: {
          title: getTranslationFor(ds.title, l, ds.languages) || ds.id,
          description: getTranslationFor(ds.description, l, ds.languages),
          catalog: getTranslationFor(ds.catalog.title, l, []),
          createdDate: ds.releaseDate,
          updatedDate: ds.modificationDate,
          formats: removeDuplicatesOf(ds.distributionFormats).filter((format) => format.id || format.label),
        }
      }
    })
  })
}