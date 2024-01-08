import language from '../selector-languages.json';
import config from './page-content-config';

const dcatapProperties = {
  datasets: {
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
      name:'dcatde:politicalGeocodingURI',
      children: [
        {
          identifier: 'politicalGeocodingURI',
          type: "group",
          name: 'dcatde:politicalGeocodingURI',
          class: 'property',
          children: [
            {
              identifier: "politicalGeocodingURI",
              $formkit: "select",
              id: "geocodingMode",
              name: 'dcatde:politicalGeocodingURI',
              options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
            },
            {
              $cmp: "FormKit",
              if: "$get(geocodingMode).value",
              props: {
                if: "$get(geocodingMode).value === voc",
                then: {
                  type: "radio",
                  id: "geocodingVoc",
                  name: 'geocodingVoc',
                  options: { municipalityKey: 'Municipality Key', regionalKey: 'Regional Key', municipalAssociationKey: 'Municipal Association Key', districtKey: 'District Key',
                  governmentDistrictKey: 'Government District Key', stateKey: 'State Key'}
                },
                else: {
                  then: {
                    type: "radio",
                    id: "geocodingVoc",
                    name: 'geocodingVoc',
                    options: { other: "Other"}
                  }
                }

              }
            },
            {
              $cmp: "FormKit",
              if: "$get(geocodingVoc).value",
              props: {
                if: "$get(geocodingVoc).value === other",
                then: {
                  identifier: 'politicalGeocodingURI',
                  $formkit: "url",
                  name: '@id'
                },
                else: {
                  then: {
                    identifier: 'politicalGeocodingURI',
                    $formkit: "auto",
                    name: '@id',
                    voc: ""
                  }
                }
              }
            }
          ]
        }
      ]
    },
    availabilityDE: {
      identifier: 'availabilityDE',
      $formkit: 'auto',
      name: 'dcatap:availability',
      class: 'property',
      voc: 'planned-availability',
    },
    // minimum
    geocodingDescription: {
      identifier: 'geocodingDescription',
      $formkit:'repeatable',
      name: 'dcatde:geocodingDescription',
      children: [
        {
          identifier: 'geocodingDescription',
          type: 'group',
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
    // minimum
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
      type: 'url',
    },
    // ???? autocomplete or url
    references: {
      identifier: 'references',
      name: 'dct:references',
      $formkit: 'repeatable',
      children: [
        {
          identifier: 'references',
          name: 'dct:references',
          class: 'property',
          type: 'url',
          voc: 'planned-availability',
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
      $formkit: 'repetable',
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
      $formkit: 'repetable',
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
    // unique identifier component
    datasetID: {
      identifier: 'datasetID',
      type:'unique-identifier-input',
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
    // minimum (unability to remove fields to 0)
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
      name: 'dct:keyword',
      children: [
        {
          identifier: 'keywordHeader',
          $formkit:'group',
          name: 'dct:keyword',
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
          id: 'publishereMode',
          options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(publisherMode).value',
          if: '$get(publisherMode).value === "voc"',
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
          key: '$get(publisherMode).value',
          if: '$get(publisherMode).value === "man"',
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
          $formkit:'group',
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
                    { value: "place", label: "Place"}
                  ],
                  else: {
                    if: "$get(spatialMode).value === man",
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
          $formkit:'group',
          class: 'property',
          name: 'adms:identifier',
          identifier: 'admsIdentifier',
          children: [
            {
              identifier: 'admsIdentifierUrl',
              $formkit:'url',
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
                  $formkit: 'auto',
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
          id: 'issuedCond',
          $formkit: 'select',
          name: '@type',
          options: {date: 'Date', datetime: 'Datetime'},
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
          $formkit: 'select',
          options: {date: 'Date', datetime: 'Datetime'},
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
    // minimum
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
      name: 'dcat:accessURL',
      $formkit: 'repeatable',
      children: [
        {
          identifier: 'accessUrl',
          name: 'dcat:accessURL',
          $formkit:'group',
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
                  $formkit: "fileupload",
                  validation: "required",
                  name: "@id"
                }
              },
            },
          ],
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
    // minimum
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
    license: {
      identifier: 'licence',
      $formkit: 'auto',
      name: 'dct:license',
      '@change': true,
      class: 'property',
      voc: 'licenses'
    },
    // minimum
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
      $formkit:'repeatable',
      identifier: 'downloadUrl',
      name: 'dcat:downloadURL',
      class: 'property',
      children: [
        {
          identifier: 'downloadUrl',
          $formkit:'url',
          name: '@id',
          validation: 'optional|url',
        },
      ],
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
      $formkit: 'group',
      name: 'dct:issued',
      children: [
        {
          identifier: 'issued',
          id: 'issuedCond',
          $formkit: 'select',
          name: '@type',
          options: {date: 'Date', datetime: 'Datetime'},
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
          options: {date: 'Date', datetime: 'Datetime'},
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
      $formkit:'group',
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
    // minimum
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
          id: 'publishereMode',
          options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(publisherMode).value',
          if: '$get(publisherMode).value === "voc"',
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
          key: '$get(publisherMode).value',
          if: '$get(publisherMode).value === "man"',
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
          id: 'licenceMode',
          options: { voc: 'Choose from vocabulary', man: 'Manually submit information' }
        },
        {
          $formkit: 'group',
          name: 'details',
          key: '$get(licenceMode).value',
          if: '$get(licenceMode).value === "voc"',
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
          key: '$get(licenceMode).value',
          if: '$get(licenceMode).value === "man"',
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
                { value: "place", label: "Place"}
              ],
              else: {
                if: "$get(spatialMode).value === man",
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
