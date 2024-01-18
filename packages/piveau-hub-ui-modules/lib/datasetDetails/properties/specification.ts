export const dcatFields = `releaseDate,modificationDate,creator,landingPages,sources,
    languages,publisher,contactPoints,catalogRecord,spatial,
    spatialResource,conformsTo,provenances,identifiers,otherIdentifiers,resource,
    frequency,accessRights,accrualPeriodicity,hasVersion,isVersionOf,
    temporal,versionInfo,versionNotes,attributes,dimensions,numSeries,hasQualityAnnotations,
    statUnitMeasures,isReferencedBy,qualifiedAttributions,wasGeneratedBy,
    qualifiedRelations,sample,spatialResolutionInMeters,type,temporalResolution`;

export const dcatDeFields = `politicalGeocodingLevelURI,politicalGeocodingURI,availability,
    contributorID,geocodingDescriptionDe,legalBasis,qualityProcessURI,typeDe,
    references,contributor,originator,maintainer`;

/*
    Below we have schemata describing how properties should be rendered in DatasetDatailsProperties.vue. A schema is
    an object where keys correspond to the above defined fields. For each key, the value is an object the format of which
    we will now describe:

    - type: is the the only required property. Will be evaluated in typeCheckers.ts. It reflects the format of the
    data item (CALLED "response" BELOW!) retrieved by from the search network response (number, string, url, array, object, array of objects).
    Supported values are:
        * "number": response is a single number
        * "first:number": render response[0] as a number
        * "string": response a simple string
        * "uri": response a simple string, rendered as a link
        * "date": response a simple string, formatted as a date conforming to the current locale
        * "translation": response an object containing locale keys (like "en", "de"). The value corresponding to the
            current locale is rendered
        * "object": response an object whose where each key-value pair is rendered on a separate line
        * "array": response an array whose elements are rendered vertically
        * "links": reponse either an array of uri-strings rendered as links, or an
            array of objects with a label field that is displayed as a link and another field
            holding the href; that other field is either resource, label or id

    - translate: for a property "xxx", we have a bold label and tooltip to the left which comes from
    an i18n translation; the default i18n keys are: message.tooltip.datasetDetails.xxx for the tooltip and
    message.metadata.xxx for the displayed label. if instead of xxx, you want to use another key (with the same prefixes),
    translate can provide it. If translate is two strings separated by commas, the left one applies to the tooltip, the right
    to the label. Instead of just a replacement for xxx, you can provide i18n keys without the prefixes by starting the string with
    a slash (example: translate:"/message.tooltip.yyy,/message.mykey.mylabelkey"). Instead of translation keys, you can also
    provide literal values as tooltip or label by enclosing the strings in single quotes.

    - fields: for objects and arrays of objects, this comma-separated value indicates, what keys of the objects should
    be used for display (filtering out any additional data in the object). If not present, all existent keys will be used.
    A key given in this comma separated list can be of the form "x": just a key, or of the form "x:y": key x of type y (where
    the type is any of "link", "link_blank", "date" or empty; accordingly, a link (possibly target="_blank") or date will be displayed).
    Also the form "x:y:z" is possible, where z is an indication how to translate the key for rendering. If z does not exist,
    the i18n key message.metadata.x will be translated; if z exists, we use message.metadata.z instead. The additional properties for
    "translate" above can also be applied to z: leading slash or single quotes.

    - track: enable Matomo tracking for a link. track is a string value indicating the key of the data object for which
    tracking should be enabled.

    - itemstyles: a string of CSS properties that applies to key-value items of a rendered object

    - transform: a function that maps the data to be rendered. Applies after the data has been processed in the value-method of
    DatsetDetailsProperty.vue

    - preTransform: same as transform, only applied to the raw data value before processing in the value-method

 */

