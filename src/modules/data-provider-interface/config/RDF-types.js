// all properties which value is a single URI
const singularURI = {
    datasets: [
        "dct:publisher",
        "dct:accrualPeriodicity",
        "dct:spatial",
        "dct:accessRights",
        "dct:type",
        // singular URIs nested within other properties
        'vcard:hasEmail', // contact point
        'vcard:hasURL', // contect point
        'dext:isUsedBy', // isUsedBy
        'foaf:mbox', // creator
        'foaf:homepage', // creator
        'dct:format', // page
    ],
    distributions: [
        "dct:format",
        "dct:type",
        "dcat:mediaType",
        "dcatap:availability",
        "dcat:compressFormat",
        "dcat:packageFormat",
        "adms:status",
        // singular URIs nested within other properties
        'spdx:algorithm', // checksum
        'dcat:endpointURL', // accessservice
        "skos:exactMatch", // license
    ],
    catalogues: [
        'foaf:homepage', // homepage and creator
        'dct:publisher',
        'dct:spatial',
        'dct:isPartOf',
        // singular URIs nested within other properties
        'foaf:mbox', // creator
        'dct:format', // page
        "skos:exactMatch", // license
    ],
};

// all properties with multiple URI values
const multipleURI = {
    datasets: [
        "dct:language", 
        "dct:subject",  
        "dcat:theme",
        "dct:source",
        "dcat:landingPage",
        "dct:relation",
        "dcat:qualifiedRelation",
        "prov:qualifiedAttribution",
        "dct:isReferencedBy",
        "prov:wasGeneratedBy",
        "dct:isVersionOf",
        "dct:hasVersion",
    ],
    distributions: [
        "dcat:accessURL",
        "dcat:downloadURL",
        "dct:language",
        "odrl:hasPolicy",
    ],
    catalogues: [
        "dct:hasPart",
        'dcat:catalog',
        'dct:language',
    ],
};

// all properties which are typed strings
const typedStrings = {
    datasets: [
        "dct:issued",
        "dct:modified",
        "dcat:spatialResolutionInMeters",
        // nested typed strings
        'dcat:endDate',
        'dcat:startDate',
    ],
    distributions: [
        "dct:issued",
        "dct:modified",
        "dcat:spatialResolutionInMeters",
        "dcat:byteSize",
    ],
    catalogues: [],
};

// all properties with a singular string
const singularString = {
    datasets: [
        "owl:versionInfo",
        // nested singulat strings
        'vcard:fn', // contactPoint
        'vcard:hasOrganizationName', // contactPoint
        'vcard:hasTelephone', // contactPoint
        "vcard:country_name", // hasAddress
        "vcard:locality", // hasAddress
        "vcard:postal_code", // hasAddress
        "vcard:street_address", // hasAddress
        'rdfs:label', // conformsTo and provenance
        'foaf:name', // creator
    ],
    distributions: [
        // nested singular string
        'spdx:checksumValue', //checksum
        'rdfs:label', // rights !!!
        "skos:prefLabel", //license
    ],
    catalogues: [
        // nested singular strings
        'rdfs:label', // conformsTo and rights
        'foaf:name', // creator
        "skos:prefLabel", // license
    ],
};

// all properties which can be provided in different languages
const multilingualStrings = {
    datasets: [
        "dct:title", // also nested within page
        "dct:description", // also nested within page
        "dcat:keyword",
        "adms:versionNotes",
    ],
    distributions: [
        "dct:title", // also nested within page
        "dct:description", // also nested within page
    ],
    catalogues: [
        'dct:title', 
        'dct:description', 
    ],
};

// all properties which contain grouped values
const groupedProperties = {
    datasets: [
        'dcat:contactPoint',
        'dct:creator',
        'dext:metadataExtension',
        'dct:provenance',
        'dct:conformsTo',
        'foaf:page',
        'dct:temporal',
        'adms:identifier',
        // nested grouped properties
        'vcard:hasAddress',
        'skos:notation',
    ],
    distributions: [
        'foaf:page',
        'dcat:accessService',
    ],
    catalogues: [
        'dct:creator',
        'dct:conformsTo',
    ]
};

const additionalPropertyTypes = {
    'dct:temporal': 'dct:PeriodOfTime',
    'dct:conformsTo': 'dct:Standard',
    'foaf:page': 'foaf:Document',
    'dct:provenance': 'dct:ProvenanceStatement',
    'dext:metadataExtension': 'dext:MetadataExtension',
    'spdx:checksum': 'spdx:Checksum',
    'dcat:accessService': 'dcat:DataService',
}

export default {
    singularURI,
    multipleURI,
    typedStrings,
    singularString,
    multilingualStrings,
    groupedProperties,
    additionalPropertyTypes,
};