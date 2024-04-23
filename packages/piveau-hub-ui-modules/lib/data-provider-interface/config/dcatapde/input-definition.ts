import { type FormKitSchemaDefinition } from '@formkit/core'

import language from '../selector-languages.json';
import config from './page-content-config';

/**
 * Available properties for datasets.
 */
export type DcatApDatasetsProperty =
  // Append new properties here for accurate type checking
  'datasetID'
  | 'overview'
  | 'politicalGeocodingLevelURI'
  | 'politicalGeocodingURI'
  | 'availabilityDE'
  | 'geocodingDescription'
  | 'legalBasis'
  | 'qualityProcessURI'
  | 'references'
  | 'contributor'
  | 'contributorID'
  | 'originator'
  | 'maintainer'
  | 'description'
  | 'title'
  | 'contactPoint'
  | 'subject'
  | 'keyword'
  | 'publisher'
  | 'spatial'
  | 'temporal'
  | 'theme'
  | 'accessRights'
  | 'creator'
  | 'conformsTo'
  | 'page'
  | 'accrualPeriodicity'
  | 'hasVersion'
  | 'isVersionOf'
  | 'source'
  | 'identifier'
  | 'isReferencedBy'
  | 'landingPage'
  | 'language'
  | 'admsIdentifier'
  | 'provenance'
  | 'qualifiedAttribution'
  | 'wasGeneratedBy'
  | 'qualifiedRelation'
  | 'relation'
  | 'issued'
  | 'modified'
  | 'spatialResolutionInMeters'
  | 'temporalResolution'
  | 'type'
  | 'versionInfo'
  | 'versionNotes'
  | 'catalog'
  | 'isUsedBy';

/**
 * Available properties for distributions.
 */
export type DcatApDistributionsProperty =
  // Append new properties here for accurate type checking
  'accessURL'
  | 'licenseAttributionByText'
  | 'availabilityDisDE'
  | 'availability'
  | 'description'
  | 'format'
  | 'title'
  | 'byteSize'
  | 'conformsTo'
  | 'issued'
  | 'modified'
  | 'rights'
  | 'spatialResolutionInMeters'
  | 'temporalResolution'
  | 'mediaType'
  | 'downloadUrl'
  | 'accessService'
  | 'checksum'
  | 'compressFormat'
  | 'packageFormat'
  | 'page'
  | 'language'
  | 'licence'
  | 'conformsTo'
  | 'issued'
  | 'modified'
  | 'rights'
  | 'spatialResolutionInMeters'
  | 'temporalResolution'
  | 'type'
  | 'hasPolicy'
  | 'status';

export type DcatApCataloguesProperty =
// Append new properties here for accurate type checking
'datasetID'
| 'availabilityCatDE'
| 'title'
| 'description'
| 'publisher'
| 'language'
| 'licence'
| 'spatial'
| 'homepage'
| 'hasPart'
| 'isPartOf'
| 'rights'
| 'catalog'
| 'creator';

export type InputDefinition = {
  datasets: Record<DcatApDatasetsProperty, FormKitSchemaDefinition>;
  distributions: Record<DcatApDistributionsProperty, FormKitSchemaDefinition>;
  catalogues: Record<DcatApCataloguesProperty, FormKitSchemaDefinition>;
}

