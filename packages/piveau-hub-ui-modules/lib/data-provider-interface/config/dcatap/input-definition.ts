import { type FormKitSchemaDefinition } from '@formkit/core';
import { markRaw } from 'vue';

import language from '../selector-languages.json';
import config from './page-content-config';

/**
 * Available properties for datasets.
 */
export type DcatApDatasetsProperty =
  // Append new properties here for accurate type checking
  'datasetID'
  | 'overview'
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
  | 'hasPolicy'
  | 'language'
  | 'licence'
  | 'conformsTo'
  | 'issued'
  | 'modified'
  | 'rights'
  | 'spatialResolutionInMeters'
  | 'temporalResolution'
  | 'type'
  | 'status';

export type DcatApCataloguesProperty =
  // Append new properties here for accurate type checking
  'datasetID'
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
    datasetID: {
      identifier: 'datasetID',
      $formkit: 'id',
      mandatory: true,
      name: 'datasetID',
      id: 'datasetID'
    },
    description: {
      identifier: 'description',
      $formkit: 'repeatable',
      name: 'dct:description',
      minimum: 1,
      children: [
        {
          identifier: 'datasetDescription',
          $formkit: 'group',
          name: 'dct:description',
          children: [
            {
              identifier: 'language',
              value: 'en',
              $formkit: 'select',
              options: language,
              validation: 'required',
              name: '@language',
              classes: {
                outer: 'w25-textfield'
              }
            },
            {
              identifier: 'description',
              $formkit: 'textarea',
              mandatory: true,
              name: '@value',
              validation: 'required',
              classes: {
                outer: 'w75-descField'
              }
            },
          ],
        }
      ]
    },
    title: {
      id: 'title',
      identifier: 'title',
      $formkit: 'repeatable',
      name: 'dct:title',
      children: [
        {
          identifier: 'datasetTitle',
          $formkit: 'group',
          name: 'dct:title',

          minimum: 1,
          children: [
            {
              identifier: 'dctTitle',
              $formkit: 'select',
              validation: 'required',
              options: language,
              value: 'en',
              name: '@language',
              classes: {
                outer: 'w25-textfield'
              }
            },
            {
              identifier: 'title',
              $formkit: 'text',
              name: '@value',
              validation: 'required',
              mandatory: true,
              classes: {
                outer: 'w75-textfield'
              }
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
          $formkit: 'group',
          name: 'dcat:contactPoint',
          children: [
            {
              identifier: 'contactPointType',
              $formkit: 'select',
              name: 'rdf:type',
              options: {
                '': '---',
                'vcard:Individual': 'Person',
                'vcard:Organization': 'Organization',
              },
              classes: {
                outer: 'w97-textfield'
              },
            },
            {
              identifier: 'contactPointName',
              $formkit: 'text',
              name: 'vcard:fn',
              classes: {
                outer: 'w97-textfield'
              },
            },
            {
              identifier: 'contactPointEmail',
              $formkit: 'email',
              name: 'vcard:hasEmail',
              validation: 'optional|email',
              classes: {
                outer: 'w97-textfield'
              },
            },
            {
              identifier: 'contactPointAddress',
              $formkit: 'group',
              name: 'vcard:hasAddress',
              classes: {
                outer: 'w97-textfield'
              },
              children: [
                {
                  identifier: 'contactPointAddressStreet',
                  $formkit: 'text',
                  name: 'vcard:street_address',
                  classes: {
                    outer: 'w97-textfield'
                  },
                },
                {
                  identifier: 'contactPointAddressPostcode',
                  $formkit: 'text',
                  name: 'vcard:postal_code',
                  classes: {
                    outer: 'w97-textfield'
                  },
                },
                {
                  identifier: 'contactPointAddressCity',
                  $formkit: 'text',
                  name: 'vcard:locality',
                  classes: {
                    outer: 'w97-textfield'
                  },
                },
                {
                  identifier: 'contactPointAddressCountry',
                  $formkit: 'text',
                  name: 'vcard:country_name',
                  classes: {
                    outer: 'w97-textfield'
                  },
                },
              ],
            },
            {
              identifier: 'contactPointTelephone',
              $formkit: 'tel',
              name: 'vcard:hasTelephone',
              classes: {
                outer: 'w97-textfield'
              },
            },
            {
              identifier: 'contactPointUrl',
              $formkit: 'url',
              name: 'vcard:hasURL',
              validation: 'optional|url',
              classes: {
                outer: 'w97-textfield'
              },
            },
            {
              identifier: 'contactPointOrganisationName',
              $formkit: 'text',
              name: 'vcard:hasOrganizationName',
              classes: {
                outer: 'w97-textfield'
              },
            },
          ],
        }
      ]
    },
    subject: {
      identifier: 'subject',
      $formkit: 'auto',
      multiple: true,
      annifTheme: true,
      voc: 'eurovoc',
      name: 'dct:subject',
      '@annifSuggestion': false,
      id: 'subjectDataset',
      classes: {
        outer: 'w88-textfield'
      }
    },
    keyword: {
      identifier: 'keyword',
      $formkit: 'repeatable',
      name: 'dct:keyword',
      children: [
        {
          identifier: 'keywordHeader',
          $formkit: 'group',
          name: 'dct:keyword',
          children: [
            {
              identifier: 'language',
              value: 'en',
              $formkit: 'select',
              name: '@language',
              options: language,
              classes: {
                outer: 'w25-textfield'
              }
            },
            {
              identifier: 'keyword',
              $formkit: 'text',
              name: '@value',
              classes: {
                outer: 'w75-textfield'
              }
            },
          ],
        }
      ]
    },
    publisher: {
      $formkit: 'auto',
      identifier: 'publisher',
      voc: 'corporate-body',
      property: 'dct:publisher',
      id: 'publisherDataset',
      name: 'dct:publisher',
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
          $formkit: 'group',
          name: 'dct:temporal',
          identifier: 'temporal',
          children: [
            {
              identifier: 'temporalStart',
              $formkit: 'datetime-local',
              name: 'dcat:startDate',
              end: 'dct:temporal',
              classes: {
                outer: 'w25-textfield'
              },
            },
            {
              identifier: 'temporalEnd',
              $formkit: 'datetime-local',
              name: 'dcat:endDate',
              start: 'dct:temporal',
              classes: {
                outer: 'w75-textfield'
              },
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
      '@annifSuggestion': false,
      name: 'dcat:theme',
      id: 'theme',
    },
    accessRights: {
      identifier: 'accessRights',
      $formkit: 'auto',
      voc: 'access-right',
      name: 'dct:accessRights',
      id: 'accessRights'
    },
    creator: {
      identifier: 'creator',
      $formkit: 'formkitGroup',
      name: 'dct:creator',
      children: [
        {
          identifier: 'creatorType',
          $formkit: 'select',
          name: 'rdf:type',
          options: {
            '': '---',
            'foaf:Person': 'Person',
            'foaf:Organization': 'Organization',
          },
        },
        {
          identifier: 'creatorName',
          $formkit: 'text',
          name: 'foaf:name',
        },
        {
          identifier: 'creatorEmail',
          $formkit: 'email',
          name: 'foaf:mbox',
          validation: 'optional|email',
        },
        {
          identifier: 'creatorHomepage',
          $formkit: 'url',
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
          $formkit: 'group',
          name: 'dct:conformsTo',
          children: [
            {
              identifier: 'conformsToTitle',
              $formkit: 'text',
              name: 'rdfs:label',
              classes: {
                outer: 'w100-textfield'
              }
            },
            {
              identifier: 'conformsToUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes: {
                outer: 'w100-textfield'
              }
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
          $formkit: 'group',
          name: 'foaf:page',
          children: [
            {
              identifier: 'pageTitle',
              $formkit: 'repeatable',
              name: 'dct:title',
              children: [
                {
                  identifier: 'pageTitle',
                  $formkit: 'group',
                  name: 'dct:title',
                  children: [
                    {
                      identifier: 'language',
                      value: 'en',
                      $formkit: 'select',
                      options: language,
                      name: '@language',
                      classes: {
                        outer: 'w25-textfield'
                      },
                    },
                    {
                      identifier: 'pageTitleSub',
                      $formkit: 'text',
                      name: '@value',
                      classes: {
                        outer: 'w75-textfield'
                      },
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
                  $formkit: 'group',
                  name: 'dct:description',
                  children: [

                    {
                      identifier: 'language',
                      value: 'en',
                      $formkit: 'select',
                      options: language,
                      name: '@language',
                      classes: {
                        outer: 'w25-textfield'
                      },
                    },
                    {
                      identifier: 'pageDescription',
                      $formkit: 'textarea',
                      name: '@value',
                      classes: {
                        outer: 'w75-textfield'
                      },
                    },
                  ]
                }
              ]
            },
            {
              $formkit: 'auto',
              identifier: 'pageFormat',
              voc: 'file-type',
              class: "property",
              name: 'dct:format',
              id: 'pageFormat',
              classes: {

                outer: 'w97-textfield'
              }
            },
            {
              identifier: 'pageUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              class: "property",
              classes: {
                outer: 'w97-textfield'
              },
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
      id: 'accrualPeriodicity',
      classes: {
        outer: 'w88-textfield'
      },

    },
    hasVersion: {
      identifier: 'hasVersion',
      $formkit: 'repeatable',
      name: 'dct:hasVersion',
      children: [
        {
          $formkit: 'group',
          identifier: 'hasVersion',
          name: 'dct:hasVersion',
          children: [
            {
              identifier: 'hasVersionUrl',
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
    isVersionOf: {
      identifier: 'isVersionOf',
      $formkit: 'repeatable',
      name: 'dct:isVersionOf',
      children: [
        {
          $formkit: 'group',
          identifier: 'isVersionOf',
          name: 'dct:isVersionOf',
          children: [
            {
              identifier: 'isVersionOfUrl',
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
    source: {
      identifier: 'source',
      $formkit: 'repeatable',
      name: 'dct:source',
      children: [
        {
          $formkit: 'group',
          identifier: 'source',
          name: 'dct:source',
          children: [
            {
              name: '@id',
              identifier: 'sourceUrl',
              $formkit: 'url',
              validation: 'optional|url',
              classes: {
                outer: 'w100-textfield'
              },
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
          $formkit: 'group',
          name: 'dct:identifier',
          identifier: 'identifier',
          children: [
            {
              identifier: 'identifier',
              name: '@value',
              $formkit: 'text',
              classes: {
                outer: 'w100-textfield'
              }
            },
          ],
        }
      ]
    },
    isReferencedBy: {
      identifier: 'isReferencedBy',
      $formkit: 'repeatable',
      name: 'dct:isReferencedBy',
      id: 'dct:isReferencedBy',
      children: [
        {
          $formkit: 'group',
          identifier: 'isReferencedBy',
          name: 'dct:isReferencedBy',
          children: [
            {
              identifier: 'isReferencedByUrl',
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
    landingPage: {
      identifier: 'landingPage',
      $formkit: 'repeatable',
      name: 'dcat:landingPage',
      children: [
        {
          $formkit: 'group',
          identifier: 'landingPage',
          name: 'dcat:landingPage',
          children: [
            {
              identifier: 'landingPageUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes: {
                outer: 'w100-textfield'
              }
            },
          ],
        }
      ]
    },
    language: {
      identifier: 'language',
      $formkit: 'auto',
      name: 'dct:language',
      multiple: true,
      voc: 'language',
      id: 'language'
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
          $formkit: 'group',
          identifier: 'provenanceGroup',
          name: 'dct:provenance',
          children: [
            {
              identifier: 'provenance',
              $formkit: 'text',
              name: 'rdfs:label',
              classes: {
                outer: 'w100-textfield'
              },
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
          $formkit: 'group',
          identifier: 'qualifiedAttribution',
          name: 'prov:qualifiedAttribution',
          children: [
            {
              identifier: 'qualifiedAttributionUrl',
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
    wasGeneratedBy: {
      identifier: 'wasGeneratedBy',
      $formkit: 'repeatable',
      name: 'prov:wasGeneratedBy',
      children: [
        {
          $formkit: 'group',
          identifier: 'wasGeneratedBy',
          name: 'prov:wasGeneratedBy',
          children: [
            {
              identifier: 'wasGeneratedByUrl',
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
    qualifiedRelation: {
      identifier: 'qualifiedRelation',
      $formkit: 'repeatable',
      name: 'dcat:qualifiedRelation',
      children: [
        {
          $formkit: 'group',
          identifier: 'qualifiedRelation',
          name: 'dcat:qualifiedRelation',
          children: [
            {
              identifier: 'qualifiedRelationUrl',
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
    relation: {
      identifier: 'relation',
      $formkit: 'repeatable',
      name: 'dct:relation',
      children: [
        {
          $formkit: 'group',
          identifier: 'relation',
          name: 'dct:relation',
          children: [
            {
              identifier: 'relationUrl',
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
    issued: {
      identifier: 'issued',
      $formkit: 'formkitGroup',
      name: 'dct:issued',

      children: [
        {
          identifier: 'issued',
          id: 'issuedCondDataset',
          classes: {
            outer: 'w-100'
          },
          $formkit: 'select',
          name: '@type',
          options: { date: 'Date', datetime: 'Datetime' },
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
              classes: {
                outer: 'w-100'
              },
            },
            else: {
              type: 'datetime-local',
              name: '@value',
              classes: {
                outer: 'w-100'
              },
            }
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
          id: 'modifiedCondDataset',
          name: '@type',
          classes: {
            outer: 'w-100'
          },
          $formkit: 'select',
          options: { date: 'Date', datetime: 'Datetime' },
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
              classes: {
                outer: 'w-100'
              },
            },
            else: {
              type: 'datetime-local',
              name: '@value',
              classes: {
                outer: 'w-100'
              },
            }
          }
        },
      ]
    },
    spatialResolutionInMeters: {
      identifier: 'spatialResolutionInMeters',
      $formkit: 'number',
      name: 'dcat:spatialResolutionInMeters',
      validation: 'number',
      classes: { outer: 'formkitProperty formkitCmpWrap mx-0 my-3 p-3' }
    },
    temporalResolution: {
      identifier: 'temporalResolution',
      $formkit: 'formkitGroup',
      name: 'dcat:temporalResolution',
      children: [
        {
          identifier: 'temporalResolutionYear',
          $formkit: 'number',
          validation: 'min:1950|max:2100|optional',
          name: 'Year',
        },
        {
          identifier: 'temporalResolutionMonth',
          $formkit: 'number',
          validation: 'min:1|max:12|optional',
          name: 'Month',
        },
        {
          identifier: 'temporalResolutionDay',
          $formkit: 'number',
          validation: 'min:1|max:31|optional',
          name: 'Day',
        },
        {
          identifier: 'temporalResolutionHour',
          $formkit: 'number',
          validation: 'min:0|max:23|optional',
          name: 'Hour',
        },
        {
          identifier: 'temporalResolutionMinute',
          $formkit: 'number',
          validation: 'min:0|max:59|optional',
          name: 'Minute',
        },
        {
          identifier: 'temporalResolutionSecond',
          $formkit: 'number',
          validation: 'min:0|max:59|optional',
          name: 'Second',
        },
      ],
    },
    type: {
      identifier: 'type',
      $formkit: 'auto',
      voc: 'dataset-type',
      name: 'dct:type',
      id: 'type'
    },
    versionInfo: {
      identifier: 'versionInfo',
      $formkit: 'number',
      name: 'owl:versionInfo',
      classes: { outer: 'formkitProperty formkitCmpWrap mx-0 my-3 p-3' }
    },
    versionNotes: {
      identifier: 'versionNotes',
      $formkit: 'repeatable',
      name: 'adms:versionNotes',
      children: [
        {
          identifier: 'versionNotes',
          $formkit: 'group',
          name: 'adms:versionNotes',
          children: [
            {
              identifier: 'language',
              value: 'en',
              $formkit: 'select',
              name: '@language',
              options: language,
              classes: {
                outer: 'w25-textfield'
              },
            },
            {
              identifier: 'versionNotes',
              $formkit: 'textarea',
              name: '@value',
              classes: {
                outer: 'w75-textfield'
              },
            },
          ],
        }
      ]
    },
    catalog: {
      identifier: 'catalog',
      $formkit: 'select',
      name: 'dcat:catalog',
      mandatory: true,
      validation: 'required',
      options: {},
      classes: { outer: 'formkitProperty formkitCmpWrap mx-0 my-3 p-3' }
    },
    isUsedBy: {
      identifier: 'isUsedBy',
      $formkit: 'repeatable',
      name: 'dext:metadataExtension',
      children: [
        {
          $formkit: 'group',
          identifier: 'isUsedBy',
          name: 'dext:metadataExtension',
          children: [
            {
              $formkit: 'url',
              identifier: 'isUsedBy',
              validation: 'optional|url',
              name: 'dext:isUsedBy',
              classes: {
                outer: 'w100-textfield'
              }
            },
          ],
        }
      ]
    },
  },
  distributions: {
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
      id: 'availability'
    },
    description: {
      identifier: 'description',
      $formkit: 'repeatable',
      name: 'dct:description',
      children: [
        {
          identifier: 'description',
          $formkit: 'group',
          name: 'dct:description',
          mandatory: true,
          minimum: 1,
          children: [
            {
              identifier: 'description',
              $formkit: 'textarea',
              name: '@value',
            },
            {
              identifier: 'language',
              value: 'en',
              $formkit: 'select',
              options: language,
              name: '@language',
            },
          ],
        }
      ]
    },
    format: {
      identifier: 'format',
      $formkit: 'auto',
      voc: 'file-type',
      name: 'dct:format',
      id: 'format',
      classes: {

        outer: 'w88-textfield'
      }
    },
    licence: {
      $formkit: 'group',
      name: 'dct:license',
      children: [
        {
          $formkit: 'select',
          identifier: 'licence',
          name: 'licenceMode',
          id: 'licenceModeDistribution',
          classes: { outer: 'formkitProperty formkitCmpWrap mx-0 my-3 p-3' },
          options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(licenceModeDistribution).value',
          if: '$get(licenceModeDistribution).value === "voc"',
          children: [
            {
              $formkit: 'auto',
              identifier: 'licenceVocabulary',
              name: '@id',
              voc: 'licence',
              property: 'dct:license',
              id: 'licenceVocabularyDistribution'
            }
          ]
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(licenceModeDistribution).value',
          if: '$get(licenceModeDistribution).value === "man"',
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
    title: {
      identifier: 'title',
      $formkit: 'repeatable',
      name: 'dct:title',
      children: [
        {
          identifier: 'title',
          $formkit: 'group',
          name: 'dct:title',
          mandatory: true,
          minimum: 1,
          children: [
            {
              identifier: 'title',
              $formkit: 'text',
              name: '@value',

            },
            {
              identifier: 'language',
              value: 'en',
              $formkit: 'select',
              options: language,
              name: '@language',
            },
          ],
        }
      ]
    },
    mediaType: {
      identifier: 'mediaType',
      $formkit: 'auto',
      voc: 'iana-media-types',
      name: 'dcat:mediaType',
      id: 'mediaType'
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
    accessService: {
      identifier: 'accessService',
      $formkit: 'repeatable',
      name: 'dcat:accessService',
      children: [
        {
          identifier: 'accessService',
          $formkit: 'group',
          name: 'dcat:accessService',
          children: [
            {
              identifier: 'accessServiceEndpointURL',
              $formkit: 'url',
              name: 'dcat:endpointURL',
              validation: 'optional|url',
            },
            {
              identifier: 'accessServiceTitle',
              $formkit: 'repeatable',
              name: 'dct:title',
              children: [
                {
                  identifier: 'accessServiceTitle',
                  $formkit: 'group',
                  name: 'dct:title',
                  children: [
                    {
                      identifier: 'language',
                      value: 'en',
                      $formkit: 'select',
                      name: '@language',
                      options: language,
                    },
                    {
                      identifier: 'title',
                      $formkit: 'text',
                      name: '@value',
                    },
                  ],
                }
              ]
            },
            {
              identifier: 'accessServiceDescription',
              $formkit: 'repeatable',
              name: 'dct:description',
              children: [
                {
                  identifier: 'accessServiceDescription',
                  $formkit: 'group',
                  name: 'dct:description',
                  children: [
                    {
                      identifier: 'description',
                      $formkit: 'textarea',
                      name: '@value',
                    },
                    {
                      identifier: 'language',
                      value: 'en',
                      $formkit: 'select',
                      name: '@language',
                      options: language,
                    },
                  ],
                }
              ]
            },
          ],
        }
      ]
    },
    byteSize: {
      identifier: 'byteSize',
      $formkit: 'text',
      name: 'dcat:byteSize',
      classes: { outer: 'formkitProperty formkitCmpWrap mx-0 my-3 p-3' }
    },
    checksum: {
      $formkit: 'group',
      identifier: 'checksum',
      name: 'spdx:checksum',
      
      children: [
        {
          identifier: 'checksum',
          $formkit: 'text',
          name: 'spdx:checksumValue',
          classes: { outer: 'formkitProperty formkitCmpWrap mx-0 my-3 p-3' },
        },
        {
          // todo: check if this is correct
          $formkit: 'auto',
          identifier: 'checksumAlgorithm',
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
      id: 'compressFormat'
    },
    packageFormat: {
      identifier: 'packageFormat',
      $formkit: 'auto',
      voc: 'iana-media-types',
      name: 'dcat:packageFormat',
      id: 'packageFormat'
    },
    page: {
      identifier: 'page',
      $formkit: 'repeatable',
      name: 'foaf:page',
      children: [
        {
          identifier: 'page',
          $formkit: 'group',
          name: 'foaf:page',
          children: [
            {
              identifier: 'pageTitle',
              $formkit: 'repeatable',
              name: 'dct:title',
              children: [
                {
                  identifier: 'pageTitle',
                  $formkit: 'group',
                  name: 'dct:title',
                  children: [

                    {
                      identifier: 'language',
                      value: 'en',
                      $formkit: 'select',
                      options: language,
                      name: '@language',
                      classes: {
                        outer: 'w25-textfield'
                      },
                    },
                    {
                      identifier: 'pageTitle',
                      $formkit: 'text',
                      name: '@value',
                      classes: {
                        outer: 'w75-textfield'
                      },
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
                  $formkit: 'group',
                  name: 'dct:description',
                  children: [
                    {
                      identifier: 'pageDescription',
                      $formkit: 'textarea',
                      name: '@value',
                    },
                    {
                      identifier: 'language',
                      value: 'en',
                      $formkit: 'select',
                      options: language,
                      name: '@language',
                    },
                  ]
                }
              ]
            },
            {
              $formkit: 'auto',
              identifier: 'pageFormat',
              voc: 'file-type',
              name: 'dct:format',
              class: "property",
              id: 'pageFormat',
              classes: {

                outer: 'w88-textfield'
              }
            },
            {
              identifier: 'pageUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              class: "property",
            },
          ],
        }
      ]
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
    language: {
      $formkit: 'auto',
      identifier: 'language',
      multiple: true,
      name: 'dct:language',
      voc: 'language',
      id: 'language'
    },
    conformsTo: {
      identifier: 'conformsTo',
      $formkit: 'repeatable',
      name: 'dct:conformsTo',
      children: [
        {
          identifier: 'conformsTo',
          $formkit: 'group',
          name: 'dct:conformsTo',
          children: [
            {
              identifier: 'conformsToTitle',
              $formkit: 'text',
              name: 'rdfs:label',
              classes: {
                outer: 'w100-textfield'
              }
            },
            {
              identifier: 'conformsToUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes: {
                outer: 'w100-textfield'
              }
            },
          ],
        }
      ]
    },
    issued: {
      identifier: 'issued',
      $formkit: 'formkitGroup',
      name: 'dct:issued',

      children: [
        {
          identifier: 'issued',
          id: 'issuedCondDist',
          classes: {
            outer: 'w-100'
          },
          $formkit: 'select',
          name: '@type',
          options: { date: 'Date', datetime: 'Datetime' },
        },
        {
          identifier: 'issued',
          $cmp: 'FormKit',
          if: '$get(issuedCondDist).value',
          props: {
            if: '$get(issuedCondDist).value === date',
            then: {
              type: 'date',
              name: '@value',
              classes: {
                outer: 'w-100'
              },
            },
            else: {
              type: 'datetime-local',
              name: '@value',
              classes: {
                outer: 'w-100'
              },
            }
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
          id: 'modifiedCondDist',
          name: '@type',
          classes: {
            outer: 'w-100'
          },
          $formkit: 'select',
          options: { date: 'Date', datetime: 'Datetime' },
        },
        {
          identifier: 'modified',
          $cmp: 'FormKit',
          if: '$get(modifiedCondDist).value',
          props: {
            name: 'dct:modified',
            if: '$get(modifiedCondDist).value === date',
            then: {
              type: 'date',
              name: '@value',
              classes: {
                outer: 'w-100'
              },
            },
            else: {
              type: 'datetime-local',
              name: '@value',
              classes: {
                outer: 'w-100'
              },
            }
          }
        },
      ]
    },
    rights: {
      identifier: 'rights',
      $cmp: 'SelectControlledGroup',
      props: {
        name: 'dct:rights',
        selectName: '@type',
        options: { url: 'URL', str: 'String' },
        initialValue: '',
      },
      children: [
        {
          $cmp: 'FormKit',
          if: '$selectValue',
          props: {
            if: '$selectValue === url',
            then: {
              identifier: 'rightsUrl',
              type: "url",
            },
            else: {
              identifier: 'rightsString',
              type: "text",
            }
          }
        },
      ]
    },
    spatialResolutionInMeters: {
      identifier: 'spatialResolutionInMeters',
      $formkit: 'number',
      name: 'dcat:spatialResolutionInMeters',
      validation: 'number',
      classes: { outer: 'formkitProperty formkitCmpWrap mx-0 my-3 p-3' },
    },
    temporalResolution: {
      identifier: 'temporalResolution',
      $formkit: 'formkitGroup',
      name: 'dcat:temporalResolution',
      children: [
        {
          identifier: 'temporalResolutionYear',
          $formkit: 'number',
          validation: 'min:1950|max:2100|optional',
          name: 'Year',
        },
        {
          identifier: 'temporalResolutionMonth',
          $formkit: 'number',
          validation: 'min:1|max:12|optional',
          name: 'Month',
        },
        {
          identifier: 'temporalResolutionDay',
          $formkit: 'number',
          validation: 'min:1|max:31|optional',
          name: 'Day',
        },
        {
          identifier: 'temporalResolutionHour',
          $formkit: 'number',
          validation: 'min:0|max:23|optional',
          name: 'Hour',
        },
        {
          identifier: 'temporalResolutionMinute',
          $formkit: 'number',
          validation: 'min:0|max:59|optional',
          name: 'Minute',
        },
        {
          identifier: 'temporalResolutionSecond',
          $formkit: 'number',
          validation: 'min:0|max:59|optional',
          name: 'Second',
        },
      ],
    },
    type: {
      identifier: 'type',
      $formkit: 'auto',
      voc: 'distribution-type',
      name: 'dct:type',
      id: 'type'
    },
    status: {
      identifier: 'status',
      $formkit: 'auto',
      voc: 'dataset-status',
      name: 'adms:status',
      id: 'status'
    },
  },
  catalogues: {
    datasetID: {
      $formkit: 'id',
      identifier: 'datasetID',
      name: 'datasetID',
      mandatory: true,
    },
    title: {
      identifier: 'title',
      $formkit: 'repeatable',
      name: 'dct:title',
      children: [
        {
          identifier: 'title',
          $formkit: 'group',
          name: 'dct:title',
          mandatory: true,
          minimum: 1,
          children: [
            {
              identifier: 'titleLabel',
              $formkit: 'text',
              name: '@value',
              validation: 'required',
            },
            {
              identifier: 'language',
              value: 'en',
              $formkit: 'select',
              validation: 'required',
              options: language,
              name: '@language',
            },
          ],
        }
      ]
    },
    description: {
      identifier: 'datasetDescription',
      $formkit: 'repeatable',
      name: 'dct:description',
      children: [
        {
          identifier: 'datasetDescription',
          $formkit: 'group',
          name: 'dct:description',
          mandatory: true,
          minimum: 1,
          children: [
            {
              identifier: 'description',
              $formkit: 'textarea',
              name: '@value',
              validation: 'required',
            },
            {
              identifier: 'language',
              value: 'en',
              $formkit: 'select',
              options: language,
              validation: 'required',
              name: '@language',
            },
          ],
        }
      ]
    },
    publisher: {
      $formkit: 'auto',
      identifier: 'publisher',
      name: 'dct:publisher',
      voc: 'corporate-body',
      id: 'publisher'
    },
    language: {
      identifier: 'language',
      $formkit: 'auto',
      multiple: true,
      name: 'dct:language',
      voc: 'language',
      id: 'language'
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
              id: 'licenceVocabularyCatalogue'
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
      $formkit: 'repeatable',
      name: 'dct:spatial',
      identifier: 'spatial',
      children: [
        {
          $formkit: 'spatial',
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
                id: "spatialVocabularyCatalogue",
                if: "$get(spatialModeCatalogue).value === man",
                options: {
                  if: "$get(spatialModeCatalogue).value === voc",
                  then: [
                    { value: "continent", label: "Continent" },
                    { value: "country", label: "Country" },
                    { value: "place", label: "Place" }
                  ],
                  else: {
                    if: "$get(spatialModeCatalogue).value === man",
                    then: [
                      { label: "Other", value: "other" }
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
        }
      ]
    },
    homepage: {
      identifier: 'homepage',
      $formkit: 'url',
      name: 'foaf:homepage',
      validation: 'optional|url',
    },
    hasPart: {
      identifier: 'hasPart',
      $formkit: 'repeatable',
      name: 'dct:hasPart',
      children: [
        {
          $formkit: 'group',
          identifier: 'hasPart',
          name: 'dct:hasPart',
          children: [
            {
              identifier: 'hasPartURL',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
            },
          ],
        }
      ]
    },
    isPartOf: {
      identifier: 'isPartOf',
      name: 'dct:isPartOf',
      $formkit: 'url',
      validation: 'optional|url',
    },
    rights: {
      identifier: "rights",
      $formkit: 'group',
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
      $formkit: 'repeatable',
      name: 'dcat:catalog',
      children: [
        {
          $formkit: 'group',
          identifier: 'catalog',
          name: 'dcat:catalog',
          children: [
            {
              identifier: 'catalogURL',
              $formkit: 'url',
              validation: 'optional|url',
              name: '@id',
            },
          ],
        }
      ]
    },
    creator: {
      identifier: 'creator',
      $formkit: 'group',
      name: 'dct:creator',
      children: [
        {
          identifier: 'creatorType',
          $formkit: 'select',
          name: 'rdf:type',
          options: {
            '': '---',
            'foaf:Person': 'Person',
            'foaf:Organization': 'Organization',
          },
        },
        {
          identifier: 'creatorName',
          $formkit: 'text',
          name: 'foaf:name',
        },
        {
          identifier: 'creatorEmail',
          $formkit: 'email',
          name: 'foaf:mbox',
          validation: 'optional|email',
        },
        {
          identifier: 'creatorHomepage',
          $formkit: 'url',
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
