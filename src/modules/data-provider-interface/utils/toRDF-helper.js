import N3 from 'n3';
import { isEmpty } from 'lodash';
import { has } from 'lodash';

import RDFtypes from '../config/RDF-types';
import prefixes from '../config/prefixes';

import generalHelper from '../utils/general-helper';

/**
 * 
 * @param {*} data 
 * @param {*} property 
 * @returns 
 */
function convertToRDF(data, property) {
    const RDFdata = new N3.Writer({prefixes});
    let finishedRDFdata;
    const datasetURI = `https://piveau.eu/set/data/${data.datasets.datasetID}`; // datasetURI also needed for distribution creation (add distributionURI to dataset (dcat:distribution))

    if (property === 'datasets') {
        convertPropertyValues(RDFdata, data.datasets, property, '', '', true, datasetURI);
        // include distribution data into same graph
        for (let index = 0; index < data.distributions.length; index += 1) {
            convertPropertyValues(RDFdata, data.distributions[index], 'distributions', '', '', true, datasetURI);
        }
    } else { // catalogues
        convertPropertyValues(RDFdata, data.catalogues, property, '', '', true, datasetURI);
    }

    RDFdata.end((error, result) => finishedRDFdata = result);
    console.log(finishedRDFdata);
    return finishedRDFdata;
}

/**
 * 
 * @param {*} RDFdataset 
 * @param {*} data 
 * @param {*} property 
 */
