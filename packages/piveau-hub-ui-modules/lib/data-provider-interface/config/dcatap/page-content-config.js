const config = {
  datasets: {
    Mandatory: {
      title: {},
      datasetID: {},
      description: {},
      catalog: {},
      publisher: {},
      theme: {},
      issued: {},
      modified: {},
    },
    Advised: {
      keyword: {},
      subject: {},
      contactPoint: {},
      landingPage: {},
      accrualPeriodicity: {},
      language: {},
      spatial: {},
      temporal: {},
      creator: {},
      identifier: {},
      admsIdentifier: {},
      page: {},
      accessRights: {},
    },
    Recommended: {
      type: {},
      isUsedBy: {},
      conformsTo: {},
      versionInfo: {},
      versionNotes: {},
      temporalResolution: {},
      spatialResolutionInMeters: {},
      relation: {},
      qualifiedRelation: {},
      isReferencedBy: {},
      hasVersion: {},
      isVersionOf: {},
      source: {},
      provenance: {},
      qualifiedAttribution: {},
      wasGeneratedBy: {},
    },
    distributions: {},
    // Overview: {
    //   overview: {}
    // }
  },
  distributions: {
    step1: {
      accessURL: {},
      title: {},
      description: {},
    },
    step2: {
      downloadUrl: {},
      format: {},
      mediaType: {},
      licence: {},
      status: {},
      availability: {},
      issued: {},
      modified: {},
    },
    step3: {
      type: {},
      byteSize: {},
      checksum: {},
      compressFormat: {},
      packageFormat: {},
      language: {},
      page: {},
      conformsTo: {},
      rights: {},
      hasPolicy: {},
      temporalResolution: {},
      spatialResolutionInMeters: {},
    },
    step4: {
      accessService: {},
    }
  },
  catalogues: {
    step1: {
      title: {},
      datasetID: {},
      description: {},
      publisher: {},
      language: {},
      homepage: {},
      licence: {},
    },
    step2: {
      spatial: {},
      hasPart: {},
      isPartOf: {},
      // rights: {},
      catalog: {},
      creator: {}, 
    }
  }
};

const newConfig = {
  datasets: {
    mandatory: [ 'title', 'datasetID', 'description', 'catalog', 'publisher', 'theme', 'issued', 'modified' ],
    advised: [ 'keyword', 'subject', 'contactPoint', 'landingPage', 'accrualPeriodicity', 'language', 'spatial', 'temporal', 'creator', 'identifier', 'admsIdentifier', 'page', 'accessRights' ],
    recommended: [ 'type', 'isUsedBy', 'conformsTo', 'versionInfo', 'versionNotes', 'temporalResolution', 'spatialResolutionInMeters', 'relation', 'qualifiedRelation', 'isReferencedBy', 'hasVersion', 'isVersionOf', 'source', 'provenance', 'qualifiedAttribution', 'wasGeneratedBy' ],
    overview: [ 'overview' ]
  },
  catalogues: {
    mandatory: [ 'title', 'datasetID', 'description', 'publisher', 'language', 'homepage', 'licence' ],
    advised: [ 'spatial', 'hasPart', 'isPartOf', 'rights', 'catalog', 'creator' ],
    overview: ['overview']
  }
}

export default config;
