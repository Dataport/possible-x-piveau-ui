/* eslint-disable guard-for-in,no-restricted-syntax,no-param-reassign,camelcase,no-eval, no-lonely-if, no-await-in-loop */
import axios from 'axios';
import { has, isEqual } from 'lodash';
import { glueConfig as GLUE_CONFIG } from '../../../../config/user-config';
import config from '../../../../config/inputconfigMin';
import dcatapProperties from './dcatapProperties';
import {
  nestedProperties,
  multilingualGroupsNames,
  repeatableUriProperties,
} from './propertyClassification';

function isRepeatableUri(semanticName) {
  return repeatableUriProperties.includes(semanticName);
}

function isUri(dataObject) {
  const dataObjectKeys = Object.keys(dataObject);
  return dataObjectKeys.length === 2 && dataObjectKeys.includes('@type') && dataObjectKeys.includes('@id');
}

/**
 * @description Extracts semantic names from DCATAP-definition dependent on given parameters and returns Object with extracted name
 * @param {String} profile String determining which profile should be extracted from dcatap definition
 * @param {String} inputName String determining which input definition should be extracted from dcatap definition
 * @returns Object containing semnatic name ans value depending on type
 */
function extractSemanticName(profile, inputName) {
  const dcatapDefinition = dcatapProperties[profile][inputName];
  const semanticName = dcatapDefinition.name;
  const resultObject = {};

  resultObject[semanticName] = '';
  return resultObject;
}

/**
 * @description Extracting all semantic names of input values into an Object
 * @param {String} profile String determining which profile shoudl be lookes at at the config
 * @returns Object containing semantic names of all input values sorted by page
 */
function extractNames(profile) {
  const pageContentDefinition = config[profile];
  const pageInputs = {};


  const pageNames = Object.keys(pageContentDefinition);
  for (let nameIndex = 0; nameIndex < pageNames.length; nameIndex += 1) {
    // each pages gets an object to store all the input values which will be dsiplayed in it
    const name = pageNames[nameIndex];
    pageInputs[name] = {};

    const inputNames = Object.keys(config[profile][name]);
    for (let inputIndex = 0; inputIndex < inputNames.length; inputIndex += 1) {
      // if page contains keys starting with 'distribution' this is a subpage with input values which need to be extracted similar to the other pages
      if (inputNames[inputIndex].startsWith('distribution')) {
        pageInputs[name][inputNames[inputIndex]] = {};
        const distributionInputs = Object.keys(config[profile][name][inputNames[inputIndex]]);
        for (let distInputIndex = 0; distInputIndex < distributionInputs.length; distInputIndex += 1) {
          Object.assign(pageInputs[name][inputNames[inputIndex]], extractSemanticName('distribution', distributionInputs[distInputIndex]));
        }
      } else {
        Object.assign(pageInputs[name], extractSemanticName(profile, inputNames[inputIndex]));
      }
    }
  }

  return pageInputs;
}

/**
 * @description Fetches JSON-LD data from endpoint
 * @param {String} endpoint Determining the endpoint from where the data should be fetched
 * @returns Object containing fetched data
 */
async function fetchJsonld(endpoint, token) {
  let response;
  let requestOptions;
  if (token !== '') {
    requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: endpoint,
    };
  } else {
    requestOptions = {
      method: 'GET',
      url: endpoint,
    };
  }

  try {
    response = await axios.request(requestOptions);
  } catch (err) {
    // TODO: Handle (network) errors
    throw Error(`Error occured during fetching endpoint: ${endpoint}`);
  }
  return response.data;
}

/**
 * @description TODO
 * @param {String} data TODO
 * @returns TODO
 */
function fillMissingLanguage(data) {
  const result = [];
  if (Array.isArray(data)) {
    for (let index = 0; index < data.length; index += 1) {
      if (!has(data[index], '@language')) {
        result[index] = { '@value': data[index]['@value'], '@language': '' };
      } else {
        // Only allow language codes with two letters (ISO 639-1)
        result[index] = {
          '@value': data[index]['@value'],
          '@language': data[index]['@language'].slice(0, 2),
        };
      }
    }
  } else {
    if (!has(data, '@language')) {
      result[0] = { '@value': data['@value'], '@language': '' };
    } else {
      result[0] = data;
    }
  }
  return result;
}

/**
 * @description TODO
 * @param {String} nodeData TODO
 * @param {String} additionalData TODO
 * @param {String} semanticName TODO
 * @returns TODO
 */