export const dcatSchema = (t) => ({
    releaseDate: {type: 'date', translate: 'created'},
    modificationDate: {type: 'date', translate: 'updated'},
    landingPages: {type: 'links', translate: 'landingPage'},
    sources: {type: 'links', translate:',sources'},
    languages: {type: 'links', translate: 'language,languages'},
    publisher: {type: 'object', fields: 'name,email,homepage'},
    contactPoints: {type: 'objects', translate:"/message.tooltip.contactPoints,contactPoints", fields: "name::/message.datasetDetails.contactPoints.organizationName,email,telephone,address,url::'URL'"},
    catalogRecord: {type: 'object', translate:"/message.tooltip.catalogRecord,catalogRecord", fields: "issued:date:addedToDataEuropaEU,modified:date:updatedOnDataEuropaEU,homepage"},
    spatial: {type: 'objects', fields: "coordinates,type"},
    spatialResource: {type: 'objects', translate:",spatialResource", fields: "resource:link"},
    conformsTo: {type: 'objects', fields: "title::label,label,resource:link_blank", track:"resource"},
    provenances: {type: 'objects', translate: 'provenance,provenances', fields: "label,resource:link"},
    // relatedResources: {type: 'links', translate: 'relatedResource,relatedResources'},
    identifiers: {type: 'links', translate: 'identifier,identifiers'},
    otherIdentifiers: {type: 'objects', translate: 'otherIdentifier,otherIdentifiers', fields:"identifier:link,resource:link:identifier,scheme:link"},
    resource: {type: 'uri', translate: ",'uriRef'"},
    frequency: {type: 'object', fields:"title,resource:link"},
    accessRights: {type: 'object', translate:"/message.tooltip.datasetDetails.distributions.rights,accessRights", fields:"label::"},
    accrualPeriodicity: {type: 'object', translate:"frequency,accrualPeriodicity", fields:"label::"},
    creator: {type: 'object', fields:"name,email,homepage"},
    hasVersion: {type: 'links'},
    isVersionOf: {type: 'links', translate:"versionOf,isVersionOf"},
    temporal: {type: 'objects', translate:"/message.tooltip.datasetDetails.distributions.temporalResolution,temporal", fields: "gte:date:,lte:date:' -'", itemstyles:"float:left"},
    versionInfo: {type: 'string'},
    versionNotes: {type: 'translation'},
    attributes: {type: 'links', translate:",attributes"},
    dimensions: {type: 'links', translate:",dimensions"},
    numSeries: {type: 'number'},
    hasQualityAnnotations: {type: 'links', translate: ",qualityAnnotations"},
    statUnitMeasures: {type: 'links', translate: "unitsOfMeasurement"},
    isReferencedBy: {type: 'links'},
    qualifiedAttributions: {type: 'links', translate: "qualifiedAttribution"},
    wasGeneratedBy: {type: 'links'},
    qualifiedRelations: {type: 'objects', translate: "qualifiedRelation", fields: "relation:link,had_role:link:role"},
    sample: {type: 'links'},
    spatialResolutionInMeters: {
        type: 'first:number', translate: "spatialResolutionInMeters,spatialResolutionInMeters.label",
            transform: value => t('message.metadata.spatialResolutionInMeters.value', {number: value[0]})
    },
    type: {type: 'object', fields: "label,resource:link"},
    temporalResolution: {type: 'string'}
});

export const dcatDeSchema = () => ({
    politicalGeocodingLevelURI: {type: 'objects', fields:"label,resource:link"},
    politicalGeocodingURI: {type: 'objects', fields:"label,resource:link"},
    availability: {type: 'object', translate:"availabilityDE,availability", fields:"label,resource:link"},
    contributorID: {type: 'objects', fields:"label,resource:link"},
    geocodingDescriptionDe: {type: 'translation'},
    legalBasis: {type: 'translation'},
    qualityProcessURI: {type: 'uri'},
    typeDe: {type: 'string', translate:"type,type"},
    references: {type: 'uri'},
    contributor: {type: 'objects', fields:"name,type,homepage,email,resource"},
    originator: {type: 'objects', fields:"name,type,homepage,email,resource"},
    maintainer: {type: 'objects', fields:"name,type,homepage,email,resource"}
});
