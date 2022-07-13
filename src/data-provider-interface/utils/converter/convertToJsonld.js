/* eslint-disable guard-for-in,no-restricted-syntax,camelcase,consistent-return,brace-style,no-param-reassign,no-await-in-loop,no-lonely-if*/
import * as jsonld from 'jsonld';
import context from './context.json';
import {
  additionalType,
  additionalTypeProperties,
} from './propertyClassification';

function getRandomNumber() {
  // Maybe get a "better" random number?
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 20);
}

function getNumberOfDistributions() {
  return JSON.parse(localStorage.getItem('numberOfDistributions'));
}

function getActualNumberOfDistributions() {
  return Object.keys(localStorage).filter(dataset => dataset.startsWith('inputValues') && dataset.includes('distribution')).length;
}

function needsUriTransformation(value) {
  let result = false;
  if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('www.') || value.includes('@'))) {
    result = true;
  }
  return result;
}

/**
 * @description Extracts values from localStorage depending on their names
 * @param {String} profile Name of profile which is included within the value name
 * @returns Array containing multiple objects containing the input values
 */

function getLocalstorageValues(profile) {
  const values = {};
  values[profile] = {};
  const numberOfDistributions = getNumberOfDistributions();
  const actualNumberOfDistributions = getActualNumberOfDistributions();

  if (profile === 'datasets' && actualNumberOfDistributions > 0) {
    for (let distIndex = 1; distIndex <= numberOfDistributions; distIndex += 1) {
      values[`distribution_${distIndex}`] = {};
    }
  }
  for (const index in Object.keys(localStorage)) {
    const variableName = Object.keys(localStorage)[index];

    if (variableName.startsWith(`inputValues_${profile}`)) {
      if (variableName.includes('distribution')) {
        for (let subIndex = 1; subIndex <= numberOfDistributions; subIndex += 1) {
          if (variableName.endsWith(subIndex)) {
            Object.assign(values[`distribution_${subIndex}`], JSON.parse(localStorage.getItem(variableName)));
          }
        }
      } else {
        Object.assign(values[profile], JSON.parse(localStorage.getItem(variableName)));
      }
    }
  }

  return values;
}

/**
 * @description TODO
 * @param {String} data TODO
 * @param {String} profile TODO
 * @param {String} value TODO
 * @returns TODO
 */
function enrichData(data, profile, value) {
  if (value === 'dcat:temporalResolution') {
    const tempResData = data[profile][value][0];
    const temporalResolution = `P${tempResData.Year ? tempResData.Year : 0}Y${tempResData.Month ? tempResData.Month : 0}M${tempResData.Day ? tempResData.Day : 0}DT${tempResData.Hour ? tempResData.Hour : 0}H${tempResData.Minute ? tempResData.Minute : 0}M${tempResData.Second ? tempResData.Second : 0}S`;
    data[profile][value] = temporalResolution;
  } else if (additionalTypeProperties.includes(value)) {
    if (value === 'dct:rights') {
      const rightsObject = { '@type': additionalType[value] };
      rightsObject['rdfs:label'] = data[profile][value];
      data[profile][value] = rightsObject;
    } else if (value !== 'dct:license' || (value === 'dct:license' && typeof data[profile][value] !== 'string')) {
      for (let addIndex = 0; addIndex < data[profile][value].length; addIndex += 1) {
        data[profile][value][addIndex]['@type'] = additionalType[value];
      }
    }
  }
}

/**
 * @description TODO
 * @param {String} data TODO
 * @param {String} profile TODO
 * @param {String} value TODO
 * @returns TODO
 */