function convertNodeData(nodeData, additionalData, semanticName) {
  let result = {};
  const properties = Object.keys(nodeData);

  if (isUri(nodeData)) {
    result = nodeData['@id'];
    if (isRepeatableUri(semanticName)) {
      result = [{ '@value': result }];
    } else {
      if (semanticName === 'dcat:accessService') {
        const testdata = additionalData.filter(dataset => dataset['@id'] === nodeData['@id'])[0];
        const dataserviceKeys = Object.keys(testdata);
        if (isEqual(['@id', '@type'], dataserviceKeys) || isEqual(dataserviceKeys, ['@type', '@id'])) {
          result = '';
        }
      }
    }
  } else {
    if (semanticName === 'dct:rights') {
      if (has(nodeData, 'rdfs:label')) {
        result = nodeData['rdfs:label'];
      } else {
        result = nodeData.label;
      }
    } else if (semanticName === 'spdx:checksum') {
      const nodeKeys = Object.keys(nodeData);
      result = [{}];
      for (let keyIndex = 0; keyIndex < nodeKeys.length; keyIndex += 1) {
        if (nodeKeys[keyIndex].includes('Value')) {
          result[0]['spdx:checksumValue'] = nodeData[nodeKeys[keyIndex]];
        } else if (nodeKeys[keyIndex].includes('algorithm')) {
          let algorithmValue;
          const rawValue = nodeData[nodeKeys[keyIndex]];
          if (typeof rawValue === 'object') {
            algorithmValue = `http://spdx.org/rdf/terms#${rawValue['@id'].replaceAll(':', '')}`;
          } else {
            algorithmValue = `http://spdx.org/rdf/terms#${rawValue.replaceAll(':', '')}`;
          }
          result[0]['spdx:algorithm'] = algorithmValue;
        }
      }
    } else {
      for (let index = 0; index < properties.length; index += 1) {
        let value = nodeData[properties[index]];
        // Remove 'mailto:' from email addresses
        if (typeof value === 'string' && value.startsWith('mailto:')) {
          value = value.substring(7);
        }

        if (properties[index] === 'hasAddress') {
          const addressData = additionalData.filter(dataset => dataset['@id'] === value)[0];
          value = convertNodeData(addressData, additionalData, semanticName);
        }

        if (has(nestedProperties, properties[index])) {
          result[nestedProperties[properties[index]]] = value;
          if (semanticName === 'dcat:accessService' && multilingualGroupsNames.includes(nestedProperties[properties[index]])) {
            result[nestedProperties[properties[index]]] = fillMissingLanguage(value);
          }
        } else {
          result[properties[index]] = value;
        }
      }
      result = [result];
    }
  }

  return result;
}

/**
 * @description All available data values are filled into an object according to the given structure
 * @param {Object} pageValueStructure Object determining the semnatic names of the values and their structure
 * @param {Object} data Object containing json-ld data
 * @returns Object containing all values derived from given jsonld according to given structure
 */
async function fillPageWithValues(pageValueStructure, data, additionalData) {
  const result = {};
  const inputName = Object.keys(pageValueStructure);
  const additionalDataIds = additionalData.map(dataset => dataset['@id']);

  for (let inputIndex = 0; inputIndex < inputName.length; inputIndex += 1) {
    const semanticName = inputName[inputIndex];
    const normalName = semanticName.split(':')[1];
    if (has(data, normalName)) {
      if (additionalDataIds.includes(data[normalName])) {
        const dataNode = additionalData.filter(dataset => dataset['@id'] === data[normalName])[0];
        result[semanticName] = convertNodeData(dataNode, additionalData, semanticName);
      } else {
        if (multilingualGroupsNames.includes(semanticName)) {
          result[semanticName] = fillMissingLanguage(data[normalName]);
        } else if (semanticName === 'dcat:temporalResolution') {
          result[semanticName] = [{}];
          let duration = data[normalName];
          // find index of letter for time period
          // -> extract substring until this index
          // -> extract number from string and set as according value for input
          const shorts = ['Y', 'M', 'D', 'H', 'M', 'S'];
          const forms = {
            0: 'Year',
            1: 'Month',
            2: 'Day',
            3: 'Hour',
            4: 'Minute',
            5: 'Second',
          };

          for (let index = 0; index < shorts.length; index += 1) {
            const position = duration.indexOf(shorts[index]);
            const subDuration = duration.substring(0, position);
            const value = subDuration.match(/\d+/g);
            duration = duration.substring(position);
            result[semanticName][0][forms[index]] = value;
          }
        } else {
          if (semanticName === 'dct:identifier' && typeof data[normalName] === 'string') {
            result[semanticName] = [{ '@value': data[normalName] }];
          } else {
            if (isRepeatableUri(semanticName)) {
              if (Array.isArray(data[normalName])) {
                result[semanticName] = [];
                for (let index = 0; index < data[normalName].length; index += 1) {
                  result[semanticName].push({ '@value': data[normalName][index] });
                }
              } else {
                result[semanticName] = [{ '@value': data[normalName] }];
              }
            } else {
              result[semanticName] = data[normalName];
            }
          }
        }
      }
    }
  }
  return result;
}

