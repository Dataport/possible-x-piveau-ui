import language from '../selector-languages.json';
import config from './page-content-config';

const dcatapProperties = {
  datasets: {
    // unique identifier component
    datasetID: {
      identifier: 'datasetID',
      // type:'unique-identifier-input',
      mandatory: true,
      name: 'datasetID',
      class: 'property mandatory',
    },
    // minimum (unability to remove fields to 0)
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
          class: 'property langDescriptionInput mandatory',
          children: [
            {
              identifier: 'descriptionLanguage',
              value: 'en',
              $formkit: 'select',
              options: language,
              'prefix-icon': "info",
              validation: 'required',
              name: '@language',
              classes: {
                outer: 'w25-textfield'
              }
            },
            {
              identifier: 'description',
              $formkit: 'textarea',
              'prefix-icon': "info",
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
    // minimum (unability to remove fields to 0)
    title: {
      identifier: 'title',
      $formkit: 'repeatable',
      name: 'dct:title',
      children: [
        {
          identifier: 'title',
          $formkit: 'group',
          name: 'dct:title',
          class: 'property langStringInput mandatory',
          mandatory: true,
          minimum: 1,
          children: [
            {
              identifier: 'dctTitle',
              value: 'en',
              $formkit: 'select',
              validation: 'required',
              options: language,
              'prefix-icon': "info",
              name: '@language',
              classes: {
                outer: 'w25-textfield'
              }
            },
            {
              identifier: 'titleLabel',
              $formkit: 'text',
              name: '@value',
              validation: 'required',
              'prefix-icon': "info",
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
          class: 'property',
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
    // autocomplete, multiple
    subject: {
      identifier: 'subject',
      // $formkit: 'autocomplete',
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
      name: 'dct:keyword',
      children: [
        {
          identifier: 'keywordHeader',
          $formkit: 'group',
          name: 'dct:keyword',
          class: 'property langStringInput',
          children: [
            {
              identifier: 'keywordsLanguage',
              value: 'en',
              $formkit: 'select',
              name: '@language',
              class: 'selectLangField',
              options: language,
              classes: {
                outer: 'w25-textfield'
              }
            },
            {
              identifier: 'keyword',
              $formkit: 'text',
              name: '@value',
              class: 'w-100 inputTextfield',
              classes: {
                outer: 'w75-textfield'
              }
            },
          ],
        }
      ]
    },
    // autocomplete
    publisher: {
      identifier: 'publisher',
      name: 'dct:publisher',
      class: 'property',
      // $formkit:'autocomplete',
      voc: 'corporate-body',
    },
    spatial: {
      identifier: 'spatial',
      $formkit: 'repeatable',
      name: 'dct:spatial',
      children: [
        {
          $formkit: 'group',
          name: 'dct:spatial',
          identifier: 'spatial',
          children: [
            {
              $formkit: "select",
              identifier: "spatial",
              id: "spatialMode",
              name: "spatialMode",
              options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
            },
            {
              $cmp: "FormKit",
              identifier: "spatial",
              if: "$get(spatialMode).value",
              props: {
                type: "radio",
                name: "vocabulary",
                id: "vocabulary",
                if: "$get(spatialMode).value === man",
                options: {
                  if: "$get(spatialMode).value === voc",
                  then: [
                    { value: "continent", label: "Continent" },
                    { value: "country", label: "Country" },
                    { value: "place", label: "Place" }
                  ],
                  else: {
                    if: "$get(spatialMode).value === man",
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
              if: "$get(vocabulary).value",
              props: {
                identifier: "spatial",
                if: "$get(vocabulary).value === other",
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
    temporal: {
      identifier: 'temporal',
      $formkit: 'repeatable',
      name: 'dct:temporal',
      children: [
        {
          $formkit: 'group',
          name: 'dct:temporal',
          identifier: 'temporal',
          class: 'property besides startEndDate',
          children: [
            {
              identifier: 'temporalStart',
              $formkit: 'datetime-local',
              name: 'dcat:startDate',
              property: 'dct:temporal',
              end: 'dct:temporal',
              classes:{
                outer:'w50-textfield' 
              },
            },
            {
              identifier: 'temporalEnd',
              $formkit: 'datetime-local',
              name: 'dcat:endDate',
              property: 'dct:temporal',
              start: 'dct:temporal',
              classes:{
                outer:'w50-textfield' 
              },
            },
          ],
        }
      ]
    },
    // autocomplete and multiple
    theme: {
      identifier: 'theme',
      // $formkit: 'autocomplete',
      multiple: true,
      annifTheme: true,
      voc: 'data-theme',
      name: 'dcat:theme',
      class: 'property',
      '@annifSuggestion': false,
    },
    // autocomplete
    accessRights: {
      identifier: 'accessRights',
      // $formkit: 'autocomplete',
      voc: 'access-right',
      name: 'dct:accessRights',
      class: 'property',
    },
    creator: {
      identifier: 'creator',
      $formkit: 'group',
      name: 'dct:creator',
      class: 'property',
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
          class: 'property',
          children: [
            {
              identifier: 'conformsToTitle',
              $formkit: 'text',
              name: 'rdfs:label',
              classes: {
                outer: 'w50-textfield'
              }
            },
            {
              identifier: 'conformsToUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes: {
                outer: 'w50-textfield'
              }
            },
          ],
        }
      ]
    },
    // format (autocomplete)
    page: {
      identifier: 'page',
      $formkit: 'repeatable',
      name: 'foaf:page',
      children: [
        {
          identifier: 'page',
          $formkit: 'group',
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
                  $formkit: 'group',
                  name: 'dct:title',
                  class: 'property langStringInput',
                  children: [
                    {
                      identifier: 'pageTitlelang',
                      value: 'en',
                      $formkit: 'select',
                      options: language,
                      name: '@language',
                      class: 'selectLangField',classes:{
                        outer:'w97-textfield' 
                      },
                    },
                    {
                      identifier: 'pageTitleSub',
                      $formkit: 'text',
                      name: '@value',
                      class: 'w-100 inputTextfield',
                      class: 'selectLangField',classes:{
                        outer:'w97-textfield' 
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
                  class: 'property langDescriptionInput',
                  children: [
                    {
                      identifier: 'pageDesc',
                      $formkit: 'textarea',
                      name: '@value',
                      class: 'inputTextfield w-100',
                      class: 'selectLangField',classes:{
                        outer:'w97-textfield' 
                      },
                    },
                    {
                      identifier: 'page-desc',
                      value: 'en',
                      $formkit: 'select',
                      options: language,
                      name: '@language',
                      class: 'selectLangField',
                      class: 'selectLangField',classes:{
                        outer:'w97-textfield' 
                      },
                    },
                  ]
                }
              ]
            },
            {
              identifier: 'pageFormat',
              // type: 'autocomplete',
              voc: 'file-type',
              name: 'dct:format',
              class: "property",
            },
            {
              identifier: 'pageUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              class: "property",
              classes:{
                outer:'w97-textfield' 
              },
            },
          ],
        }
      ]
    },
    // autocomplete
    accrualPeriodicity: {
      identifier: 'accrualPeriodicity',
      // $formkit: 'autocomplete',
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
          $formkit: 'group',
          identifier: 'hasVersion',
          name: 'dct:hasVersion',
          class: 'property',
          children: [
            {
              identifier: 'hasVersionUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
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
          class: 'property',
          children: [
            {
              identifier: 'isVersionOfUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
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
          class: 'property',
          children: [
            {
              name: '@id',
              identifier: 'sourceUrl',
              $formkit: 'url',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
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
          class: 'property',
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
      children: [
        {
          $formkit: 'group',
          identifier: 'isReferencedBy',
          name: 'dct:isReferencedBy',
          class: 'property',
          children: [
            {
              identifier: 'isReferencedByUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
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
          class: 'property',
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
    // autocomplete, multiple
    language: {
      identifier: 'language',
      // $formkit: 'autocomplete',
      name: 'dct:language',
      class: 'property',
      multiple: true,
      voc: 'language',
     
    },
    // identifier type using autocomplete
    admsIdentifier: {
      identifier: 'admsIdentifier',
      $formkit: 'repeatable',
      name: 'adms:identifier',
      children: [
        {
          $formkit: 'group',
          class: 'property',
          name: 'adms:identifier',
          identifier: 'admsIdentifier',
          children: [
            {
              identifier: 'admsIdentifierUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              
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
                },
                {
                  identifier: 'admsIdentifierType',
                  // type: 'autocomplete',
                  voc: 'notation-type',
                  name: '@type',
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
          class: 'property',
          children: [
            {
              identifier: 'provenance',
              $formkit: 'text',
              name: 'rdfs:label',
              classes:{
                outer:'w100-textfield' 
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
          class: 'property',
          children: [
            {
              identifier: 'qualifiedAttributionUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
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
          class: 'property',
          children: [
            {
              identifier: 'wasGeneratedByUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
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
          class: 'property',
          children: [
            {
              identifier: 'qualifiedRelationUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
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
          class: 'property',
          children: [
            {
              identifier: 'relationUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
              },
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
          id: 'issuedCond',
          'prefix-icon': "info",
          $formkit: 'select',
          name: '@type',
          options: { date: 'Date', datetime: 'Datetime' },
        },
        {
          identifier: 'issued',
          $cmp: 'FormKit',
          if: '$get(issuedCond).value',
          props: {
            if: '$get(issuedCond).value === date',
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
          id: 'modifiedCond',
          name: '@type',
          'prefix-icon': "info",
          $formkit: 'select',
          options: { date: 'Date', datetime: 'Datetime' },
        },
        {
          identifier: 'modified',
          $cmp: 'FormKit',
          if: '$get(modifiedCond).value',
         
          props: {
            name: 'dct:modified',
            if: '$get(modifiedCond).value === date',
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
      $formkit: 'number',
      name: 'dcat:spatialResolutionInMeters',
      class: 'property',
      validation: 'number',
    },
    temporalResolution: {
      identifier: 'temporalResolution',
      $formkit: 'group',
      name: 'dcat:temporalResolution',
      class: 'property tempResWrapper',
      children: [
        {
          identifier: 'temporalResolutionYear',
          $formkit: 'number',
          validation: 'min:1950|max:2100|optional',
          "validation-behavior": 'live',
          $formkit: 'number',
          validation: 'min:1950|max:2100|optional',
          "validation-behavior": 'live',
          name: 'Year',
        },
        {
          identifier: 'temporalResolutionMonth',
          $formkit: 'number',
          validation: 'min:1|max:12|optional',
          "validation-behavior": 'live',
          name: 'Month',
        },
        {
          identifier: 'temporalResolutionDay',
          $formkit: 'number',
          validation: 'min:1|max:31|optional',
          "validation-behavior": 'live',
          name: 'Day',
        },
        {
          identifier: 'temporalResolutionHour',
          $formkit: 'number',
          validation: 'min:0|max:23|optional',
          "validation-behavior": 'live',
          name: 'Hour',
        },
        {
          identifier: 'temporalResolutionMinute',
          $formkit: 'number',
          validation: 'min:0|max:59|optional',
          "validation-behavior": 'live',
          name: 'Minute',
        },
        {
          identifier: 'temporalResolutionSecond',
          $formkit: 'number',
          validation: 'min:0|max:59|optional',
          "validation-behavior": 'live',
          name: 'Second',
        },
      ],
    },
    // autocomplete
    type: {
      identifier: 'type',
      // $formkit: 'autocomplete',
      voc: 'dataset-type',
      name: 'dct:type',
      class: 'property',
    },
    versionInfo: {
      identifier: 'versionInfo',
      $formkit: 'text',
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
          $formkit: 'group',
          name: 'adms:versionNotes',
          class: 'property langDescriptionInput',
          children: [
             {
              identifier: 'language',
              value: 'en',
              $formkit: 'select',
              name: '@language',
              options: language,
              class: 'selectLangField',
              classes:{
                outer:'w50-textfield' 
              },
            },
            {
              identifier: 'versionNotes',
              $formkit: 'textarea',
              name: '@value',
              class: 'inputTextfield w-100',
              classes:{
                outer:'w50-textfield' 
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
      class: 'property mandatory',
      'prefix-icon': "info",
      validation: 'required',
      options: {},
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
          class: 'property',
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
    // fileupload, minimum
    accessURL: {
      identifier: 'accessUrl',
      $formkit: 'repeatable',
      name: 'dcat:accessURL',
      children: [
        {
          identifier: 'accessUrl',
          name: 'dcat:accessURL',
          $formkit: 'group',
          class: 'property',
          children: [
            {
              identifier: "accessUrl",
              $formkit: "select",
              id: "accessUrlMode",
              name: "accessUrlMode",
              options: { url: 'Provide an URL', file: 'Upload a file' }
            },
            {
              $cmp: "FormKit",
              if: "$get(accessUrlMode).value",
              props: {
                if: "$get(accessUrlMode).value === url",
                then: {
                  type: "url",
                  validation: "required",
                  name: "@id"
                },
                else: {
                  // type: "fileupload",
                  validation: "required",
                  name: "@id"
                }
              },
            },
          ],
        }
      ]
    },
    // autocomplete
    availability: {
      identifier: 'availability',
      // $formkit: 'autocomplete',
      voc: 'planned-availability',
      name: 'dcatap:availability',
      class: 'property',
    },
    // minimum
    description: {
      identifier: 'datasetDescription',
      $formkit: 'repeatable',
      name: 'dct:description',
      children: [
        {
          identifier: 'datasetDescription',
          $formkit: 'group',
          name: 'dct:description',
          class: 'property langDescriptionInput mandatory',
          mandatory: true,
          minimum: 1,
          children: [
            {
              identifier: 'description',
              $formkit: 'textarea',
              name: '@value',
              validation: 'required',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'descriptionLanguage',
              value: 'en',
              $formkit: 'select',
              options: language,
              validation: 'required',
              name: '@language',
              class: 'selectLangField',
            },
          ],
        }
      ]
    },
    // autocomplete
    format: {
      identifier: 'format',
      // $formkit: 'autocomplete',
      class: 'property',
      voc: 'file-type',
      name: 'dct:format',
    },
    // licence: {
    //   identifier: 'licence',
    //   $formkit:'group',
    //   name: 'dct:license',
    //   class: 'property',
    //   children: [
    //     {
    //       identifier: 'licence',
    //       $formkit: 'select',
    //       id: "licenceMode",
    //       name: 'licenceMode',
    //       options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
    //     },
    //     {
    //       $cmp: "FormKit",
    //       if: "$get(licenceMode).value",
    //       props: {
    //         if: "$get(licenceMode).value === man",
    //         then: {
    //           type: "group",
    //           children: [
    //             {
    //               identifier: 'licenceTitle',
    //               $formkit:'text',
    //               name: 'dct:title',
    //             },
    //             {
    //               identifier: 'licenceDescription',
    //               $formkit:'textarea',
    //               name: 'skos:prefLabel',
    //             },
    //             {
    //               identifier: 'licenceURL',
    //               $formkit:'custom-url',
    //               name: 'skos:exactMatch',
    //               validation: 'optional|url',
    //             },
    //           ]
    //         },
    //         else: {
    //           then: {
    //             type: "text",
    //             name: "@id"
    //           }
    //         }
    //       }

    //     }
    //   ]
    // },
    // must be a repeatbale property (repeatable and repeatableremoved), mandatory, minimum
    // repetable
    title: {
      identifier: 'title',
      $formkit: 'repeatable',
      name: 'dct:title',
      children: [
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
    // autocomplete
    mediaType: {
      identifier: 'mediaType',
      // $formkit: 'autocomplete',
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
          class: 'property',
          children: [
            {
              identifier: 'downloadUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
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
          class: 'property',
          children: [
            {
              identifier: 'accessServiceEndpointURL',
              $formkit: 'url',
              name: 'dcat:endpointURL',
              class: 'property ',
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
                  class: 'property langStringInput',
                  children: [
                     {
                      identifier: 'language',
                      value: 'en',
                      $formkit: 'select',
                      name: '@language',
                      class: 'selectLangField',
                      options: language,
                    },
                    {
                      identifier: 'title',
                      $formkit: 'text',
                      name: '@value',
                      class: 'w-100 inputTextfield',
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
                  class: 'property langDescriptionInput',
                  children: [
                    {
                      identifier: 'description',
                      $formkit: 'textarea',
                      name: '@value',
                      class: 'inputTextfield',
                    },
                    {
                      identifier: 'descriptionLanguage',
                      value: 'en',
                      $formkit: 'select',
                      name: '@language',
                      class: 'selectLangField',
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
      class: 'property',
    },
    // algorithm (autocomplete)
    checksum: {
      $formkit: 'group',
      identifier: 'checksum',
      name: 'spdx:checksum',
      class: 'property',
      children: [
        {
          identifier: 'checksum',
          $formkit: 'text',
          name: 'spdx:checksumValue',
        },
        {
          identifier: 'checksumAlgorithm',
          // type: 'autocomplete',
          voc: 'spdx-checksum-algorithm',
          name: 'spdx:algorithm',
        },
      ],
    },
    // autocomplete
    compressFormat: {
      identifier: 'compressFormat',
      // $formkit: 'autocomplete',
      voc: 'iana-media-types',
      name: 'dcat:compressFormat',
      class: 'property',
    },
    // autocomplete
    packageFormat: {
      identifier: 'packageFormat',
      // $formkit: 'autocomplete',
      voc: 'iana-media-types',
      name: 'dcat:packageFormat',
      class: 'property',
    },
    // format (autocomplete)
    page: {
      identifier: 'page',
      $formkit: 'repeatable',
      name: 'foaf:page',
      children: [
        {
          identifier: 'page',
          $formkit: 'group',
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
                  $formkit: 'group',
                  name: 'dct:title',
                  class: 'property langStringInput',
                  children: [
                    {
                      identifier: 'pageTitleSub',
                      $formkit: 'text',
                      name: '@value',
                      class: 'w-100 inputTextfield',
                    },
                    {
                      identifier: 'pageTitlelang',
                      value: 'en',
                      $formkit: 'select',
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
                  $formkit: 'group',
                  name: 'dct:description',
                  class: 'property langDescriptionInput',
                  children: [
                    {
                      identifier: 'pageDesc',
                      $formkit: 'textarea',
                      name: '@value',
                      class: 'inputTextfield w-100',
                    },
                    {
                      identifier: 'page-desc',
                      value: 'en',
                      $formkit: 'select',
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
              // type: 'autocomplete',
              voc: 'file-type',
              name: 'dct:format',
              class: "property",
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
          class: 'property',
          name: 'odrl:hasPolicy',
          children: [
            {
              identifier: 'hasPolicyUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes:{
                outer:'w100-textfield' 
              },
            },
          ],
        }
      ]
    },
    // autocomplete ,multiple
    language: {
      identifier: 'language',
      // $formkit: 'autocomplete',
      multiple: true,
      name: 'dct:language',
      voc: 'language',
      class: 'property',
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
          class: 'property',
          children: [
            {
              identifier: 'conformsToTitle',
              $formkit: 'text',
              name: 'rdfs:label',
              classes: {
                outer: 'w50-textfield'
              }
            },
            {
              identifier: 'conformsToUrl',
              $formkit: 'url',
              name: '@id',
              validation: 'optional|url',
              classes: {
                outer: 'w50-textfield'
              }
            },
          ],
        }
      ]
    },
    issued: {
      $formkit: 'group',
      name: 'dct:issued',
      children: [
        {
          identifier: 'issued',
          id: 'issuedCond',
          $formkit: 'select',
          name: '@type',

          options: { date: 'Date', datetime: 'Datetime' },
        },
        {
          identifier: 'issued',
          $cmp: 'FormKit',
          if: '$get(issuedCond).value',
          props: {
            if: '$get(issuedCond).value === date',
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
      $formkit: 'group',
      name: 'dct:modified',
      children: [
        {
          identifier: 'modified',
          id: 'modifiedCond',
          name: '@type',
          $formkit: 'select',
          options: { date: 'Date', datetime: 'Datetime' },
        },
        {
          identifier: 'modified',
          $cmp: 'FormKit',
          if: '$get(modifiedCond).value',
          props: {
            name: 'dct:modified',
            if: '$get(modifiedCond).value === date',
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
          id: "rightsMode"
        },
        {
          identifier: 'rights',
          $cmp: "FormKit",
          if: "$get(rightsMode).value",
          props: {
            name: 'rdfs:label',
            if: "$get(rightsMode).value === url",
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
    spatialResolutionInMeters: {
      identifier: 'spatialResolutionInMeters',
      $formkit: 'number',
      name: 'dcat:spatialResolutionInMeters',
      class: 'property',
      validation: 'number',
    },
    temporalResolution: {
      identifier: 'temporalResolution',
      $formkit: 'group',
      name: 'dcat:temporalResolution',
      class: 'property tempResWrapper',
      children: [
        {
          identifier: 'temporalResolutionYear',
          $formkit: 'number',
          min: 0,
          max: 2023,
          name: 'Year',
        },
        {
          identifier: 'temporalResolutionMonth',
          $formkit: 'number',
          min: 0,
          max: 12,
          name: 'Month',
        },
        {
          identifier: 'temporalResolutionDay',
          $formkit: 'number',
          min: 0,
          max: 31,
          name: 'Day',
        },
        {
          identifier: 'temporalResolutionHour',
          $formkit: 'number',
          min: 0,
          max: 23,
          name: 'Hour',
        },
        {
          identifier: 'temporalResolutionMinute',
          $formkit: 'number',
          min: 0,
          max: 59,
          name: 'Minute',
        },
        {
          identifier: 'temporalResolutionSecond',
          $formkit: 'number',
          min: 0,
          max: 59,
          name: 'Second',
        },
      ],
    },
    // autocomplete
    type: {
      identifier: 'type',
      // $formkit: 'autocomplete',
      voc: 'distribution-type',
      name: 'dct:type',
      class: 'property',
    },
    // autocomplete
    status: {
      identifier: 'status',
      // $formkit: 'autocomplete',
      voc: 'dataset-status',
      name: 'adms:status',
      class: 'property',
    },
  },
  catalogues: {
    // dataset id component, mandatory
    datasetID: {
      identifier: 'datasetID',
      // $formkit:'unique-identifier-input',
      name: 'datasetID',
      class: 'property',
      mandatory: true,
    },
    // minimum
    title: {
      identifier: 'title',
      $formkit: 'repeatable',
      name: 'dct:title',
      children: [
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
    // minimum
    description: {
      identifier: 'datasetDescription',
      $formkit: 'repeatable',
      name: 'dct:description',
      children: [
        {
          identifier: 'datasetDescription',
          $formkit: 'group',
          name: 'dct:description',
          class: 'property langDescriptionInput mandatory',
          mandatory: true,
          minimum: 1,
          children: [
            {
              identifier: 'description',
              $formkit: 'textarea',
              name: '@value',
              validation: 'required',
              class: 'w-100 inputTextfield',
            },
            {
              identifier: 'descriptionLanguage',
              value: 'en',
              $formkit: 'select',
              options: language,
              validation: 'required',
              name: '@language',
              class: 'selectLangField',
            },
          ],
        }
      ]
    },
    // autocomplete
    publisher: {
      identifier: 'publisher',
      name: 'dct:publisher',
      class: 'property',
      // $formkit:'autocomplete',
      voc: 'corporate-body',
    },
    // autocomplete ,multiple
    language: {
      identifier: 'language',
      // $formkit: 'autocomplete',
      multiple: true,
      name: 'dct:language',
      voc: 'language',
      class: 'property',
    },
    // licence: {
    //   identifier: 'licence',
    //   $formkit:'group',
    //   name: 'dct:license',
    //   class: 'property',
    //   children: [
    //     {
    //       identifier: 'licence',
    //       $formkit: 'select',
    //       id: "licenceMode",
    //       name: 'licenceMode',
    //       options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
    //     },
    //     {
    //       $cmp: "FormKit",
    //       if: "$get(licenceMode).value",
    //       props: {
    //         if: "$get(licenceMode).value === voc",
    //         then: {
    //           type: "group",
    //           children: [
    //             {
    //               identifier: 'licenceTitle',
    //               $formkit:'text',
    //               name: 'dct:title',
    //             },
    //             {
    //               identifier: 'licenceDescription',
    //               $formkit:'textarea',
    //               name: 'skos:prefLabel',
    //             },
    //             {
    //               identifier: 'licenceURL',
    //               $formkit:'custom-url',
    //               name: 'skos:exactMatch',
    //               validation: 'optional|url',
    //             },
    //           ]
    //         },
    //         else: {
    //           then: {
    //             type: "text",
    //             name: "@id"
    //           }
    //         }
    //       }

    //     }
    //   ]
    // },
    // repetabale 
    spatial: {
      $formkit: 'group',
      name: 'dct:spatial',
      identifier: 'spatial',
      children: [
        {
          $formkit: "select",
          identifier: "spatial",
          id: "spatialMode",
          name: "spatialMode",
          options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
        },
        {
          $cmp: "FormKit",
          identifier: "spatial",
          if: "$get(spatialMode).value",
          props: {
            type: "radio",
            name: "vocabulary",
            id: "vocabulary",
            if: "$get(spatialMode).value === man",
            options: {
              if: "$get(spatialMode).value === voc",
              then: [
                { value: "continent", label: "Continent" },
                { value: "country", label: "Country" },
                { value: "place", label: "Place" }
              ],
              else: {
                if: "$get(spatialMode).value === man",
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
          if: "$get(vocabulary).value",
          props: {
            identifier: "spatial",
            if: "$get(vocabulary).value === other",
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
      $formkit: 'url',
      name: 'foaf:homepage',
      class: 'property',
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
          class: 'property',
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
      class: 'property',
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
          id: "rightsMode"
        },
        {
          identifier: 'rights',
          $cmp: "FormKit",
          if: "$get(rightsMode).value",
          props: {
            name: 'rdfs:label',
            if: "$get(rightsMode).value === url",
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
          class: 'property',
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
      class: 'property',
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
