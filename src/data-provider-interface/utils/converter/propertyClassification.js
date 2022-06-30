const additionalTypeProperties = [
  'dct:conformsTo',
  'foaf:page',
  'dct:rights',
  'dct:license',
  'dct:temporal',
  'dext:metadataExtension',
  'dct:provenance',
  'dcat:accessService',
  'spdx:checksum',
];

const additionalType = {
  'dct:conformsTo': 'dct:Standard',
  'foaf:page': 'foaf:Document',
  'dct:rights': 'dct:RightsStatement',
  'dct:license': 'dct:LicenseDocument',
  'dct:temporal': 'dct:PeriodOfTime',
  'dext:metadataExtension': 'dext:MetadataExtension',
  'dct:provenance': 'dct:ProvenanceStatement',
  'dcat:accessService': 'dcat:DataService',
  'spdx:checksum': 'spdx:Checksum',
};

const nestedProperties = {
  homepage: 'foaf:homepage',
  mbox: 'foaf:mbox',
  name: 'foaf:name',
  fn: 'vcard:fn',
  hasAddress: 'vcard:hasAddress',
  hasEmail: 'vcard:hasEmail',
  hasOrganizationName: 'vcard:hasOrganizationName',
  hasTelephone: 'vcard:hasTelephone',
  hasURL: 'vcard:hasURL',
  description: 'dct:description',
  format: 'dct:format',
  title: 'dct:title',
  label: 'rdfs:label',
  endDate: 'dcat:endDate',
  startDate: 'dcat:startDate',
  isUsedBy: 'dext:isUsedBy',
  country_name: 'vcard:country_name',
  locality: 'vcard:locality',
  postal_code: 'vcard:postal_code',
  street_address: 'vcard:street_address',
  endpointURL: 'dcat:endpointURL',
};

const multilingualGroupsNames = [
  'dct:title',
  'dct:description',
  'adms:versionNotes',
  'dcat:keyword',
];

const repeatableUriProperties = [
  'dct:source',
  'dcat:landingPage',
  'dct:relation',
  'dcat:qualifiedRelation',
  'prov:qualifiedAttribution',
  'dct:isReferencedBy',
  'prov:wasGeneratedBy',
  'dct:isVersionOf',
  'dct:hasVersion',
  'dct:hasPart',
  'dcat:downloadURL',
  'odrl:hasPolicy',
  'dcat:accessURL',
];

export {
  additionalTypeProperties,
  additionalType,
  nestedProperties,
  multilingualGroupsNames,
  repeatableUriProperties,
};