const dcatapProperties: InputDefinition = {
  datasets: {
    overview: {
      $cmp: 'OverviewPage',
      props: {
        property: 'datasets'
      }
    },
    // Dcatap.de Properties #### Start ####
    politicalGeocodingLevelURI: {
      identifier: 'politicalGeocodingLevelURI',
      $formkit: 'auto',
      name: 'dcatde:politicalGeocodingLevelURI',
      class: 'property',
      voc: 'political-geocoding-level',
      multiple: true,
    },
    politicalGeocodingURI: {
      identifier: 'politicalGeocodingURI',
      $formkit: 'repeatable',
      name: 'dcatde:politicalGeocodingURI',
      children: [
        {
          $formkit: 'spatialinput',
          name: 'dcatde:politicalGeocodingURI',
          identifier: 'politicalGeocodingURI',
        }]
    },
    availabilityDE: {
      identifier: 'availabilityDE',
      $formkit: 'auto',
      name: 'dcatap:availability',
      class: 'property',
      voc: 'planned-availability',
    },
    geocodingDescription: {
      identifier: 'geocodingDescription',
      $formkit:'repeatable',
      name: 'dcatde:geocodingDescription',
      children: [
        {
          identifier: 'geocodingDescription',
          $formkit: 'group',
          name: 'dcatde:geocodingDescription',
          class: 'property langDescriptionInput',
          children: [
            {
              identifier: 'geocodingDescription',
              $formkit: 'textarea',
              name: '@value',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'language',
              value: 'de',
              $formkit: 'select',
              options: language,
              name: '@language',
              class: 'selectLangField',
            },
          ],
        }
      ]
    },
    legalBasis: {
      identifier: 'legalBasis',
      $formkit:'repeatable',
      name: 'dcatde:legalBasis',
      children: [
        {
          identifier: 'legalBasis',
          $formkit: 'group',
          name: 'dcatde:legalBasis',
          class: 'property langDescriptionInput',
          children: [
            {
              identifier: 'legalBasis',
              $formkit: 'textarea',
              name: '@value',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'language',
              value: 'de',
              $formkit: 'select',
              options: language,
              name: '@language',
              class: 'selectLangField',
            },
          ],
        }
      ]
    },
    qualityProcessURI: {
      identifier: 'qualityProcessURI',
      name: 'dcatde:qualityProcessURI',
      class: 'property',
      $formkit: 'url',
    },
    references: {
      identifier: 'references',
      name: 'dct:references',
      $formkit: 'repeatable',
      children: [
        {
          $formkit:'group',
          identifier: 'references',
          name: 'dct:references',
          class: 'property',
          children: [
            {
              name: '@id',
              identifier: 'referencesUrl',
              $formkit:'url',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    contributor: {
      identifier: 'contributor',
      $formkit: 'repeatable',
      name: 'dct:contributor',
      children: [
        {
          identifier: 'contributor',
          $formkit: 'group',
          name: 'dct:contributor',
          class: 'property',
          children: [
            {
              identifier: 'contributorType',
              $formkit: 'select',
              name: 'rdf:type',
              options: {
                '': '---',
                'vcard:Individual': 'Person',
                'vcard:Organization': 'Organization',
              },
            },
            {
              identifier: 'contributorEmail',
              $formkit: 'email',
              name: 'foaf:mbox',
              validation: 'optional|email',
            },
            {
              identifier: 'contributorName',
              $formkit: 'text',
              name: 'foaf:name',
            },
            {
              identifier: 'contributorHomepage',
              $formkit: 'url',
              name: 'foaf:homepage',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    contributorID: {
      identifier: 'contributorID',
      $formkit: 'auto',
      name: 'dcatde:contributorID',
      class: 'property',
      voc: 'contributors',
      multiple: true,
    },
    originator: {
      identifier: 'originator',
      $formkit: 'repeatable',
      name: 'dcatde:originator',
      children: [
        {
          identifier: 'originator',
          $formkit: 'group',
          name: 'dcatde:originator',
          class: 'property',
          children: [
            {
              identifier: 'originatorType',
              $formkit: 'select',
              name: 'rdf:type',
              options: {
                '': '---',
                'vcard:Individual': 'Person',
                'vcard:Organization': 'Organization',
              },
            },
            {
              identifier: 'originatorEmail',
              $formkit: 'email',
              name: 'foaf:mbox',
              validation: 'optional|email',
            },
            {
              identifier: 'originatorName',
              $formkit: 'text',
              name: 'foaf:name',
            },
            {
              identifier: 'originatorHomepage',
              $formkit: 'url',
              name: 'foaf:homepage',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    maintainer: {
      identifier: 'maintainer',
      $formkit: 'repeatable',
      name: 'dcatde:maintainer',
      children: [
        {
          identifier: 'maintainer',
          $formkit: 'group',
          name: 'dcatde:maintainer',
          class: 'property',
          children: [
            {
              identifier: 'maintainerType',
              $formkit: 'select',
              name: 'rdf:type',
              options: {
                '': '---',
                'vcard:Individual': 'Person',
                'vcard:Organization': 'Organization',
              },
            },
            {
              identifier: 'maintainerEmail',
              $formkit: 'email',
              name: 'foaf:mbox',
              validation: 'optional|email',
            },
            {
              identifier: 'maintainerName',
              $formkit: 'text',
              name: 'foaf:name',
            },
            {
              identifier: 'maintainerHomepage',
              $formkit: 'url',
              name: 'foaf:homepage',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    // Dcatap.de Properties #### End ####
    datasetID: {
      identifier: 'datasetID',
      $formkit:'id',
      name: 'datasetID',
      class: 'property mandatory',
    },
    description: {
      identifier: 'description',
      $formkit: 'repeatable',
      name: 'dct:description',
      minimum: 1,
      children: [
        {
          identifier: 'datasetDescription',
          $formkit:'group',
          name: 'dct:description',
          class: 'property langDescriptionInput mandatory',
          children: [
            {
              identifier: 'description',
              $formkit:'textarea',
              name: '@value',
              validation: 'required',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'descriptionLanguage',
              value: 'en',
              $formkit:'select',
              options: language,
              validation: 'required',
              name: '@language',
              class: 'selectLangField',
            },
          ],
        }
      ]
    },
    title: {
      identifier: 'title',
      $formkit: 'repeatable',
      name: 'dct:title',
      children:[
        {
          identifier: 'title',
          $formkit: 'group',
          name: 'dct:title',
          class: 'property langStringInput mandatory',
          mandatory: true,
          minimum: 1,
          children: [
            {
              identifier: 'titleLabel',
              $formkit: 'text',
              name: '@value',
              validation: 'required',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'dctTitle',
              value: 'en',
              $formkit: 'select',
              validation: 'required',
              options: language,
              name: '@language',
              class: 'selectLangField',
            },
          ],
        }
      ]
    },
    contactPoint: {
      identifier: 'contactPoint',
      $formkit: 'repeatable',
      name: 'dcat:contactPoint',
      children: [
        {
          identifier: 'contactPoint',
          $formkit:'group',
          name: 'dcat:contactPoint',
          class: 'property',
          children: [
            {
              identifier: 'contactPointType',
              $formkit:'select',
              name: 'rdf:type',
              options: {
                '': '---',
                'vcard:Individual': 'Person',
                'vcard:Organization': 'Organization',
              },
            },
            {
              identifier: 'contactPointName',
              $formkit:'text',
              name: 'vcard:fn',
            },
            {
              identifier: 'contactPointEmail',
              $formkit:'email',
              name: 'vcard:hasEmail',
              validation: 'optional|email',
            },
            {
              identifier: 'contactPointAddress',
              $formkit:'group',
              name: 'vcard:hasAddress',
              children: [
                {
                  identifier: 'contactPointAddressStreet',
                  $formkit:'text',
                  name: 'vcard:street_address',
                },
                {
                  identifier: 'contactPointAddressPostcode',
                  $formkit:'text',
                  name: 'vcard:postal_code',
                },
                {
                  identifier: 'contactPointAddressCity',
                  $formkit:'text',
                  name: 'vcard:locality',
                },
                {
                  identifier: 'contactPointAddressCountry',
                  $formkit:'text',
                  name: 'vcard:country_name',
                },
              ],
            },
            {
              identifier: 'contactPointTelephone',
              $formkit:'tel',
              name: 'vcard:hasTelephone',
            },
            {
              identifier: 'contactPointUrl',
              $formkit:'url',
              name: 'vcard:hasURL',
              validation: 'optional|url',
            },
            {
              identifier: 'contactPointOrganisationName',
              $formkit:'text',
              name: 'vcard:hasOrganizationName',
            },
          ],
        }
      ]
    },
    subject: {
      identifier: 'subject',
      $formkit: 'auto',
      name: 'dct:subject',
      multiple: true,
      annifTheme: true,
      class: 'property',
      voc: 'eurovoc',
      '@annifSuggestion': false,
    },
    keyword: {
      identifier: 'keyword',
      $formkit: 'repeatable',
      name: 'dcat:keyword',
      children: [
        {
          identifier: 'keywordHeader',
          $formkit:'group',
          name: 'dcat:keyword',
          class: 'property langStringInput',
          children: [
            {
              identifier: 'keyword',
              $formkit:'text',
              name: '@value',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'keywordsLanguage',
              value: 'en',
              $formkit:'select',
              name: '@language',
              class: 'selectLangField',
              options: language,
            },
          ],
        }
      ]
    },
    publisher: {
      $formkit: 'group',
      name: 'dct:publisher',
      children: [
        {
          $formkit: 'select',
          identifier: 'publisher',
          name: 'publisherMode',
          id: 'publisherModeDataset',
          options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(publisherModeDataset).value',
          if: '$get(publisherModeDataset).value === "voc"',
          children: [
            {
              $formkit: 'auto',
              identifier: 'licenceVocabulary',
              name: '@id',
              voc: 'corporate-body',
              property: 'dct:license',
            }
          ]
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(publisherModeDataset).value',
          if: '$get(publisherModeDataset).value === "man"',
          children: [
            {
              $formkit: 'text',
              identifier: 'publisherName',
              name: 'foaf:name',
            },
            {
              $formkit: 'email',
              identifier: 'publisherEmail',
              name: 'foaf:mbox',
            },
            {
              $formkit: 'url',
              identifier: 'publisherHomepage',
              name: 'foaf:homepage',
            },
          ]
        }
      ]
    },
    spatial: {
      identifier: 'spatial',
      $formkit: 'repeatable',
      name: 'dct:spatial',
      children: [
        {
          $formkit: 'spatialinput',
          name: 'dct:spatial',
          identifier: 'spatial',
        }]
    },
    temporal: {
      identifier: 'temporal',
      $formkit: 'repeatable',
      name: 'dct:temporal',
      children: [
        {
          $formkit:'group',
          name: 'dct:temporal',
          identifier: 'temporal',
          class: 'property besides startEndDate',
          children: [
            {
              identifier: 'temporalStart',
              $formkit:'datetime-local',
              name: 'dcat:startDate',
              end: 'dct:temporal',
            },
            {
              identifier: 'temporalEnd',
              $formkit:'datetime-local',
              name: 'dcat:endDate',
              start: 'dct:temporal',
            },
          ],
        }
      ]
    },
    theme: {
      identifier: 'theme',
      $formkit: 'auto',
      multiple: true,
      annifTheme: true,
      voc: 'data-theme',
      name: 'dcat:theme',
      class: 'property',
      '@annifSuggestion': false,
    },
    accessRights: {
      identifier: 'accessRights',
      $formkit: 'auto',
      voc: 'access-right',
      name: 'dct:accessRights',
      class: 'property',
    },
    creator: {
      identifier: 'creator',
      $formkit:'group',
      name: 'dct:creator',
      class: 'property',
      children: [
        {
          identifier: 'creatorType',
          $formkit:'select',
          name: 'rdf:type',
          options: {
            '': '---',
            'foaf:Person': 'Person',
            'foaf:Organization': 'Organization',
          },
        },
        {
          identifier: 'creatorName',
          $formkit:'text',
          name: 'foaf:name',
        },
        {
          identifier: 'creatorEmail',
          $formkit:'email',
          name: 'foaf:mbox',
          validation: 'optional|email',
        },
        {
          identifier: 'creatorHomepage',
          $formkit:'url',
          name: 'foaf:homepage',
          validation: 'optional|url',
        },
      ],
    },
    conformsTo: {
      identifier: 'conformsTo',
      $formkit: 'repeatable',
      name: 'dct:conformsTo',
      children: [
        {
          identifier: 'conformsTo',
          $formkit:'group',
          name: 'dct:conformsTo',
          class: 'property',
          children: [
            {
              identifier: 'conformsToTitle',
              $formkit:'text',
              name: 'rdfs:label',
            },
            {
              identifier: 'conformsToUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    page: {
      identifier: 'page',
      $formkit: 'repeatable',
      name: 'foaf:page',
      children: [
        {
          identifier: 'page',
          $formkit:'group',
          name: 'foaf:page',
          class: 'property',
          children: [
            {
              identifier: 'pageTitle',
              $formkit: 'repeatable',
              name: 'dct:title',
              children: [
                {
                  identifier: 'pageTitle',
                  $formkit:'group',
                  name: 'dct:title',
                  class: 'property langStringInput',
                  children: [
                    {
                      identifier: 'pageTitleSub',
                      $formkit:'text',
                      name: '@value',
                      class: 'w-100 inputTextfield',
                    },
                    {
                      identifier: 'pageTitlelang',
                      value: 'en',
                      $formkit:'select',
                      options: language,
                      name: '@language',
                      class: 'selectLangField',
                    },
                  ]
                }
              ]
            },
            {
              identifier: 'pageDescription',
              $formkit: 'repeatable',
              name: 'dct:description',
              children: [
                {
                  identifier: 'pageDescription',
                  $formkit:'group',
                  name: 'dct:description',
                  class: 'property langDescriptionInput',
                  children: [
                    {
                      identifier: 'pageDesc',
                      $formkit:'textarea',
                      name: '@value',
                      class: 'inputTextfield w-100',
                    },
                    {
                      identifier: 'page-desc',
                      value: 'en',
                      $formkit:'select',
                      options: language,
                      name: '@language',
                      class: 'selectLangField',
                    },
                  ]
                }
              ]
            },
            {
              identifier: 'pageFormat',
              $formkit: 'auto',
              voc: 'file-type',
              name: 'dct:format',
              class: "property",
            },
            {
              identifier: 'pageUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
              class: "property",
            },
          ],
        }
      ]
    },
    accrualPeriodicity: {
      identifier: 'accrualPeriodicity',
      $formkit: 'auto',
      voc: 'frequency',
      name: 'dct:accrualPeriodicity',
      class: 'property',
    },
    hasVersion: {
      identifier: 'hasVersion',
      $formkit: 'repeatable',
      name: 'dct:hasVersion',
      children: [
        {
          $formkit:'group',
          identifier: 'hasVersion',
          name: 'dct:hasVersion',
          class: 'property',
          children: [
            {
              identifier: 'hasVersionUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    isVersionOf: {
      identifier: 'isVersionOf',
      $formkit: 'repeatable',
      name: 'dct:isVersionOf',
      children: [
        {
          $formkit:'group',
          identifier: 'isVersionOf',
          name: 'dct:isVersionOf',
          class: 'property',
          children: [
            {
              identifier: 'isVersionOfUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    source: {
      identifier: 'source',
      $formkit: 'repeatable',
      name: 'dct:source',
      children: [
        {
          $formkit:'group',
          identifier: 'source',
          name: 'dct:source',
          class: 'property',
          children: [
            {
              name: '@id',
              identifier: 'sourceUrl',
              $formkit:'url',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    identifier: {
      identifier: 'identifier',
      $formkit: 'repeatable',
      name: 'dct:identifier',
      children: [
        {
          $formkit:'group',
          class: 'property',
          name: 'dct:identifier',
          identifier: 'identifier',
          children: [
            {
              identifier: 'identifier',
              name: '@value',
              $formkit:'text',
            },
          ],
        }
      ]
    },
    isReferencedBy: {
      identifier: 'isReferencedBy',
      $formkit: 'repeatable',
      name: 'dct:isReferencedBy',
      children: [
        {
          $formkit:'group',
          identifier: 'isReferencedBy',
          name: 'dct:isReferencedBy',
          class: 'property',
          children: [
            {
              identifier: 'isReferencedByUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    landingPage: {
      identifier: 'landingPage',
      $formkit: 'repeatable',
      name: 'dcat:landingPage',
      children: [
        {
          $formkit:'group',
          identifier: 'landingPage',
          name: 'dcat:landingPage',
          class: 'property',
          children: [
            {
              identifier: 'landingPageUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    language: {
      identifier: 'language',
      $formkit: 'auto',
      name: 'dct:language',
      class: 'property',
      multiple: true,
      voc: 'language',
    },
    admsIdentifier: {
      identifier: 'admsIdentifier',
      $formkit: 'repeatable',
      name: 'adms:identifier',
      children: [
        {
          $formkit: 'group',
          name: 'adms:identifier',
          identifier: 'admsIdentifier',
          children: [
            {
              identifier: 'admsIdentifierUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes: {
                outer: 'w97-textfield'
              },
            },
            {
              identifier: 'admsIdentifierSkosNotation',
              $formkit: 'group',
              name: 'skos:notation',
              children: [
                {
                  identifier: 'admsIdentifierValue',
                  $formkit: 'text',
                  name: '@value',
                  classes: {
                    outer: 'w97-textfield'
                  },
                },
                {
                  // todo: check if this is correct
                  $formkit: 'auto',
                  identifier: 'admsIdentifierType',
                  voc: 'notation-type',
                  name: '@type',
                  id: 'admsIdentifierType',
                  classes: {
                    outer: 'w97-textfield'
                  },
                },
              ],
            },
          ],
        }
      ]
    },
    provenance: {
      identifier: 'provenanceGroup',
      $formkit: 'repeatable',
      name: 'dct:provenance',
      children: [
        {
          $formkit:'group',
          identifier: 'provenanceGroup',
          name: 'dct:provenance',
          class: 'property',
          children: [
            {
              identifier: 'provenance',
              $formkit:'text',
              name: 'rdfs:label',
            },
          ],
        }
      ]
    },
    qualifiedAttribution: {
      identifier: 'qualifiedAttribution',
      $formkit: 'repeatable',
      name: 'prov:qualifiedAttribution',
      children: [
        {
          $formkit:'group',
          identifier: 'qualifiedAttribution',
          name: 'prov:qualifiedAttribution',
          class: 'property',
          children: [
            {
              identifier: 'qualifiedAttributionUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    wasGeneratedBy: {
      identifier: 'wasGeneratedBy',
      $formkit: 'repeatable',
      name: 'prov:wasGeneratedBy',
      children: [
        {
          $formkit:'group',
          identifier: 'wasGeneratedBy',
          name: 'prov:wasGeneratedBy',
          class: 'property',
          children: [
            {
              identifier: 'wasGeneratedByUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    qualifiedRelation: {
      identifier: 'qualifiedRelation',
      $formkit: 'repeatable',
      name: 'dcat:qualifiedRelation',
      children: [
        {
          $formkit:'group',
          identifier: 'qualifiedRelation',
          name: 'dcat:qualifiedRelation',
          class: 'property',
          children: [
            {
              identifier: 'qualifiedRelationUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    relation: {
      identifier: 'relation',
      $formkit: 'repeatable',
      name: 'dct:relation',
      children: [
        {
          $formkit:'group',
          identifier: 'relation',
          name: 'dct:relation',
          class: 'property',
          children: [
            {
              identifier: 'relationUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    issued: {
      identifier: 'issued',
      $formkit: 'group',
      name: 'dct:issued',
      children: [
        {
          identifier: 'issued',
          id: 'issuedCondDataset',
          $formkit: 'select',
          name: '@type',
          options: {date: 'Date', datetime: 'Datetime'},
        },
        {
          identifier: 'issued',
          $cmp: 'FormKit',
          if: '$get(issuedCondDataset).value',
          props: {
            if: '$get(issuedCondDataset).value === date',
            then: {
              type: 'date',
              name: '@value',
            },
            else: {
              type: 'datetime-local',
              name: '@value',
            }
          }
        },
      ]
    },
    modified: {
      identifier: 'modified',
      $formkit: 'group',
      name: 'dct:modified',
      children: [
        {
          identifier: 'modified',
          id: 'modifiedCondDataset',
          name: '@type',
          $formkit: 'select',
          options: {date: 'Date', datetime: 'Datetime'},
        },
        {
          identifier: 'modified',
          $cmp: 'FormKit',
          if: '$get(modifiedCondDataset).value',
          props: {
            name: 'dct:modified',
            if: '$get(modifiedCondDataset).value === date',
            then: {
              type: 'date',
              name: '@value',
            },
            else: {
              type: 'datetime-local',
              name: '@value'
            }
          }
        },
      ]
    },
    spatialResolutionInMeters: {
      identifier: 'spatialResolutionInMeters',
      $formkit:'number',
      name: 'dcat:spatialResolutionInMeters',
      class: 'property',
      validation: 'number',
    },
    temporalResolution: {
      identifier: 'temporalResolution',
      $formkit:'group',
      name: 'dcat:temporalResolution',
      class: 'property tempResWrapper',
      children: [
        {
          identifier: 'temporalResolutionYear',
          $formkit:'number',
          validation: 'min:1950|max:2100|optional',
          "validation-behavior": 'live',
          name: 'Year',
        },
        {
          identifier: 'temporalResolutionMonth',
          $formkit:'number',
          validation: 'min:1|max:12|optional',
          "validation-behavior": 'live',       
          name: 'Month',
        },
        {
          identifier: 'temporalResolutionDay',
          $formkit:'number',
          validation: 'min:1|max:31|optional',
          "validation-behavior": 'live',
          name: 'Day',
        },
        {
          identifier: 'temporalResolutionHour',
          $formkit:'number',
          validation: 'min:0|max:23|optional',
          "validation-behavior": 'live',
          name: 'Hour',
        },
        {
          identifier: 'temporalResolutionMinute',
          $formkit:'number',
          validation: 'min:0|max:59|optional',
          "validation-behavior": 'live',
          name: 'Minute',
        },
        {
          identifier: 'temporalResolutionSecond',
          $formkit:'number',
          validation: 'min:0|max:59|optional',
          "validation-behavior": 'live',
          name: 'Second',
        },
      ],
    },
    type: {
      identifier: 'type',
      $formkit: 'auto',
      voc: 'dataset-type',
      name: 'dct:type',
      class: 'property',
    },
    versionInfo: {
      identifier: 'versionInfo',
      $formkit:'text',
      name: 'owl:versionInfo',
      class: 'property',
    },
    versionNotes: {
      identifier: 'versionNotes',
      $formkit: 'repeatable',
      name: 'adms:versionNotes',
      children: [
        {
          identifier: 'versionNotes',
          $formkit:'group',
          name: 'adms:versionNotes',
          class: 'property langDescriptionInput',
          children: [
            {
              identifier: 'versionNotes',
              $formkit:'textarea',
              name: '@value',
              class: 'inputTextfield w-100',
            },
            {
              identifier: 'language',
              value: 'en',
              $formkit:'select',
              name: '@language',
              options: language,
              class: 'selectLangField',
            },
          ],
        }
      ]
    },
    catalog: {
      identifier: 'catalog',
      $formkit:'select',
      name: 'dcat:catalog',
      class: 'property mandatory',
      validation: 'required',
      options: {},
    },
    isUsedBy: {
      identifier: 'isUsedBy',
      $formkit: 'repeatable',
      name: 'dext:metadataExtension',
      children: [
        {
          $formkit:'group',
          identifier: 'isUsedBy',
          name: 'dext:metadataExtension',
          class: 'property',
          children: [
            {
              $formkit:'url',
              identifier: 'isUsedBy',
              validation: 'optional|url',
              name: 'dext:isUsedBy',
            },
          ],
        }
      ]
    },
  },
  distributions: {
    licenseAttributionByText: {
      identifier: 'licenseAttributionByText',
      name: 'dcatde:licenseAttributionByText',
      $formkit: 'repeatable',
      children: [
        {
          identifier: 'licenseAttributionByText',
          $formkit: 'group',
          name: 'dcatde:licenseAttributionByText',
          class: 'property langStringInput',
          children: [
            {
              identifier: 'licenseAttributionByTextTitle',
              $formkit: 'textarea',
              name: '@value',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'language',
              value: 'de',
              $formkit: 'select',
              options: language,
              name: '@language',
              class: 'selectLangField',
            },
          ],
        }
      ]
    },
    accessURL: {
      identifier: 'accessUrl',
      $formkit: 'repeatable',
      name: 'dcat:accessURL',
      children: [
        {
          identifier: 'accessUrl',
          name: 'dcat:accessURL',
          $formkit: 'fileupload',

        }
      ]
    },
    availability: {
      identifier: 'availability',
      $formkit: 'auto',
      voc: 'planned-availability',
      name: 'dcatap:availability',
      class: 'property',
    },
    description: {
      identifier: 'datasetDescription',
      $formkit:'repeatable',
      name: 'dct:description',
      class: 'property langDescriptionInput mandatory',
      minimum: 1,
      children: [
        {
          identifier: 'datasetDescription',
          name: 'dct:description',
          $formkit: 'group',
          children: [
            {
              identifier: 'description',
              $formkit:'textarea',
              name: '@value',
              validation: 'required',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'descriptionLanguage',
              value: 'en',
              $formkit:'select',
              options: language,
              validation: 'required',
              name: '@language',
              class: 'selectLangField',
            },
          ]
        }
      ],
    },
    format: {
      identifier: 'format',
      $formkit: 'auto',
      class: 'property',
      voc: 'file-type',
      name: 'dct:format',
    },
    licence: {
      identifier: 'licence',
      $formkit: 'auto',
      name: 'dct:license',
      voc: 'licenses',
      property: 'dct:license'
    },
    title: {
      identifier: 'title',
      $formkit: 'repeatable',
      name: 'dct:title',
      class: 'property langStringInput mandatory',
      minimum: 1,
      children: [
        {
          identifier: 'title',
          name: 'dct:title',
          $formkit: 'group',
          children: [
            {
              identifier: 'titleLabel',
              $formkit: 'text',
              name: '@value',
              validation: 'required',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'dctTitle',
              value: 'en',
              $formkit: 'select',
              validation: 'required',
              options: language,
              name: '@language',
              class: 'selectLangField',
            },
          ]
        }
      ],
    },
    mediaType: {
      identifier: 'mediaType',
      $formkit: 'auto',
      voc: 'iana-media-types',
      name: 'dcat:mediaType',
      class: 'property',
    },
    downloadUrl: {
      identifier: 'downloadUrl',
      $formkit: 'repeatable',
      name: 'dcat:downloadURL',
      children: [
        {
          $formkit: 'group',
          identifier: 'downloadUrl',
          name: 'dcat:downloadURL',
          children: [
            {
              identifier: 'downloadUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes: {
                outer: 'w100-textfield'
              },
            },
          ],
        }
      ]
    },
    availabilityDisDE: {
      identifier: 'availabilityDisDE',
      $formkit: 'auto',
      name: 'dcatap:availability',
      class: 'property',
      voc: 'planned-availability',
    },
    accessService: {
      identifier: 'accessService',
      $formkit:'repeatable',
      name: 'dcat:accessService',
      class: 'property',
      children: [
        {
          identifier: 'accessService',
          $formkit:'group',
          name: 'dcat:accessService',
          children: [
            {
              identifier: 'accessServiceEndpointURL',
              $formkit:'url',
              name: 'dcat:endpointURL',
              class: 'property ',
              validation: 'optional|url',
            },
            {
              identifier: 'accessServiceTitle',
              $formkit:'repeatable',
              name: 'dct:title',
              class: 'property langStringInput',
              children: [
                {
                  identifier: 'accessServiceTitle',
                  $formkit:'group',
                  name: 'dct:title',
                  children: [
                    {
                      identifier: 'title',
                      $formkit:'text',
                      name: '@value',
                      class: 'w-100 inputTextfield',
                    },
                    {
                      identifier: 'language',
                      value: 'en',
                      $formkit:'select',
                      name: '@language',
                      class: 'selectLangField',
                      options: language,
                    },
                  ]
                }
              ],
            },
            {
              identifier: 'accessServiceDescription',
              $formkit:'repeatable',
              name: 'dct:description',
              class: 'property langDescriptionInput',
              children: [
                {
                  identifier: 'accessServiceDescription',
                  $formkit:'group',
                  name: 'dct:description',
                  children: [
                    {
                      identifier: 'description',
                      $formkit:'textarea',
                      name: '@value',
                      class: 'inputTextfield',
                    },
                    {
                      identifier: 'descriptionLanguage',
                      value: 'en',
                      $formkit:'select',
                      name: '@language',
                      class: 'selectLangField',
                      options: language,
                    },
                  ]
                }
              ],
            },
          ]
        }
      ],
    },
    byteSize: {
      identifier: 'byteSize',
      $formkit:'text',
      name: 'dcat:byteSize',
      class: 'property',
    },
    checksum: {
      $formkit:'group',
      identifier: 'checksum',
      name: 'spdx:checksum',
      class: 'property',
      children: [
        {
          identifier: 'checksum',
          $formkit:'text',
          name: 'spdx:checksumValue',
        },
        {
          identifier: 'checksumAlgorithm',
          $formkit: 'auto',
          voc: 'spdx-checksum-algorithm',
          name: 'spdx:algorithm',
        },
      ],
    },
    compressFormat: {
      identifier: 'compressFormat',
      $formkit: 'auto',
      voc: 'iana-media-types',
      name: 'dcat:compressFormat',
      class: 'property',
    },
    packageFormat: {
      identifier: 'packageFormat',
      $formkit: 'auto',
      voc: 'iana-media-types',
      name: 'dcat:packageFormat',
      class: 'property',
    },
    page: {
      identifier: 'page',
      $formkit:'repeatable',
      name: 'foaf:page',
      class: 'property',
      children: [
        {
          identifier: 'page',
          name: 'foaf:page',
          $formkit: 'group',
          children: [
            {
              identifier: 'pageTitle',
              $formkit:'repeatable',
              name: 'dct:title',
              class: 'property langStringInput',
              children: [
                {
                  identifier: 'pageTitle',
                  name: 'dct:title',
                  $formkit: 'group',
                  children: [
                    {
                      identifier: 'pageTitleSub',
                      $formkit:'text',
                      name: '@value',
                      class: 'w-100 inputTextfield',
                    },
                    {
                      identifier: 'pageTitlelang',
                      value: 'en',
                      $formkit:'select',
                      options: language,
                      name: '@language',
                      class: 'selectLangField',
                    },
                  ]
                }
              ]
            },
            {
              identifier: 'pageDescription',
              $formkit:'repeatable',
              name: 'dct:description',
              class: 'property langDescriptionInput',
              children: [
                {
                  identifier: 'pageDescription',
                  name: 'dct:description',
                  $formkit: 'group',
                  children: [
                    {
                      identifier: 'pageDesc',
                      $formkit:'textarea',
                      name: '@value',
                      class: 'inputTextfield w-100',
                    },
                    {
                      identifier: 'page-desc',
                      value: 'en',
                      $formkit:'select',
                      options: language,
                      name: '@language',
                      class: 'selectLangField',
                    },
                  ]
                }
              ]
            },
            {
              identifier: 'pageFormat',
              $formkit: 'auto',
              voc: 'file-type',
              name: 'dct:format',
              class: "property",
            },
            {
              identifier: 'pageUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
              class: "property",
            },
          ]
        }
      ],
    },
    language: {
      identifier: 'language',
      $formkit: 'auto',
      multiple: true,
      name: 'dct:language',
      voc: 'language',
      class: 'property',
    },
    conformsTo: {
      identifier: 'conformsTo',
      $formkit:'repeatable',
      name: 'dct:conformsTo',
      class: 'property',
      children: [
        {
          identifier: 'conformsTo',
          name: 'dct:conformsTo',
          $formkit: 'group',
          children: [
            {
              identifier: 'conformsToTitle',
              $formkit:'text',
              name: 'rdfs:label',
            },
            {
              identifier: 'conformsToUrl',
              $formkit:'url',
              name: '@id',
              validation: 'optional|url',
            },
          ]
        }
      ],
    },
    issued: {
      identifier: 'issued',
      $formkit: 'formkitGroup',
      name: 'dct:issued',

      children: [
        {
          identifier: 'issued',
          $cmp: 'FormKit',

          props: {

            type: 'datetime-local',
            name: '@value',
            validation: 'optional|date_after:' + new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),
            'validation-visibility': 'live',
            classes: {
              outer: 'w-100'
            },

          }
        },
      ]
    },
    modified: {
      identifier: 'modified',
      $formkit: 'formkitGroup',
      name: 'dct:modified',
      children: [

        {
          identifier: 'modified',
          $cmp: 'FormKit',
          props: {
            type: 'datetime-local',
            name: '@value',
            classes: {
              outer: 'w-100'
            },
            validation: 'optional|date_after:' + new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),

          }
        }
      ]
    },
    rights: {
      identifier: 'rights',
      $formkit: 'group',
      name: 'dct:rights',
      children: [
        {
          identifier: 'rights',
          id: 'rightsCondDataset',
          $formkit: 'select',
          name: '@type',
          options: {url: 'Provide URL', text: 'Provide a text'},
        },
        {
          identifier: 'rights',
          $cmp: 'FormKit',
          if: '$get(rightsCondDataset).value',
          props: {
            if: '$get(rightsCondDataset).value === url',
            then: {
              type: 'url',
              name: 'rdfs:value',
            },
            else: {
              type: 'text',
              name: 'rdfs:value',
            }
          }
        },
      ]
    },
    spatialResolutionInMeters: {
      identifier: 'spatialResolutionInMeters',
      $formkit:'number',
      name: 'dcat:spatialResolutionInMeters',
      class: 'property',
      validation: 'number',
    },
    temporalResolution: {
      identifier: 'temporalResolution',
      $formkit:'group',
      name: 'dcat:temporalResolution',
      class: 'property tempResWrapper',
      children: [
        {
          identifier: 'temporalResolutionYear',
          $formkit:'number',
          min: 0,
          max: 2023,
          name: 'Year',
        },
        {
          identifier: 'temporalResolutionMonth',
          $formkit:'number',
          min: 0,
          max: 12,
          name: 'Month',
        },
        {
          identifier: 'temporalResolutionDay',
          $formkit:'number',
          min: 0,
          max: 31,
          name: 'Day',
        },
        {
          identifier: 'temporalResolutionHour',
          $formkit:'number',
          min: 0,
          max: 23,
          name: 'Hour',
        },
        {
          identifier: 'temporalResolutionMinute',
          $formkit:'number',
          min: 0,
          max: 59,
          name: 'Minute',
        },
        {
          identifier: 'temporalResolutionSecond',
          $formkit:'number',
          min: 0,
          max: 59,
          name: 'Second',
        },
      ],
    },
    type: {
      identifier: 'type',
      $formkit: 'auto',
      voc: 'distribution-type',
      name: 'dct:type',
      class: 'property',
    },
    status: {
      identifier: 'status',
      $formkit: 'auto',
      voc: 'dataset-status',
      name: 'adms:status',
      class: 'property',
    },
    hasPolicy: {
      identifier: 'hasPolicy',
      $formkit: 'repeatable',
      name: 'odrl:hasPolicy',
      children: [
        {
          identifier: 'hasPolicy',
          $formkit: 'group',
          name: 'odrl:hasPolicy',
          children: [
            {
              identifier: 'hasPolicyUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes: {
                outer: 'w100-textfield'
              },
            },
          ],
        }
      ]
    },
  },
  catalogues: {
    availabilityCatDE: {
      identifier: 'availabilityCatDE',
      $formkit: 'auto',
      name: 'dcatap:availability',
      class: 'property',
      voc: 'planned-availability',
    },
    datasetID: {
      identifier: 'datasetID',
      $formkit:'id',
      name: 'datasetID',
      class: 'property',
      mandatory: true,
    },
    title: {
      identifier: 'title',
      $formkit: 'repeatable',
      name: 'dct:title',
      class: 'property langStringInput mandatory',
      minimum: 1,
      children: [
        {
          identifier: '',
          $formkit: 'group',
          name: 'dct:title',
          children: [
            {
              identifier: 'titleLabel',
              $formkit: 'text',
              name: '@value',
              validation: 'required',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'dctTitle',
              value: 'en',
              $formkit: 'select',
              validation: 'required',
              options: language,
              name: '@language',
              class: 'selectLangField',
            },
          ]
        }
      ],
    },
    description: {
      identifier: 'datasetDescription',
      $formkit:'repeatable',
      name: 'dct:description',
      class: 'property langDescriptionInput mandatory',
      minimum: 1,
      children: [
        {
          identifier: '',
          $formkit: 'group',
          name: '',
          children: [
            {
              identifier: 'description',
              $formkit:'textarea',
              name: '@value',
              validation: 'required',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'descriptionLanguage',
              value: 'en',
              $formkit:'select',
              options: language,
              validation: 'required',
              name: '@language',
              class: 'selectLangField',
            },
          ]
        }
      ],
    },
    publisher: {
      $formkit: 'group',
      name: 'dct:publisher',
      children: [
        {
          $formkit: 'select',
          identifier: 'publisher',
          name: 'publisherMode',
          id: 'publishereModeCatalogue',
          options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(publishereModeCatalogue).value',
          if: '$get(publishereModeCatalogue).value === "voc"',
          children: [
            {
              $formkit: 'auto',
              identifier: 'licenceVocabulary',
              name: '@id',
              voc: 'corporate-body',
              property: 'dct:license',
            }
          ]
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(publishereModeCatalogue).value',
          if: '$get(publishereModeCatalogue).value === "man"',
          children: [
            {
              $formkit: 'text',
              identifier: 'publisherName',
              name: 'foaf:name',
            },
            {
              $formkit: 'email',
              identifier: 'publisherEmail',
              name: 'foaf:mbox',
            },
            {
              $formkit: 'url',
              identifier: 'publisherHomepage',
              name: 'foaf:homepage',
            },
          ]
        }
      ]
    },
    language: {
      identifier: 'language',
      $formkit: 'auto',
      multiple: true,
      name: 'dct:language',
      voc: 'language',
      class: 'property',
    },
    licence: {
      $formkit: 'group',
      name: 'dct:license',
      children: [
        {
          $formkit: 'select',
          identifier: 'licence',
          name: 'licenceMode',
          id: 'licenceModeCatalogue',
          options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(licenceModeCatalogue).value',
          if: '$get(licenceModeCatalogue).value === "voc"',
          children: [
            {
              $formkit: 'auto',
              identifier: 'licenceVocabulary',
              name: '@id',
              voc: 'licence',
              property: 'dct:license',
            }
          ]
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(licenceModeCatalogue).value',
          if: '$get(licenceModeCatalogue).value === "man"',
          children: [
            {
              $formkit: 'text',
              identifier: 'licenceTitle',
              name: 'dct:title',
            },
            {
              $formkit: 'textarea',
              identifier: 'licenceDescription',
              name: 'skos:prefLabel',
            },
            {
              $formkit: 'url',
              identifier: 'licenceURL',
              name: 'skos:exactMatch',
              validation: 'optional|url',
            },
          ]
        }
      ]
    },    
    spatial: {
      $formkit:'repeatable',
      name: 'dct:spatial',
      identifier: 'spatial',
      children: [
        {
          $formkit: "select",
          identifier: "spatial",
          id: "spatialModeCatalogue",
          name: "spatialMode",
          options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
        },
        {
          $cmp: "FormKit",
          identifier: "spatial",
          if: "$get(spatialModeCatalogue).value",
          props: {
            type: "radio",
            name: "vocabulary",
            id: "spatualVocabularyCatalogue",
            if: "$get(spatialModeCatalogue).value === man",
            options: {
              if: "$get(spatialModeCatalogue).value === voc",
              then: [
                { value: "continent", label: "Continent" },
                { value: "country", label: "Country" }, 
                { value: "place", label: "Place"}
              ],
              else: {
                if: "$get(spatialModeCatalogue).value === man",
                then: [
                  {label: "Other", value: "other" }
                ],
              }
            }
          }
        },
        {
          $cmp: "FormKit",
          identifier: "spatial",
          if: "$get(spatialVocabularyCatalogue).value",
          props: {
            identifier: "spatial",
            if: "$get(spatialVocabularyCatalogue).value === other",
            then: {
              type: "url",
              identifier: "spatial",
              name: '@id'
            },
            else: {
              then: {
                type: "text",
                identifier: "spatial",
                name: '@id'
              }
            }
          }
        }
      ]
    },
    homepage: {
      identifier: 'homepage',
      $formkit:'url',
      name: 'foaf:homepage',
      class: 'property',
      validation: 'optional|url',
    },
    hasPart: {
      $formkit:'repeatable',
      identifier: 'hasPart',
      name: 'dct:hasPart',
      class: 'property',
      children: [
        {
          identifier: 'hasPartURL',
          $formkit:'url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    isPartOf: {
      identifier: 'isPartOf',
      name: 'dct:isPartOf',
      class: 'property',
      $formkit:'url',
      validation: 'optional|url',
    },
    rights: {
      identifier: "rights",
      $formkit:'group',
      name: 'dct:rights',
      children: [
        {
          identifier: 'rightsCond',
          name: "rightsMode",
          $formkit: "select",
          options: { url: 'URL', str: 'String' },
          id: "rightsModeCatalogue"
        },
        {
          identifier: 'rights',
          $cmp: "FormKit",
          if: "$get(rightsModeCatalogue).value",
          props: {
            name: 'rdfs:label',
            if: "$get(rightsModeCatalogue).value === url",
            then: {
              identifier: 'rightsUrl',
              type: "url",              
            },
            else: {
              identifier: 'rightsString',
              type: "text",
            }
          }

        }
      ]
    },
    catalog: {
      identifier: 'catalog',
      name: 'dcat:catalog',
      $formkit: 'repeatable',
      children: [
        {
          identifier: 'catalogURL',
          $formkit:'url',
          validation: 'optional|url',
          name: '@id',
        },
      ]
    },
    creator: {
      identifier: 'creator',
      $formkit:'group',
      name: 'dct:creator',
      class: 'property',
      children: [
        {
          identifier: 'creatorType',
          $formkit:'select',
          name: 'rdf:type',
          options: {
            '': '---',
            'foaf:Person': 'Person',
            'foaf:Organization': 'Organization',
          },
        },
        {
          identifier: 'creatorName',
          $formkit:'text',
          name: 'foaf:name',
        },
        {
          identifier: 'creatorEmail',
          $formkit:'email',
          name: 'foaf:mbox',
          validation: 'optional|email',
        },
        {
          identifier: 'creatorHomepage',
          $formkit:'url',
          name: 'foaf:homepage',
          validation: 'optional|url',
        },
      ],
    },
  }
};

// Dynamically add a collapsed property to all fields that are component of
// a set of specific pages steps.
// ['datasets', 'distributions'].forEach((type) => {
//   [].concat(
//     // advised and additional fields for datasets/distributions
//     Object.keys(config?.[type].step2),
//     Object.keys(config?.[type].step3),
//   ).forEach((key) => {
//     dcatapProperties[type][key].collapsed = true;
//   });
// })

export default dcatapProperties;
