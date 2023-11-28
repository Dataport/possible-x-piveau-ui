import language from '../selector-languages.json';
import config from './page-content-config';

const dcatapProperties = {
  datasets: {
    datasetID: {
      identifier: 'datasetID',
      $formkit:'text',
      type:'unique-identifier-input',
      mandatory: true,
      name: 'datasetID',
      class: 'property mandatory',
    },
    description: {
      identifier: 'datasetDescription',
      $formkit:'group',
      name: 'dct:description',
      class: 'property langDescriptionInput mandatory',
      repeatable: true,
      mandatory: true,
      '@repeatableRemoved': true,
      minimum: 1,
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
    },
    title: {
      identifier: 'title',
      $formkit: 'group',
      name: 'dct:title',
      class: 'property langStringInput mandatory',
      repeatable: true,
      mandatory: true,
      '@repeatableRemoved': true,
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
    },
    contactPoint: {
      identifier: 'contactPoint',
      $formkit:'group',
      name: 'dcat:contactPoint',
      class: 'property',
      '@repeatableRemoved': true,
      repeatable: true,
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
          $formkit:'custom-url',
          name: 'vcard:hasURL',
          validation: 'optional|url',
        },
        {
          identifier: 'contactPointOrganisationName',
          $formkit:'text',
          name: 'vcard:hasOrganizationName',
        },
      ],
    },
    subject: {
      identifier: 'subject',
      type: 'autocomplete',
      name: 'dct:subject',
      multiple: true,
      annifTheme: true,
      class: 'property',
      voc: 'eurovoc',
      '@annifSuggestion': false,
    },
    keyword: {
      identifier: 'keywordHeader',
      $formkit:'group',
      name: 'dcat:keyword',
      class: 'property langStringInput',
      repeatable: true,
      '@repeatableRemoved': true,
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
    },
    publisher: {
      identifier: 'publisher',
      name: 'dct:publisher',
      class: 'property',
      type:'autocomplete',
      voc: 'corporate-body',
    },
    spatial: {
      identifier: 'spatial',
      $formkit:'group',
      name: 'dct:spatial',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      minimum: 1,
      children: [
        {
          identifier: 'spatial',
          $formkit:'conditional-input',
          name: '@id',
          class: 'property',
          repeatable: true,
          '@repeatableRemoved': true,
          options: {
            voc: 'Choose from vocabulary',
            man: 'Manually submit information',
          },
          data: {
            voc: [
              {
                identifier: 'spatialVocabulary',
                $formkit:'conditional-input',
                name: '@id',
                options: {
                  continent: 'Continent',
                  country: 'Country',
                  place: 'Place',
                },
                data: {
                  continent: [
                    {
                      identifier: 'spatialContinent',
                      type: 'autocomplete',
                      voc: 'continent',
                      name: '@id',
                    },
                  ],
                  country: [
                    {
                      identifier: 'spatialCountry',
                      type: 'autocomplete',
                      voc: 'country',
                      name: '@id',
                    },
                  ],
                  place: [
                    {
                      identifier: 'spatialPlace',
                      type: 'autocomplete',
                      voc: 'place',
                      name: '@id',
                    },
                  ],
                },
              },
            ],
            man: [
              {
                identifier: 'spatialUrl',
                $formkit:'custom-url',
                name: '@id',
                validation: 'optional|url',
              },
            ],
          },
        }
      ]
    },
    temporal: {
      $formkit:'group',
      name: 'dct:temporal',
      identifier: 'temporal',
      class: 'property besides startEndDate',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
          {
            identifier: 'temporalRange',
            $formkit:'datetime-picker',
            name: 'dct:temporal',
            property:'dct:temporal',
            end: 'dct:temporal',
          }]
      // children: [
      //   {
      //     identifier: 'temporalStart',
      //     $formkit:'datetime-picker',
      //     name: 'dcat:startDate',
      //     property:'dct:temporal',
      //     end: 'dct:temporal',
      //   },
      //   {
      //     identifier: 'temporalEnd',
      //     $formkit:'datetime-picker',
      //     name: 'dcat:endDate',
      //     property:'dct:temporal',
      //     start: 'dct:temporal',
      //   },
      // ],
    },
    theme: {
      identifier: 'theme',
      type: 'autocomplete',
      multiple: true,
      annifTheme: true,
      voc: 'data-theme',
      name: 'dcat:theme',
      class: 'property',
      '@annifSuggestion': false,
    },
    accessRights: {
      identifier: 'accessRights',
      type: 'autocomplete',
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
          $formkit:'custom-url',
          name: 'foaf:homepage',
          validation: 'optional|url',
        },
      ],
    },
    conformsTo: {
      identifier: 'conformsTo',
      $formkit:'group',
      name: 'dct:conformsTo',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'conformsToTitle',
          $formkit:'text',
          name: 'rdfs:label',
        },
        {
          identifier: 'conformsToUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    page: {
      identifier: 'page',
      $formkit:'group',
      name: 'foaf:page',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'pageTitle',
          $formkit:'group',
          name: 'dct:title',
          class: 'property langStringInput',
          repeatable: true,
          '@repeatableRemoved': true,
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
        },
        {
          identifier: 'pageDescription',
          $formkit:'group',
          name: 'dct:description',
          class: 'property langDescriptionInput',
          repeatable: true,
          '@repeatableRemoved': true,
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
        },
        {
          identifier: 'pageFormat',
          type: 'autocomplete',
          voc: 'file-type',
          name: 'dct:format',
          class: "property",
        },
        {
          identifier: 'pageUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
          class: "property",
        },
      ],
    },
    accrualPeriodicity: {
      identifier: 'accrualPeriodicity',
      type: 'autocomplete',
      voc: 'frequency',
      name: 'dct:accrualPeriodicity',
      class: 'property',

    },
    hasVersion: {
      $formkit:'group',
      identifier: 'hasVersion',
      name: 'dct:hasVersion',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'hasVersionUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    isVersionOf: {
      $formkit:'group',
      identifier: 'isVersionOf',
      name: 'dct:isVersionOf',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'isVersionOfUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    source: {
      $formkit:'group',
      repeatable: true,
      '@repeatableRemoved': true,
      identifier: 'source',
      name: 'dct:source',
      class: 'property',
      children: [
        {
          name: '@id',
          identifier: 'sourceUrl',
          $formkit:'custom-url',
          validation: 'optional|url',
        },
      ],
    },
    identifier: {
      $formkit:'group',
      class: 'property',
      name: 'dct:identifier',
      identifier: 'identifier',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'identifier',
          name: '@value',
          $formkit:'text',
        },
      ],
    },
    isReferencedBy: {
      $formkit:'group',
      identifier: 'isReferencedBy',
      name: 'dct:isReferencedBy',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'isReferencedByUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    landingPage: {
      $formkit:'group',
      identifier: 'landingPage',
      name: 'dcat:landingPage',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'landingPageUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    language: {
      identifier: 'language',
      type: 'autocomplete',
      name: 'dct:language',
      class: 'property',
      multiple: true,
      voc: 'language',
    },
    admsIdentifier: {
      $formkit:'group',
      class: 'property',
      name: 'adms:identifier',
      identifier: 'admsIdentifier',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'admsIdentifierUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
        {
          identifier: 'admsIdentifierSkosNotation',
          $formkit:'group',
          name: 'skos:notation',
          children: [
            {
              identifier: 'admsIdentifierValue',
              $formkit:'text',
              name: '@value',
            },
            {
              identifier: 'admsIdentifierType',
              type: 'autocomplete',
              voc: 'notation-type',
              name: '@type',
            },
          ],
        },
      ],
    },
    provenance: {
      $formkit:'group',
      identifier: 'provenanceGroup',
      name: 'dct:provenance',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'provenance',
          $formkit:'text',
          name: 'rdfs:label',
        },
      ],
    },
    qualifiedAttribution: {
      $formkit:'group',
      identifier: 'qualifiedAttribution',
      name: 'prov:qualifiedAttribution',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'qualifiedAttributionUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    wasGeneratedBy: {
      $formkit:'group',
      identifier: 'wasGeneratedBy',
      name: 'prov:wasGeneratedBy',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'wasGeneratedByUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    qualifiedRelation: {
      $formkit:'group',
      identifier: 'qualifiedRelation',
      name: 'dcat:qualifiedRelation',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'qualifiedRelationUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    relation: {
      $formkit:'group',
      identifier: 'relation',
      name: 'dct:relation',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'relationUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    issuedCond: {
      identifier: 'issuedCond',
      id: 'issuedCond',
      $formkit: 'select',
      options: {date: 'Date', datetime: 'Datetime'},
    },
    issued: {
      identifier: 'issued',
      $cmp: 'FormKit',
      if: '$get(issuedCond).value',
      props: {
        name: 'dct:issued',
        if: '$get(issuedCond).value === date',
        then: {
          type: 'date'
        },
        else: {
          type: 'datetime-local'
        }
      }
    },
    modifiedCond: {
      identifier: 'modifiedCond',
      id: 'modifiedCond',
      $formkit: 'select',
      options: {date: 'Date', datetime: 'Datetime'},
    },
    modified: {
      identifier: 'modified',
      $cmp: 'FormKit',
      if: '$get(modifiedCond).value',
      props: {
        name: 'dct:modified',
        if: '$get(modifiedCond).value === date',
        then: {
          type: 'date'
        },
        else: {
          type: 'datetime-local'
        }
      }
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
      type: 'autocomplete',
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
      $formkit:'group',
      name: 'adms:versionNotes',
      class: 'property langDescriptionInput',
      repeatable: true,
      '@repeatableRemoved': true,
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
    },
    catalog: {
      identifier: 'catalog',
      $formkit:'select',
      name: 'dct:catalog',
      class: 'property mandatory',
      validation: 'required',
      mandatory: true,
      options: {},
    },
    isUsedBy: {
      $formkit:'group',
      identifier: 'isUsedBy',
      name: 'dext:metadataExtension',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          $formkit:'custom-url',
          identifier: 'isUsedBy',
          validation: 'optional|url',
          name: 'dext:isUsedBy',
        },
      ],
    },
  },
  distributions: {
    accessURL: {
      identifier: 'accessUrl',
      name: 'dcat:accessURL',
      $formkit:'group',
      repeatable: true,
      '@repeatableRemoved': true,
      validation: 'required',
      mandatory: true,
      minimum: 1,
      class: 'property',
      children: [
        {
          identifier: 'accessUrl',
          name: '@id',
          $formkit:'conditional-input',
          options: { url: 'Provide an URL', file: 'Upload a file' },
          data: {
            url: [
              {
                identifier: 'accessUrlLink',
                $formkit:'custom-url',
                name: '@id',
                validation: 'required|url',
              },
            ],
            file: [
              {
                identifier: 'accessUrlFile',
                $formkit:'fileupload',
                name: '@id',
                validation: 'required',
              },
            ],
          },
        },
      ],
    },
    availability: {
      identifier: 'availability',
      type: 'autocomplete',
      voc: 'planned-availability',
      name: 'dcatap:availability',
      class: 'property',
    },
    description: {
      identifier: 'description',
      $formkit:'group',
      name: 'dct:description',
      class: 'property langDescriptionInput',
      repeatable: true,
      '@repeatableRemoved': true,
      minimum: 1,
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
          options: language,
          name: '@language',
          class: 'selectLangField',
        },
      ],
    },
    format: {
      identifier: 'format',
      type: 'autocomplete',
      class: 'property',
      voc: 'file-type',
      name: 'dct:format',
    },
    licence: {
      identifier: 'licence',
      $formkit:'conditional-input',
      name: 'dct:license',
      class: 'property',
      options: {
        voc: 'Choose from vocabulary',
        man: 'Manually submit information',
      },
      data: {
        voc: [
          {
            identifier: 'licenceVocabulary',
            type: 'autocomplete',
            voc: 'licence',
            name: '@id',
          },
        ],
        man: [
          {
            identifier: 'licenceDetails',
            $formkit:'group',
            name: 'dct:license',
            children: [
              {
                identifier: 'licenceTitle',
                $formkit:'text',
                name: 'dct:title',
              },
              {
                identifier: 'licenceDescription',
                $formkit:'textarea',
                name: 'skos:prefLabel',
              },
              {
                identifier: 'licenceURL',
                $formkit:'custom-url',
                name: 'skos:exactMatch',
                validation: 'optional|url',
              },
            ],
          },
        ],
      },
    },
    title: {
      identifier: 'title',
      $formkit:'group',
      name: 'dct:title',
      class: 'property langStringInput',
      repeatable: true,
      '@repeatableRemoved': true,
      minimum: 1,
      children: [
        {
          identifier: 'title',
          $formkit:'text',
          name: '@value',
          class: 'w-100 inputTextfield',
        },
        {
          identifier: 'disTitle',
          value: 'en',
          $formkit:'select',
          options: language,
          name: '@language',
          class: 'selectLangField',
        },
      ],
    },
    mediaType: {
      identifier: 'mediaType',
      type: 'autocomplete',
      voc: 'iana-media-types',
      name: 'dcat:mediaType',
      class: 'property',
    },
    downloadUrl: {
      $formkit:'group',
      identifier: 'downloadUrl',
      repeatable: true,
      name: 'dcat:downloadURL',
      '@repeatableRemoved': true,
      class: 'property',
      children: [
        {
          identifier: 'downloadUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    accessService: {
      identifier: 'accessService',
      $formkit:'group',
      name: 'dcat:accessService',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'accessServiceEndpointURL',
          $formkit:'custom-url',
          name: 'dcat:endpointURL',
          class: 'property ',
          validation: 'optional|url',
        },
        {
          identifier: 'accessServiceTitle',
          $formkit:'group',
          name: 'dct:title',
          class: 'property langStringInput',
          repeatable: true,
          '@repeatableRemoved': true,
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
          ],
        },
        {
          identifier: 'accessServiceDescription',
          $formkit:'group',
          name: 'dct:description',
          class: 'property langDescriptionInput',
          repeatable: true,
          '@repeatableRemoved': true,
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
          ],
        },
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
          type: 'autocomplete',
          voc: 'spdx-checksum-algorithm',
          name: 'spdx:algorithm',
        },
      ],
    },
    compressFormat: {
      identifier: 'compressFormat',
      type: 'autocomplete',
      voc: 'iana-media-types',
      name: 'dcat:compressFormat',
      class: 'property',
    },
    packageFormat: {
      identifier: 'packageFormat',
      type: 'autocomplete',
      voc: 'iana-media-types',
      name: 'dcat:packageFormat',
      class: 'property',
    },
    page: {
      identifier: 'page',
      $formkit:'group',
      name: 'foaf:page',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'pageTitle',
          $formkit:'group',
          name: 'dct:title',
          class: 'property langStringInput',
          repeatable: true,
          '@repeatableRemoved': true,
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
              options: language,
              name: '@language',
              class: 'selectLangField',
            },
          ]
        },
        {
          identifier: 'pageDescription',
          $formkit:'group',
          name: 'dct:description',
          class: 'property langDescriptionInput',
          repeatable: true,
          '@repeatableRemoved': true,
          children: [
            {
              identifier: 'description',
              $formkit:'textarea',
              name: '@value',
              class: 'inputTextfield w-100',
            },
            {
              identifier: 'descriptionLanguage',
              value: 'en',
              $formkit:'select',
              options: language,
              name: '@language',
              class: 'selectLangField',
            },
          ]
        },
        {
          identifier: 'pageFormat',
          type: 'autocomplete',
          voc: 'file-type',
          name: 'dct:format',
        },
        {
          identifier: 'pageUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    hasPolicy: {
      identifier: 'hasPolicy',
      $formkit:'group',
      class: 'property',
      name: 'odrl:hasPolicy',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'hasPolicyUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    language: {
      identifier: 'language',
      type: 'autocomplete',
      multiple: true,
      name: 'dct:language',
      voc: 'language',
      class: 'property',
    },
    conformsTo: {
      identifier: 'conformsTo',
      $formkit:'group',
      name: 'dct:conformsTo',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'conformsToTitle',
          $formkit:'text',
          name: 'rdfs:label',
          class: 'main',
        },
        {
          identifier: 'conformsToUrl',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    issuedCond: {
      identifier: 'issuedCond',
      id: 'issuedCond',
      $formkit: 'select',
      options: {date: 'Date', datetime: 'Datetime'},
    },
    issued: {
      identifier: 'issued',
      $cmp: 'FormKit',
      if: '$get(issuedCond).value',
      props: {
        name: 'dct:issued',
        if: '$get(issuedCond).value === date',
        then: {
          type: 'date'
        },
        else: {
          type: 'datetime-local'
        }
      }
    },
    modifiedCond: {
      identifier: 'modifiedCond',
      id: 'modifiedCond',
      $formkit: 'select',
      options: {date: 'Date', datetime: 'Datetime'},
    },
    modified: {
      identifier: 'modified',
      $cmp: 'FormKit',
      if: '$get(modifiedCond).value',
      props: {
        name: 'dct:modified',
        if: '$get(modifiedCond).value === date',
        then: {
          type: 'date'
        },
        else: {
          type: 'datetime-local'
        }
      }
    },
    rights: {
      identifier: 'rights',
      $formkit:'conditional-input',
      name: 'dct:rights',
      class: 'property',
      options: { url: 'URL', str: 'String' },
      data: {
        url: [
          {
            name: 'rdfs:label',
            identifier: 'rightsUrl',
            $formkit:'custom-url',
            validation: 'optional|url'
          }
        ],
        str: [
          {
            name: 'rdfs:label',
            identifier: 'rightsString',
            $formkit:'text',
            validation: 'optional'
          }
        ]
      }
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
          $formkit:'custom-number',
          min: 0,
          max: 2023,
          name: 'Year',
        },
        {
          identifier: 'temporalResolutionMonth',
          $formkit:'custom-number',
          min: 0,
          max: 12,
          name: 'Month',
        },
        {
          identifier: 'temporalResolutionDay',
          $formkit:'custom-number',
          min: 0,
          max: 31,
          name: 'Day',
        },
        {
          identifier: 'temporalResolutionHour',
          $formkit:'custom-number',
          min: 0,
          max: 23,
          name: 'Hour',
        },
        {
          identifier: 'temporalResolutionMinute',
          $formkit:'custom-number',
          min: 0,
          max: 59,
          name: 'Minute',
        },
        {
          identifier: 'temporalResolutionSecond',
          $formkit:'custom-number',
          min: 0,
          max: 59,
          name: 'Second',
        },
      ],
    },
    type: {
      identifier: 'type',
      type: 'autocomplete',
      voc: 'distribution-type',
      name: 'dct:type',
      class: 'property',
    },
    status: {
      identifier: 'status',
      type: 'autocomplete',
      voc: 'dataset-status',
      name: 'adms:status',
      class: 'property',
    },
  },
  catalogues: {
    datasetID: {
      identifier: 'datasetID',
      $formkit:'input',
      type:'unique-identifier-input',
      name: 'datasetID',
      class: 'property',
      mandatory: true,
    },
    title: {
      identifier: 'title',
      mandatory: true,
      $formkit:'group',
      name: 'dct:title',
      class: 'property grid1r2c',
      repeatable: true,
      '@repeatableRemoved': true,
      minimum: 1,
      children: [
        {
          identifier: 'title',
          $formkit:'textarea',
          name: '@value',
          validation: 'required',
          class: 'row1 column1',
        },
        {
          identifier: 'language',
          value: 'en',
          $formkit:'select',
          validation: 'required',
          options: language,
          name: '@language',
          class: 'row1 column2',
        },
      ],
    },
    description: {
      identifier: 'description',
      $formkit:'group',
      name: 'dct:description',
      class: 'property langDescriptionInput',
      mandatory: true,
      repeatable: true,
      '@repeatableRemoved': true,
      minimum: 1,
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
          class: 'selectLangFieldScnd',
        },
      ],
    },
    publisher: {
      identifier: 'publisher',
      name: 'dct:publisher',
      class: 'property',
      type: 'autocomplete',
      voc: 'corporate-body',
      validation: 'required',
    },
    language: {
      identifier: 'language',
      type: 'autocomplete',
      name: 'dct:language',
      class: 'property',
      multiple: true,
      validation: "required",
      mandatory: true,
      minimum: 1,
      voc: 'language',
    },
    licence: {
      identifier: 'licence',
      $formkit:'conditional-input',
      name: 'dct:license',
      class: 'property',
      options: {
        voc: 'Choose from vocabulary',
        man: 'Manually submit information',
      },
      data: {
        voc: [
          {
            identifier: 'licenceVocabulary',
            type: 'autocomplete',
            voc: 'licence',
            name: '@id',
          },
        ],
        man: [
          {
            identifier: 'licenceDetails',
            $formkit:'group',
            name: 'dct:license',
            children: [
              {
                identifier: 'licenceTitle',
                $formkit:'text',
                name: 'dct:title',
              },
              {
                identifier: 'licenceDescription',
                $formkit:'textarea',
                name: 'skos:prefLabel',
              },
              {
                identifier: 'licenceURL',
                $formkit:'custom-url',
                name: 'skos:exactMatch',
                validation: 'optional|url',
              },
            ],
          },
        ],
      },
    },
    spatial: {
      identifier: 'spatial',
      $formkit:'conditional-input',
      name: 'dct:spatial',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      options: {
        voc: 'Choose from vocabulary',
        man: 'Manually submit information',
      },
      data: {
        voc: [
          {
            identifier: 'spatialVocabulary',
            $formkit:'conditional-input',
            name: 'dct:spatial',
            options: {
              continent: 'Continent',
              country: 'Country',
              place: 'Place',
            },
            data: {
              continent: [
                {
                  identifier: 'spatialContinent',
                  type: 'autocomplete',
                  voc: 'continent',
                  name: '@id',
                },
              ],
              country: [
                {
                  identifier: 'spatialCountry',
                  type: 'autocomplete',
                  voc: 'country',
                  name: '@id',
                },
              ],
              place: [
                {
                  identifier: 'spatialPlace',
                  type: 'autocomplete',
                  voc: 'place',
                  name: '@id',
                },
              ],
            },
          },
        ],
        man: [
          {
            identifier: 'spatialUrl',
            $formkit:'custom-url',
            name: '@id',
            validation: 'optional|url',
          },
        ],
      },
    },
    homepage: {
      identifier: 'homepage',
      $formkit:'custom-url',
      name: 'foaf:homepage',
      class: 'property',
      validation: 'optional|url',
    },
    hasPart: {
      $formkit:'group',
      identifier: 'hasPart',
      name: 'dct:hasPart',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'hasPartURL',
          $formkit:'custom-url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
    },
    isPartOf: {
      identifier: 'isPartOf',
      name: 'dct:isPartOf',
      class: 'property',
      $formkit:'custom-url',
      validation: 'optional|url',
    },
    rights: {
      identifier: 'rights',
      $formkit:'conditional-input',
      name: 'dct:rights',
      class: 'property',
      options: { url: 'URL', str: 'String' },
      data: {
        url: [
          {
            name: 'rdfs:label',
            identifier: 'rightsUrl',
            $formkit:'custom-url',
            validation: 'optional|url'
          }
        ],
        str: [
          {
            name: 'rdfs:label',
            identifier: 'rightsString',
            $formkit:'text',
            validation: 'optional'
          }
        ]
      }
    },
    catalog: {
      $formkit:'group',
      repeatabale: true,
      identifier: 'catalog',
      name: 'dcat:catalog',
      class: 'property',
      repeatable: true,
      '@repeatableRemoved': true,
      children: [
        {
          identifier: 'catalogURL',
          $formkit:'custom-url',
          validation: 'optional|url',
          name: '@id',
        },
      ],
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
          $formkit:'custom-url',
          name: 'foaf:homepage',
          validation: 'optional|url',
        },
      ],
    },
  }
};

// Dynamically add a collapsed property to all fields that are component of
// a set of specific pages steps.
['datasets', 'distributions'].forEach((type) => {
  [].concat(
    // advised and additional fields for datasets/distributions
    Object.keys(config?.[type].step2),
    Object.keys(config?.[type].step3),
  ).forEach((key) => {
    dcatapProperties[type][key].collapsed = true;
  });
})

export default dcatapProperties;
