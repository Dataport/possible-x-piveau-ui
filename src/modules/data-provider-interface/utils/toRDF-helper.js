import datasetFactory from '@rdfjs/dataset';
import dataFactory from '@rdfjs/data-model';

import RDFtypes from '../config/RDF-types';

import generalHelper from '../utils/general-helper';
import { isEmpty } from 'lodash';
import { has } from 'lodash';

/**
 * 
 * @param {*} data 
 * @param {*} property 
 * @returns 
 */
function convertToRDF(data, property) {
    const RDFdata = datasetFactory.dataset();

    if (property === 'datasets') {
        convertPropertyValues(RDFdata, data.datasets, property);
        for (let index = 0; index < data.distributions.length; index += 1) {
            convertPropertyValues(RDFdata, data.distributions[index], 'distributions');
        }
    } else { // catalogues
        convertPropertyValues(RDFdata, data.catalogues, property);
    }

    return RDFdata;
}

/**
 * 
 * @param {*} RDFdataset 
 * @param {*} data 
 * @param {*} property 
 */
function convertPropertyValues(RDFdataset, data, property) {
    // if dataset -> add sample, id, type, distribution
    // if distribution -> add id, type and id to dataset
    // if catalogue -> add id und type

    const valueKeys = Object.keys(data);
    for (let index = 0; index < valueKeys.length; index += 1) {
        const key = valueKeys[index];

        // handling of id, type, distribution, sample and dct:type

        if (RDFtypes.singularString[property].includes(key)) {
            convertSingularString(RDFdataset, '', data, key);
        } else if (RDFtypes.singularURI[property].includes(key)) {
            convertSungularURI(RDFdataset, '', data, key);
        } else if (RDFtypes.multipleURI[property].includes(key)) {
            convertMultipleURI(RDFdataset, '', data, key);
        } else if (RDFtypes.typedStrings[property].includes(key)) {
            convertTypedString(RDFdataset, '', data, key);            
        } else if (RDFtypes.multilingualStrings[property].includes(key)) {
            // multilingual fields always provide data as followed
            // [ { '@value': '....', '@language': '...' }, ... ]
            
            // TODO: double language selection or missing language!!!!!!!!!
            
            // handle empty value and empty language
        }
    }
    console.log('###', RDFdataset);
}

//-----------------------------------------------------------------------------------------------------
//                  basic conversion methods for different categories of data
//-----------------------------------------------------------------------------------------------------
// seems at first to be unnecessary but if we want to convert nested properties as well, we need these 
// methods (especially to provide the correct parent URI)

/**
 * 
 * @param {*} RDFdataset 
 * @param {*} id 
 * @param {*} data 
 * @param {*} key 
 */
function convertSingularString(RDFdataset, id, data, key) {
    // what to do with @type???
    if (!isEmpty(data[key])) {
        RDFdataset.add(dataFactory.quad(
            dataFactory.namedNode(id),
            dataFactory.namedNode(generalHelper.addNamespace(key)),
            dataFactory.literal(data[key])
        ))
    }
}

/**
 * 
 * @param {*} RDFdata 
 * @param {*} id 
 * @param {*} data 
 * @param {*} key 
 */
function convertSungularURI(RDFdataset, id, data, key) {
    // URIs can either be a normal URL or an email address
    if (!isEmpty(data[key])) {
        let singleURI;
        if (data[key].includes('@')) {
            // mail address
            singleURI = `mailto:${data[key]}`;
        } else {
            // normal URL
            singleURI = data[key];
        }
        RDFdataset.add(dataFactory.quad(
            dataFactory.namedNode(id),
            dataFactory.namedNode(generalHelper.addNamespace(key)),
            dataFactory.namedNode(singleURI)
        ));
    }
}

/**
 * 
 * @param {*} RDFdataset 
 * @param {*} id 
 * @param {*} data 
 * @param {*} key 
 */
function convertMultipleURI(RDFdataset, id, data, key) {
    // there are two different formats the frontend delivers multiple URIs
    // 1: [ "URI1", "URI2" ]
    // 2: [ { "@id": "URI1" }, { "@id": "URI2" } ]
    for (let uriIndex = 0; uriIndex < data[key].length; uriIndex += 1) {

        let currentURI;
        if (typeof data[key][uriIndex] === 'string' && !isEmpty(data[key][uriIndex])) {
            currentURI = data[key][uriIndex];
        } else if (typeof data[key][uriIndex] === 'object' && has(data[key][uriIndex], '@id') && !isEmpty(data[key][uriIndex])) {
            currentURI = data[key][uriIndex]['@id'];
        }

        RDFdataset.add(dataFactory.quad(
            dataFactory.namedNode(id), 
            dataFactory.namedNode(generalHelper.addNamespace(key)),
            dataFactory.namedNode(currentURI)
        ));
    }
}

/**
 * 
 * @param {*} RDFdataset 
 * @param {*} id 
 * @param {*} data 
 * @param {*} key 
 */
function convertTypedString(RDFdataset, id, data, key) {
    if (!isEmpty(data[key])) {
        // there is a variety of properties which can have different types
        let valueType;

        // dct:issued and dct:modified can eihter be xsd:date or xsd:dateTime
        // date format: 2022-09-25
        // dateTime format: 2022-09-25T00:00
        if (key === 'dct:issued' || key === 'dct:modified') {
            if (data[key].includes('T')) {
                // dateTime
                valueType = generalHelper.addNamespace('xsd:dateTime');
            } else {
                // date
                valueType = generalHelper.addNamespace('xsd:date');
            }
        } else if (key === 'dcat:endDate' || key === 'dcat:startDate') {
            // dcat:endDate and dcat:startDate are xsd:dateTime
            valueType = generalHelper.addNamespace('xsd:dateTime');
        } else if (key === 'dcat:spatialResolutionInMeters' || key === "dcat:byteSize") {
            // dcat:spatialResolutionInMeters and dcat:byteSize are xsd:decimal
            valueType = generalHelper.addNamespace('xsd:decimal');
        }

        RDFdataset.add(dataFactory.quad(
            dataFactory.namedNode(id),
            dataFactory.namedNode(generalHelper.addNamespace(key)),
            dataFactory.literal(data[key], '', dataFactory.namedNode(valueType)) //why????
        ));
    }
}

export default {
    convertToRDF,
};