function transformIntoUri(data, profile, value) {
  const currentData = data[profile][value];
  if (Array.isArray(currentData)) {
    for (let index = 0; index < currentData.length; index += 1) {
      if (typeof currentData[index] === 'object') {
        for (const objectKey in currentData[index]) {
          if (needsUriTransformation(currentData[index][objectKey])) {
            if (Object.keys(currentData[index]).length === 1) {
              if (currentData[index][objectKey].includes('@')) {
                currentData[index] = { '@id': `mailto:${currentData[index][objectKey]}` };
              } else {
                currentData[index] = { '@id': currentData[index][objectKey] };
              }
            } else {
              if (objectKey !== '@id') {
                if (currentData[index][objectKey].includes('@')) {
                  currentData[index][objectKey] = { '@id': `mailto:${currentData[index][objectKey]}` };
                } else {
                  currentData[index][objectKey] = { '@id': currentData[index][objectKey] };
                }
              }
            }
          }
        }
      } else {
        if (needsUriTransformation(currentData[index])) {
          if (currentData[index].includes('@')) {
            currentData[index] = { '@id': `mailto:${currentData[index]}` };
          } else {
            currentData[index] = { '@id': currentData[index] };
          }
        }
      }
    }
  } else {
    if (needsUriTransformation(currentData)) {
      if (currentData.includes('@')) {
        data[profile][value] = { '@id': `mailto:${currentData}` };
      } else {
        data[profile][value] = { '@id': currentData };
      }
    }
  }
}

/**
 * @description Add metadata for linked data to value objects
 * @param {String} profile Name of profile to add metadata to
 * @returns Object or Array containing the enriched data values
 */
async function addMetadata(profile) {
  const data = getLocalstorageValues(profile);

  if (profile === 'catalogues') {
    // Catalogue data
    const metadata = {
      '@id': getRandomNumber(),
      '@type': 'dcat:Catalogue',
    };

    const catalogueJsonld = { ...context, ...metadata, ...data[profile] };
    return catalogueJsonld;
  }

  if (profile === 'datasets') {
    const datasetJsonld = [];
    const distributions = [];

    const numberOfDistributions = getNumberOfDistributions();
    const actualNumberOfDistributions = getActualNumberOfDistributions();

    if (actualNumberOfDistributions > 0) {
      for (let index = 0; index < numberOfDistributions; index += 1) {
        const randomStringDist = getRandomNumber();
        const distributionURI = { '@id': `https://piveau.eu/set/data/${randomStringDist}` };
        distributions.push(distributionURI);
      }
    }

    // Dataset data
    const randomString = getRandomNumber();
    const dataset_metadata = {
      '@id': `https://piveau.eu/set/data/${randomString}`, // will be overwritten by backend
      '@type': 'dcat:Dataset',
      'dcat:distribution': distributions, // will be overwritten
      'adms:sample': '', // will be set by backend
      'dct:catalog': '', // will be set by backend
    };

    for (const value in data[profile]) {
      enrichData(data, profile, value);
      if (value !== 'dct:provenance') {
        transformIntoUri(data, profile, value);
      }
    }

    const dataset_object = { ...context, ...dataset_metadata, ...data[profile] };
    datasetJsonld.push(dataset_object);

    // Distribution data
    for (const dist_index in Object.keys(data)) {
      if (Object.keys(data)[dist_index].startsWith('distribution')) {
        const distKey = Object.keys(data)[dist_index];
        const distNumber = parseInt(distKey.split('_').pop(), 10) - 1;

        const distribution_metadata = {
          '@id': distributions[distNumber]['@id'], // will be overwritten by backend
          '@type': 'dcat:Distribution',
        };

        for (const distValue in data[distKey]) {
          enrichData(data, distKey, distValue);
          transformIntoUri(data, distKey, distValue);
        }

        const distribution_object = { ...context, ...distribution_metadata, ...data[distKey] };
        datasetJsonld.push(distribution_object);
      }
    }

    return datasetJsonld;
  }
}

/**
 * @description Converts given input values to JSON-LD
 * @param {String} profile Name of profile to convert
 * @returns Object containing converted data in JSON-LD format
 */
async function convertToJsonld(profile) {
  const data = await addMetadata(profile);
  const convertedJSONLD = await jsonld.compact(data, context);
  return convertedJSONLD;
}

export { convertToJsonld };
