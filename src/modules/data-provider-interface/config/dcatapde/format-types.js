// all properties which value is a single URI
const singularURI = {
    datasets: [
        "dct:publisher",
        "dct:accrualPeriodicity",
        "dct:spatial",
        "dct:accessRights",
        "dct:type",
        "dcatap:availability",
        "dcatde:qualityProcessURI",
        "dct:references",

        
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
        "dcatde:politicalGeocodingLevelURI",
        "dcatde:politicalGeocodingURI",
        "dcatde:contributorID",
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
        "dcatap:availability",
    ],
    catalogues: [
        "dct:hasPart",
        'dcat:catalog',
        'dct:language',
        "dcatap:availability",
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
        "dcatde:geocodingDescription",
        "dcatde:legalBasis",
        "dcatde:licenseAttributionByText",
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
        "dct:contributor",
        "dcatde:originator",
        "dcatde:maintainer",
    ],
    distributions: [
        'foaf:page',
        'dcat:accessService',
        'spdx:checksum',
        'dct:conformsTo',
    ],
    catalogues: [
        'dct:creator',
        'dct:conformsTo',
    ]
};

// some properties have additional statement included which must be added to the linked data
const additionalPropertyTypes = {
    'dct:temporal': 'dct:PeriodOfTime',
    'dct:conformsTo': 'dct:Standard',
    'foaf:page': 'foaf:Document',
    'dct:provenance': 'dct:ProvenanceStatement',
    'dext:metadataExtension': 'dext:MetadataExtension',
    'spdx:checksum': 'spdx:Checksum',
    'dcat:accessService': 'dcat:DataService',
}

// multiple URIs provided by the form can be formated as an array of objects containing the URI as value of key '@id'
const multiURIobjects = {
    datasets: [
        "dct:source",
        "dcat:landingPage",
        "dct:relation",
        "dcat:qualifiedRelation",
        "prov:qualifiedAttribution",
        "dct:isReferencedBy",
        "prov:wasGeneratedBy",
        "dct:isVersionOf",
        "dct:hasVersion",
        "dcatde:politicalGeocodingURI",
    ],
    distributions: [
        "dcat:accessURL",
        "dcat:downloadURL",
        "odrl:hasPolicy",
    ],
    catalogues: [
        "dct:hasPart",
        'dcat:catalog',
    ]
}

// multiple URIs provided by the form can be also formated as an array of URIs (autocomplete fields)
const multiURIarray = {
    datasets: [
        "dct:language", 
        "dct:subject",  
        "dcat:theme",
        "dcatde:politicalGeocodingLevelURI",
        
        "dcatde:contributorID",
    ],
    distributions: [
        "dct:language",
    ],
    catalogues: [
        'dct:language',
    ]
}

export default {
    singularURI,
    multipleURI,
    typedStrings,
    singularString,
    multilingualStrings,
    groupedProperties,
    additionalPropertyTypes,
    multiURIobjects,
    multiURIarray,
};