function convertPropertyValues(RDFdataset, data, property, preMainURI, preMainType, setMain, datasetURI) {

    // at first handle id and type of property (sub properties need id of property)
    let mainURI;
    let mainType;

    if (setMain) {
        if (property === 'datasets') {
            mainType = generalHelper.addNamespace('dcat:Dataset');
            mainURI = N3.DataFactory.namedNode(datasetURI); // datasetID should never be empty because of frontend checking
        } else if (property === 'catalogues') {
            mainType = generalHelper.addNamespace('dcat:Catalog');
            mainURI = N3.DataFactory.namedNode(`https://piveau.eu/set/data/${data.datasetID}`); // datasetID should never be empty because of frontend checking
        } else {
            mainType = generalHelper.addNamespace('dcat:Distribution');
            const randomId = generalHelper.makeId(10);
            mainURI = N3.DataFactory.namedNode(`https://piveau.eu/set/data/${randomId}`);
        }

        setAdditionalProperties(RDFdataset, data, mainURI, mainType, property, datasetURI);
    } else {
        mainURI = preMainURI;
        mainType = preMainType;
    }
    
    // loop trough all keys within data object and convert values (or nested properties) to RDF
    const valueKeys = Object.keys(data);
    for (let index = 0; index < valueKeys.length; index += 1) {
        const key = valueKeys[index];

        // all properties are sorted by their resulting RDF format (see .../data-provider-interface/config/RDFtypes.js)
        if (RDFtypes.singularString[property].includes(key)) {
            convertSingularString(RDFdataset, mainURI, data, key);
        } else if (RDFtypes.singularURI[property].includes(key)) {
            convertSingularURI(RDFdataset, mainURI, data, key);
        } else if (RDFtypes.multipleURI[property].includes(key)) {
            convertMultipleURI(RDFdataset, mainURI, data, key);
        } else if (RDFtypes.typedStrings[property].includes(key)) {
            convertTypedString(RDFdataset, mainURI, data, key);            
        } else if (RDFtypes.multilingualStrings[property].includes(key)) {
            convertMultilingual(RDFdataset, mainURI, data, key);
        } else if (RDFtypes.groupedProperties[property].includes(key)) {
            // handle grouped properties (singular and with multiple instances!)
            if (!isEmpty(data[key])) {
                // properties are provided within an array (because of grouping in form)
                for (let groupId = 0; groupId < data[key].length; groupId += 1) {
                    const currentGroupData = data[key][groupId];

                    if(!isEmpty(currentGroupData)) {
                        let groupBlankNode;

                        // page and adms.Identifier have a @id-field to provide an URI
                        if ((key === 'foaf:page' || key === 'adms:identifier' || key === 'dct:conformsTo') && has(currentGroupData, '@id')) groupBlankNode = N3.DataFactory.namedNode(currentGroupData['@id'])
                        else groupBlankNode = N3.DataFactory.blankNode('');

                        RDFdataset.addQuad(N3.DataFactory.quad(
                            mainURI,
                            N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
                            groupBlankNode
                        ))

                        // some properties provide additional types
                        // not provided via hidden inputs because this seems not to work reliable
                        if (has(RDFtypes.additionalPropertyTypes, key)) {
                            RDFdataset.addQuad(N3.DataFactory.quad(
                                groupBlankNode,
                                N3.DataFactory.namedNode(generalHelper.addNamespace('rdf:type')),
                                N3.DataFactory.namedNode(generalHelper.addNamespace(RDFtypes.additionalPropertyTypes[key]))
                            ))
                        }

                        if (key === 'skos:notation') {
                            if (has(currentGroupData, '@value') && !isEmpty(currentGroupData['@value'])) {
                                let notationValue;

                                if (has(currentGroupData, '@type') && !isEmpty(currentGroupData['@type'])) {
                                    notationValue = N3.DataFactory.literal(currentGroupData['@value'], N3.DataFactory.namedNode(currentGroupData['@type']));
                                } else {
                                    notationValue = N3.DataFactory.literal(currentGroupData['@value']);
                                }
                                RDFdataset.addQuad(N3.DataFactory.quad(
                                    groupBlankNode,
                                    N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
                                    notationValue
                                ))
                            }
                        }

                        // convert nested properties
                        convertPropertyValues(RDFdataset, currentGroupData, property, groupBlankNode, mainType, false);
                    }
                }
            }
        } else if (key === 'dcat:temporalResolution') {
            // temporal resolution is displayed as group of input forms for each property (year, month, day, ...)
            // the form provides the data as following: [ { 'Year': '...', 'Month': '...', ... } ]
            // the final format of this property should look like this: P?Y?M?DT?H?M?S
            // not all values must be filled and therefore be present -> default behavior if not given: property = 0

            if(!isEmpty(data[key])) {
                const resolutionValues = data[key][0]; // frontend always returns an arry with only one object inside
                const valueString = `P${resolutionValues.Year ? resolutionValues.Year : 0}Y${resolutionValues.Month ? resolutionValues.Month : 0}M${resolutionValues.Day ? resolutionValues.Day : 0}DT${resolutionValues.Hour ? resolutionValues.Hour : 0}H${resolutionValues.Minute ? resolutionValues.Minute : 0}M${resolutionValues.Second ? resolutionValues.Second : 0}S`;

                RDFdataset.addQuad(N3.DataFactory.quad(
                    mainURI,
                    N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
                    N3.DataFactory.literal(valueString, N3.DataFactory.namedNode(generalHelper.addNamespace('xsd:duration')))
                ))
            }
        } else if (key === 'dct:identifier') {
            // form provides data as follows: [ { '@value': 'string1' }, { '@value': 'string2' }, ... ]
            for (let valueId = 0; valueId < data[key].length; valueId += 1) {
                const currentValue = data[key][valueId];
                if (has(currentValue, '@value') && !isEmpty(currentValue['@value'])) {
                    RDFdataset.addQuad(N3.DataFactory.quad(
                        mainURI,
                        N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
                        N3.DataFactory.literal(currentValue['@value'])
                    ))
                }
            }
        } else if (key === 'dct:rights') {
            if (!isEmpty(data[key])) {
                // rights also have a static type 
                // is not provided within definition file because this would require to add another group-level to the definition but since rights is already 
                // handled seperated within the converter, the type will be added here (less changes required)

                const rightsBlankNode = N3.DataFactory.blankNode('');

                RDFdataset.addQuad(N3.DataFactory.quad(
                    mainURI,
                    N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
                    rightsBlankNode
                ))

                // add additional type declaration
                RDFdataset.addQuad(N3.DataFactory.quad(
                    rightsBlankNode,
                    N3.DataFactory.namedNode(generalHelper.addNamespace('rdf:type')),
                    N3.DataFactory.namedNode(generalHelper.addNamespace('dct:RightsStatement'))
                ))

                // rights provides either an URI or a string ( { rdfs:label : 'URL/string' } )
                let rightsValue;

                if (generalHelper.isUrl(data[key])) {
                    rightsValue = N3.DataFactory.namedNode(data[key]);
                } else {
                    rightsValue = N3.DataFactory.literal(data[key]);
                }

                // add actual value
                RDFdataset.addQuad(N3.DataFactory.quad(
                    rightsBlankNode,
                    N3.DataFactory.namedNode(generalHelper.addNamespace('rdfs:label')),
                    rightsValue
                ))
            }
        } else if (key === 'dct:license') {
            // dct:license either provides a singular URI or a group of properties 
            if (!isEmpty(data[key])) {
                if (typeof data[key] === 'string') {
                    convertSingularURI(RDFdataset, mainURI, data, key);
                } else {
                    // license provides an array containing an object with all subproperties
                    // Grouped properties need a bank node
                    const licenceBlankNode = N3.DataFactory.blankNode('');

                    RDFdataset.addQuad(N3.DataFactory.quad(
                        mainURI,
                        N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
                        licenceBlankNode
                    ))

                    // add additional type
                    RDFdataset.addQuad(N3.DataFactory.quad(
                        licenceBlankNode,
                        N3.DataFactory.namedNode(generalHelper.addNamespace('rdf:type')),
                        N3.DataFactory.namedNode(generalHelper.addNamespace('dct:LicenseDocument'))
                    ))

                    // add nested properties
                    convertPropertyValues(RDFdataset, data[key][0], property, licenceBlankNode, mainType, false);
                }
            }
        } else if (key === 'rdf:type') {
            // some properties have additional type information submitted by hidden form inputs
            if (!isEmpty(data[key])) {
                RDFdataset.addQuad(N3.DataFactory.quad(
                    mainURI,
                    N3.DataFactory.namedNode(generalHelper.addNamespace('rdf:type')),
                    N3.DataFactory.namedNode(generalHelper.addNamespace(data[key]))
                ))
            }
        }
    }
}

