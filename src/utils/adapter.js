/* eslint-disable brace-style,no-lonely-if,no-console */
import { DataEuropaFormatter } from './formatter';
import { helpers } from '@piveau/piveau-hub-ui-modules';
const { matchesObjectStructure } = helpers;

/**
 * @description Function for retireving data dependant on given sourceInformation (fetching or reading from provided source, optional formatting)
 * @param {Object} sourceInformation Object of information about the data's source:
 * {
 *      fecthFromEndpoint: Boolean,
 *      endpoint: "URL",
 *      values: Object,
 *      needsFormatting: Boolean,
 *      formatter: method
 * }
 * @param {Object} languageInformation Object containing local and fallback language settings
 * @returns {Object} Object of retrieved data
 */
async function retrieveDataFromSource(sourceInformation, languageInformation) {
  let result = {};

  if (sourceInformation.fetchFromEndpoint === false) {
    // case 1: provided values are already in the right format
    if (sourceInformation.needsFormatting === false) {
      result = sourceInformation.values;

      if (!matchesObjectStructure(result)) {
        result = { error: languageInformation.translation[languageInformation.locale].message.error['retrieving-error'] };
        console.error(languageInformation.translation[languageInformation.locale].message.error['type-error']);
      }
    }
    // case 2: provided values need to be formatted
    else {
      try {
        result = sourceInformation.formatter(sourceInformation.values);
        if (!matchesObjectStructure(result)) {
          result = { error: "The provided data isn't of type object!" };
        }
      } catch (e) {
        result = { error: languageInformation.translation[languageInformation.locale].message.error['retrieving-error'] };
        console.error(e);
      }
    }
  } else {
    // case 3: values must be fetched from endpoint without formatting
    if (sourceInformation.needsFormatting === false) {
      try {
        const status = await fetch(sourceInformation.endpoint).then(response => response.status);

        if (status === 200) {
          result = await fetch(sourceInformation.endpoint)
            .then(res => res.json())
            .then(data => data.result);

          if (!matchesObjectStructure(result)) {
            result = { error: languageInformation.translation[languageInformation.locale].message.error['retrieving-error'] };
            console.error(languageInformation.translation[languageInformation.locale].message.error['type-error']);
          }
        }
      } catch (e) {
        result = { error: languageInformation.translation[languageInformation.locale].message.error['retrieving-error'] };
        console.error(e);
      }
    }
    // case 4: values must be fetched from endpoint and formatted
    else {
      // using provided formatter
      if (sourceInformation.formatter === 'DataEuropa') {
        try {
          const status = await fetch(sourceInformation.endpoint).then(response => response.status);

          if (status === 200) {
            result = await fetch(sourceInformation.endpoint)
              .then(res => res.json())
              .then(data => DataEuropaFormatter(data.result, languageInformation));
          }
        } catch (e) {
          result = { error: languageInformation.translation[languageInformation.locale].message.error['retrieving-error'] };
          console.error(e);
        }
      } else {
        try {
          const status = await fetch(sourceInformation.endpoint).then(response => response.status);

          if (status === 200) {
            try {
              result = await fetch(sourceInformation.endpoint)
                .then(res => res.json())
                .then(data => sourceInformation.formatter(data.result));

              if (!matchesObjectStructure(result)) {
                result = { error: languageInformation.translation[languageInformation.locale].message.error['retrieving-error'] };
                console.error(languageInformation.translation[languageInformation.locale].message.error['type-error']);
              }
            } catch (e) {
              result = { error: languageInformation.translation[languageInformation.locale].message.error['retrieving-error'] };
              console.error(e);
            }
          }
        } catch (e) {
          result = { error: languageInformation.translation[languageInformation.locale].message.error['retrieving-error'] };
          console.error(e);
        }
      }
    }
  }

  return result;
}

export { retrieveDataFromSource };