/**
 * @description Saving given data to localStorage naming it according to given parameters
 * @param {String} profile String dertermining the profile within the name
 * @param {String} page String dertermining the page within the name
 * @param {String} subpage String dertermining the subpage, if given, within the name
 * @param {Integer} number String dertermining the number of distribution, if given, within the name
 * @param {Object} data Object containing the data to be saved
 */
function saveToLocalStorage(profile, page, subpage, number, data) {
  const name = `inputValues_${profile}_${page}${(subpage ? `_${subpage}_${number}` : '')}`;
  localStorage.setItem(name, JSON.stringify(data));
}

/**
 * @description Converts JSON-LD data which is fetched using the given parameters into an object containing input values
 * which will be then stored into the localStorage where the input form will grep them and use them as default values
 * @param {String} profile Serves as snipped of fetch-ednpoint as well as determining which DCATAP-property is dealed with
 * @param {String} id Serving as snipped of tech-endpoint
 */
async function convertToInput(profile, catalog, url, token) {
  // Object containing structured and ordered values to be displayed later
  const valueStructure = extractNames(profile);

  // Fetch JSON-LD
  const jsonld = await fetchJsonld(url, token);
  const graphdata = jsonld['@graph'];

  let data;
  let distributionData;
  const profileIds = {
    datasets: '',
    distribution: '',
    catalogues: '',
  };

  // Extract Graph data
  const additionalData = graphdata.filter(dataset => (dataset['@type'] !== 'dcat:Distribution'
    && dataset['@type'] !== 'dcat:Dataset'
    && dataset['@type'] !== 'dcat:Catalogue'));

  if (profile === 'datasets') {
    data = graphdata.filter(dataset => dataset['@type'] === 'dcat:Dataset');
    distributionData = graphdata.filter(dataset => dataset['@type'] === 'dcat:Distribution');
    localStorage.setItem('numberOfDistributions', distributionData.length > 0 ? distributionData.length : 1);
    const dataseturl = data.map(dataset => dataset['@id'])[0];
    const datasetid = dataseturl.substring(dataseturl.lastIndexOf('/') + 1);
    profileIds.datasets = datasetid;
    if (has(data[0], 'distribution')) {
      profileIds.distribution = data.map(dataset => dataset.distribution).length > 0 ? data.map(dataset => dataset.distribution) : '';
    }
    profileIds.catalogues = catalog;
  } else if (profile === 'catalogues') {
    data = graphdata.filter(dataset => dataset['@type'] === 'dcat:Catalogue');
    profileIds.catalogues = data.map(dataset => dataset['@id'])[0];
  }

  // Fill structure with provided data
  const steps = GLUE_CONFIG.upload.input[profile].steps;
  let dataToSave;
  for (let stepIndex = 0; stepIndex < steps.length; stepIndex += 1) {
    const stepName = steps[stepIndex].path;
    if (steps[stepIndex].subrouting) {
      for (let subpageIndex = 0; subpageIndex < steps[stepIndex].children.length; subpageIndex += 1) {
        const subpageName = steps[stepIndex].children[subpageIndex];
        if (distributionData.length > 0) {
          for (let distIndex = 0; distIndex < distributionData.length; distIndex += 1) {
            dataToSave = await fillPageWithValues(valueStructure[stepName][subpageName], distributionData[distIndex], additionalData);
            saveToLocalStorage(profile, stepName, subpageName, distIndex + 1, dataToSave);
          }
        }
      }
    } else {
      dataToSave = await fillPageWithValues(valueStructure[stepName], data[0], additionalData);
      saveToLocalStorage(profile, stepName, undefined, undefined, dataToSave);
    }
  }

  localStorage.setItem('dpi_additional_data', JSON.stringify(profileIds));
}

export { convertToInput };
