/* eslint-disable */
/* eslint-disable no-plusplus */

import { LanguageInformation } from "./adapter";

/**
 * @description Fetching values from endpoint given by source (considering language settings)
 * @param {Object} values An object containing the data retrieved from endpoint
 * @param {Oject} languageInformation Object containing information about language settings
 * @returns {Object} Object of fetched values with key
 *
 */
async function DataEuropaFormatter(
    values: { count: number, results: [{ pref_label: any, id: string }]},
    languageInformation: LanguageInformation) {
  const fetchedValues = {} as { [key: string]: string };

  for (let i = 0; i < values.count; i++) {
    // grep result matching the local langauge setting
    let singleValue = values.results[i].pref_label[languageInformation.locale];
    // if there is no result available matching the local language, grep the result matching the fallback language setting
    if (singleValue === undefined) {
      singleValue = values.results[i].pref_label[languageInformation.fallbackLocale];
      // if there is no result matching the local language setting or the fallback language setting grep the provided id
      if (singleValue === undefined) {
        singleValue = values.results[i].id;
      }
    }
    const valueId = values.results[i].id;
    fetchedValues[valueId] = singleValue;
  }

  return fetchedValues;
}

export { DataEuropaFormatter };
