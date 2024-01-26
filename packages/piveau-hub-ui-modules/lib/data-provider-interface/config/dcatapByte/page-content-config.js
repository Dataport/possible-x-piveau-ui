const config = {
  datasets: {
    step1: {
      startPage:{},
      taxonomy: {},
      datasetID: {},
      description: {},
      catalog: {},
      publisher: {},
      theme: {},
      issued: {},
      modified: {},
      buttonSet:{},
      startPageHelp:{},
    },
    step2: {
    startPage:{},
    byteCategory:{},
    buttonSet:{},
    startPageHelp:{},
    },
    step3: {
      startPage:{},
      contactPoint:{},
      buttonSet:{},
      startPageHelp:{},  
    }
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

export default config;