/**
 * Add additional properties to RDF data
 * @param {*} mainURI URI of current property
 * @param {*} mainType Type of current property
 */
function setAdditionalProperties(RDFdataset, data, mainURI, mainType, property, datasetURI) {

    // adding id and type of property
    RDFdataset.addQuad(N3.DataFactory.quad(
        mainURI,
        N3.DataFactory.namedNode(generalHelper.addNamespace('rdf:type')),
        N3.DataFactory.namedNode(mainType)
    ))

    // adding sample and catalog for datasets
    if (property === 'datasets') {
        RDFdataset.addQuad(N3.DataFactory.quad(
            mainURI,
            N3.DataFactory.namedNode(generalHelper.addNamespace('adms:sample')),
            N3.DataFactory.literal('')
        ))

        RDFdataset.addQuad(N3.DataFactory.quad(
            mainURI,
            N3.DataFactory.namedNode('dct:catalog'), // no actual vocabulary
            N3.DataFactory.literal(data['dct:catalog']) // hould never be empty because of frontend checking
        ))
    }

    // catalogues always have to contain the property dct:type with the value 'dcat-ap'
    if (property === 'catalogues') {
        RDFdataset.addQuad(N3.DataFactory.quad(
            mainURI,
            N3.DataFactory.namedNode(generalHelper.addNamespace('dct:type')),
            N3.DataFactory.literal('dcat-ap')
        ))
    }

    // add distribution id to dataset (dcat:distribution)
    if (property === 'distributions') {
        RDFdataset.addQuad(N3.DataFactory.quad(
            N3.DataFactory.namedNode(datasetURI),
            N3.DataFactory.namedNode(generalHelper.addNamespace('dcat:distribution')),
            N3.DataFactory.namedNode(mainURI)
        ))
    }
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
        RDFdataset.addQuad(N3.DataFactory.quad(
            id,
            N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
            N3.DataFactory.literal(data[key])
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
function convertSingularURI(RDFdataset, id, data, key) {
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
        RDFdataset.addQuad(N3.DataFactory.quad(
            id,
            N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
            N3.DataFactory.namedNode(singleURI)
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

        RDFdataset.addQuad(N3.DataFactory.quad(
            id, 
            N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
            N3.DataFactory.namedNode(currentURI)
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

        RDFdataset.addQuad(N3.DataFactory.quad(
            id,
            N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
            N3.DataFactory.literal(data[key], N3.DataFactory.namedNode(valueType))
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
function convertMultilingual(RDFdataset, id , data, key) {
    // multilingual fields always provide data as followed
    // [ { '@value': '....', '@language': '...' }, ... ]

    if (!isEmpty(data[key])) {
        for (let langIndex = 0; langIndex < data[key].length; langIndex += 1) {
            const currentData = data[key][langIndex];
            // only save data if a values is given (forntend provides preselected language which don't need to be saved if there is no actaul value)
            if (!isEmpty(currentData) && has(currentData, '@value') && !isEmpty(currentData['@value'])) {
                // if there is no langauge given, take current locale
                let languageTag;

                if (!has(currentData, '@language') || isEmpty(currentData, '@language')) {
                    languageTag = 'en'; // change to current locale selected
                } else {
                    languageTag = currentData['@language'];
                }
                RDFdataset.addQuad(N3.DataFactory.quad(
                    id,
                    N3.DataFactory.namedNode(generalHelper.addNamespace(key)),
                    N3.DataFactory.literal(currentData['@value'], languageTag)
                ))
            }
        }
    }
}

export default {
    convertToRDF,
};