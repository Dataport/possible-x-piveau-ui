export const dcatFields = `releaseDate,modificationDate,landingPages,sources,
    languages,publisher,contactPoints,catalogRecord,spatial,
    spatialResource,conformsTo,provenances,identifiers,otherIdentifiers,resource,
    frequency,accessRights,accrualPeriodicity,creator,hasVersion,isVersionOf,
    temporal,versionInfo,versionNotes,attributes,dimensions,numSeries,hasQualityAnnotations,
    statUnitMeasures,isReferencedBy,qualifiedAttributions,wasGeneratedBy,
    qualifiedRelations,sample,spatialResolutionInMeters,type,temporalResolution`;

export const dcatSchema = (t) => ({
    releaseDate: {type: 'date', translate: 'created'},
    modificationDate: {type: 'date', translate: 'updated'},
    landingPages: {type: 'links', translate: 'landingPage'},
    sources: {type: 'links'},
    languages: {type: 'links', translate: 'language,languages'},
    publisher: {type: 'object', fields: 'name,email,homepage'},
    contactPoints: {type: 'objects', fields: "name::/message.datasetDetails.contactPoints.organizationName,email,telephone,address,url::'URL'"},
    catalogRecord: {type: 'object', fields: "issued:date:addedToDataEuropaEU,modified:date:updatedOnDataEuropaEU,homepage"},
    spatial: {type: 'objects', fields: "coordinates,type"},
    spatialResource: {type: 'objects', fields: "resource:link"},
    conformsTo: {type: 'objects', fields: "title::label,label,resource:link_blank", track:"resource"},
    provenances: {type: 'objects', translate: 'provenance,provenances', fields: "label,resource:link"},
    // relatedResources: {type: 'links', translate: 'relatedResource,relatedResources'},
    identifiers: {type: 'links', translate: 'identifier,identifiers'},
    otherIdentifiers: {type: 'objects', translate: 'otherIdentifier,otherIdentifiers', fields:"identifier:link,resource:link:identifier,scheme:link"},
    resource: {type: 'uri', translate: "uriRef,'uriRef'"},
    frequency: {type: 'object', fields:"title,resource:link"},
    accessRights: {type: 'object', fields:"label::"},
    accrualPeriodicity: {type: 'object', translate:"frequency,accrualPeriodicity", fields:"label::"},
    creator: {type: 'object', fields:"name,email,homepage"},
    hasVersion: {type: 'links'},
    isVersionOf: {type: 'links'},
    temporal: {type: 'objects', fields: "gte:date:,lte:date:' -'", itemstyles:"float:left"},
    versionInfo: {type: 'string'},
    versionNotes: {type: 'translation'},
    attributes: {type: 'links'},
    dimensions: {type: 'links'},
    numSeries: {type: 'number'},
    hasQualityAnnotations: {type: 'links', translate: "qualityAnnotations"},
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

export const dcatDeFields = `politicalGeocodingLevelURI,politicalGeocodingURI,availability,
    contributorID,geocodingDescriptionDe,legalBasis,qualityProcessURI,typeDe,
    references,contributor,originator,maintainer`;

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
