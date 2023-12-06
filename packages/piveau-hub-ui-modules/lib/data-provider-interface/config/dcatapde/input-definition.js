import language from '../selector-languages.json';
import config from './page-content-config';

const dcatapProperties = {
  datasets: {
    // Dcatap.de Properties #### Start ####
    // autocomplete, custom event (dcatDE), multiple
    politicalGeocodingLevelURI: {
      identifier: 'politicalGeocodingLevelURI',
      // $formkit: 'autocomplete-input',
      name: 'dcatde:politicalGeocodingLevelURI',
      class: 'property',
      voc: 'political-geocoding-level',
      multiple: true,
    },
    // repetable, autocomplete
    politicalGeocodingURI: {
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
                // $formkit: "autocomplete",
                name: '@id',
                voc: ""
              }
            }
          }
        }
      ]
    },
    // autocomplte, custom event (dcatDE)
    availabilityDE: {
      identifier: 'availabilityDE',
      // $formkit: 'autocomplete-input',
      name: 'dcatap:availability',
      class: 'property',
      voc: 'planned-availability',
    },
    // repetable, custom event (dcatDE), minimum
    geocodingDescription: {
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
    },
    // repetable, minimum, custom event /dcatDE)
    legalBasis: {
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
    },
    // done
    qualityProcessURI: {
      identifier: 'qualityProcessURI',
      name: 'dcatde:qualityProcessURI',
      class: 'property',
      type: 'url',
    },
    // ????
    references: {
      identifier: 'references',
      name: 'dct:references',
      class: 'property',
      type: 'url',
      voc: 'planned-availability',
    },
    // repetable, custom event (dcatDE)
    contributor: {
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
    },
    // autocomplete, multiple, cusom event (dcatDE)
    contributorID: {
      identifier: 'contributorID',
      // $formkit: 'autocomplete-input',
      name: 'dcatde:contributorID',
      class: 'property',
      voc: 'contributors',
      multiple: true,
    },
    // repetable, custom event (dcatDE)
    originator: {
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
    },
    // repetable, custom event (dcatDE)
    maintainer: {
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
    },
    // Dcatap.de Properties #### End ####
    // unique identifier component
    datasetID: {
      identifier: 'datasetID',
      // type:'unique-identifier-input',
      mandatory: true,
      name: 'datasetID',
      class: 'property mandatory',
    },
    // must be a repeatbale property (repeatable and repeatableremoved), mandatory, minimum
    description: {
      identifier: 'datasetDescription',
      $formkit:'group',
      name: 'dct:description',
      class: 'property langDescriptionInput mandatory',
      mandatory: true,
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
    // must be a repeatbale property (repeatable and repeatableremoved), mandatory, minimum
    title: {
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
    },
    // repeatable and repetable removed, url
    contactPoint: {
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
        // {
        //   identifier: 'contactPointUrl',
        //   $formkit:'custom-url',
        //   name: 'vcard:hasURL',
        //   validation: 'optional|url',
        // },
        {
          identifier: 'contactPointOrganisationName',
          $formkit:'text',
          name: 'vcard:hasOrganizationName',
        },
      ],
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
    // must be a repeatbale property (repeatable and repeatableremoved)
    keyword: {
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
    },
    // publisher: {
    //   identifier: 'publisher',
    //   name: 'dct:publisher',
    //   class: 'property',
    //   type: 'conditional-input',
    //   '@change': true,
    //   options: {voc: 'Search Vocabulary', man: 'Manually submit information'},
    //   data: {
    //     voc: [
    //       {
    //         identifier: 'publisher',
    //         type: 'autocomplete-input',
    //         name: '@id',
    //         voc: 'corporate-body',
    //         '@change': true,
    //       }
    //     ],
    //     man: [
    //       {
    //         identifier: 'publisher',
    //         type: 'group',
    //         name: 'dct:publisher',
    //         '@change': true,
    //         children: [
    //           {
    //             identifier: 'publisherName',
    //             type: 'text',
    //             name: 'foaf:name',
    //             '@change': true,
    //           },
    //           {
    //             identifier: 'publisherEmail',
    //             type: 'email',
    //             name: 'foaf:mbox',
    //             '@change': true,
    //           },
    //           {
    //             identifier: 'publisherHomepage',
    //             type: 'custom-url',
    //             name: 'foaf:homepage',
    //             '@change': true,
    //           }
    //         ]
    //       }
    //     ],
    //   }
    // },
    // repetable
    spatial: {
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
    },
    // repeatable
    temporal: {
      $formkit:'group',
      name: 'dct:temporal',
      identifier: 'temporal',
      class: 'property besides startEndDate',
      children: [
        {
          identifier: 'temporalStart',
          $formkit:'datetime-local',
          name: 'dcat:startDate',
          property:'dct:temporal',
          end: 'dct:temporal',
        },
        {
          identifier: 'temporalEnd',
          $formkit:'datetime-local',
          name: 'dcat:endDate',
          property:'dct:temporal',
          start: 'dct:temporal',
        },
      ],
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
    // homepage custom-url
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
        // {
        //   identifier: 'creatorHomepage',
        //   $formkit:'custom-url',
        //   name: 'foaf:homepage',
        //   validation: 'optional|url',
        // },
      ],
    },
    // repetable
    conformsTo: {
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
    },
    // repetable, format (autocomplete)
    page: {
      // repetable
      identifier: 'page',
      $formkit:'group',
      name: 'foaf:page',
      class: 'property',
      children: [
        {
          // repetable
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
        },
        {
          // repetable
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
          $formkit:'url',
          name: '@id',
          validation: 'optional|url',
          class: "property",
        },
      ],
    },
    // autocomplete
    accrualPeriodicity: {
      identifier: 'accrualPeriodicity',
      // $formkit: 'autocomplete',
      voc: 'frequency',
      name: 'dct:accrualPeriodicity',
      class: 'property',
    },
    // repetable 
    hasVersion: {
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
    },
    // repetabale
    isVersionOf: {
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
    },
    // repetable
    source: {
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
    },
    // repeatable and repeatable removed
    identifier: {
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
    },
    // repetable
    isReferencedBy: {
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
    },
    // repetable and repetabel removed
    landingPage: {
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
    // repeatable and repeatable removed, identifier type using autocomplete
    admsIdentifier: {
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
              // type: 'autocomplete',
              voc: 'notation-type',
              name: '@type',
            },
          ],
        },
      ],
    },
    // repeatable and repeteabale removed
    provenance: {
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
    },
    // repetable
    qualifiedAttribution: {
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
    },
    // repetable
    wasGeneratedBy: {
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
    },
    // repetable
    qualifiedRelation: {
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
    },
    // repetable
    relation: {
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
    },
    // done
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
    // done
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
    // done
    spatialResolutionInMeters: {
      identifier: 'spatialResolutionInMeters',
      $formkit:'number',
      name: 'dcat:spatialResolutionInMeters',
      class: 'property',
      validation: 'number',
    },
    // done
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
    // autocomplete
    type: {
      identifier: 'type',
      // $formkit: 'autocomplete',
      voc: 'dataset-type',
      name: 'dct:type',
      class: 'property',
    },
    // done
    versionInfo: {
      identifier: 'versionInfo',
      $formkit:'text',
      name: 'owl:versionInfo',
      class: 'property',
    },
    // repeatable and repetabale removed
    versionNotes: {
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
    },
    // done (mandatory?)
    catalog: {
      identifier: 'catalog',
      $formkit:'select',
      name: 'dcat:catalog',
      class: 'property mandatory',
      validation: 'required',
      mandatory: true,
      options: {},
    },
    // repeatable
    isUsedBy: {
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
    },
  },
  distributions: {
    // repetable, event (dcatDE), minimum
    licenseAttributionByText: {
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
    },
    // fileupload, mandatory, repetable
    accessURL: {
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
              // type: "fileupload",
              validation: "required",
              name: "@id"
            }
          },
        },
      ],
    },
    // autocomplete
    availability: {
      identifier: 'availability',
      // $formkit: 'autocomplete',
      voc: 'planned-availability',
      name: 'dcatap:availability',
      class: 'property',
    },
    // must be a repeatbale property (repeatable and repeatableremoved), mandatory, minimum
    description: {
      identifier: 'datasetDescription',
      $formkit:'group',
      name: 'dct:description',
      class: 'property langDescriptionInput mandatory',
      mandatory: true,
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
    // autocomplete
    format: {
      identifier: 'format',
      // $formkit: 'autocomplete',
      class: 'property',
      voc: 'file-type',
      name: 'dct:format',
    },
    // autocomplete
    license: {
      identifier: 'licence',
      // $formkit: 'autocomplete-input',
      name: 'dct:license',
      '@change': true,
      class: 'property',
      voc: 'licenses'
    },
    // must be a repeatbale property (repeatable and repeatableremoved), mandatory, minimum
    title: {
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
    },
    // autocomplete
    mediaType: {
      identifier: 'mediaType',
      // $formkit: 'autocomplete',
      voc: 'iana-media-types',
      name: 'dcat:mediaType',
      class: 'property',
    },
    // repetable
    downloadUrl: {
      $formkit:'group',
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
    // event trigger (dcatDE)
    availabilityDisDE: {
      identifier: 'availabilityDisDE',
      // $formkit: 'autocomplete-input',
      name: 'dcatap:availability',
      class: 'property',
      voc: 'planned-availability',
    },
    //repetable
    accessService: {
      identifier: 'accessService',
      $formkit:'group',
      name: 'dcat:accessService',
      class: 'property',
      children: [
        {
          identifier: 'accessServiceEndpointURL',
          $formkit:'url',
          name: 'dcat:endpointURL',
          class: 'property ',
          validation: 'optional|url',
        },
        {
          // repetable
          identifier: 'accessServiceTitle',
          $formkit:'group',
          name: 'dct:title',
          class: 'property langStringInput',
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
          // repetable
          identifier: 'accessServiceDescription',
          $formkit:'group',
          name: 'dct:description',
          class: 'property langDescriptionInput',
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
    // done
    byteSize: {
      identifier: 'byteSize',
      $formkit:'text',
      name: 'dcat:byteSize',
      class: 'property',
    },
    // algorithm (autocomplete)
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
    // repetable, format (autocomplete)
    page: {
      // repetable
      identifier: 'page',
      $formkit:'group',
      name: 'foaf:page',
      class: 'property',
      children: [
        {
          // repetable
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
        },
        {
          // repetable
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
          $formkit:'url',
          name: '@id',
          validation: 'optional|url',
          class: "property",
        },
      ],
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
    // repetable
    conformsTo: {
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
    },
    // done
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
    // done
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
    // done
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
    //done
    spatialResolutionInMeters: {
      identifier: 'spatialResolutionInMeters',
      $formkit:'number',
      name: 'dcat:spatialResolutionInMeters',
      class: 'property',
      validation: 'number',
    },
    // done
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
    // autocomplete, custom event (dcatDE)
    availabilityCatDE: {
      identifier: 'availabilityCatDE',
      // $formkit: 'autocomplete-input',
      name: 'dcatap:availability',
      class: 'property',
      voc: 'planned-availability',
    },
    // dataset id component, mandatory
    datasetID: {
      identifier: 'datasetID',
      // $formkit:'unique-identifier-input',
      name: 'datasetID',
      class: 'property',
      mandatory: true,
    },
    // must be a repeatbale property (repeatable and repeatableremoved), mandatory, minimum
    title: {
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
    },
    // must be a repeatbale property (repeatable and repeatableremoved), mandatory, minimum
    description: {
      identifier: 'datasetDescription',
      $formkit:'group',
      name: 'dct:description',
      class: 'property langDescriptionInput mandatory',
      mandatory: true,
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
    // publisher: {
    //   identifier: 'publisher',
    //   name: 'dct:publisher',
    //   class: 'property',
    //   type: 'conditional-input',
    //   validation: 'required',
    //   '@change': true,
    //   options: {voc: 'Search Vocabulary', man: 'Manually submit information'},
    //   data: {
    //     voc: [
    //       {
    //         identifier: 'publisher',
    //         type: 'autocomplete-input',
    //         name: '@id',
    //         voc: 'corporate-body',
    //         '@change': true,
    //       }
    //     ],
    //     man: [
    //       {
    //         identifier: 'publisher',
    //         type: 'group',
    //         name: 'dct:publisher',
    //         '@change': true,
    //         children: [
    //           {
    //             identifier: 'publisherName',
    //             type: 'text',
    //             name: 'foaf:name',
    //             '@change': true,
    //           },
    //           {
    //             identifier: 'publisherEmail',
    //             type: 'email',
    //             name: 'foaf:mbox',
    //             '@change': true,
    //           },
    //           {
    //             identifier: 'publisherHomepage',
    //             type: 'custom-url',
    //             name: 'foaf:homepage',
    //             '@change': true,
    //           }
    //         ]
    //       }
    //     ],
    //   }
    // },
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
    //   type: 'conditional-input',
    //   name: 'dct:license',
    //   '@change': true,
    //   class: 'property',
    //   options: {
    //     voc: 'Choose from vocabulary',
    //     man: 'Manually submit information',
    //   },
    //   data: {
    //     voc: [
    //       {
    //         identifier: 'licenceVocabulary',
    //         type: 'autocomplete-input',
    //         voc: 'licence',
    //         name: '@id',
    //         '@change': true,
    //       },
    //     ],
    //     man: [
    //       {
    //         identifier: 'licenceDetails',
    //         type: 'group',
    //         name: 'dct:license',
    //         '@change': true,
    //         children: [
    //           {
    //             identifier: 'licenceTitle',
    //             type: 'text',
    //             name: 'dct:title',
    //             '@change': true,
    //           },
    //           {
    //             identifier: 'licenceDescription',
    //             type: 'textarea',
    //             name: 'skos:prefLabel',
    //             '@change': true,
    //           },
    //           {
    //             identifier: 'licenceURL',
    //             type: 'custom-url',
    //             name: 'skos:exactMatch',
    //             validation: 'optional|url',
    //             '@change': true,
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
    // repetabale 
    spatial: {
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
    },
    // done
    homepage: {
      identifier: 'homepage',
      $formkit:'url',
      name: 'foaf:homepage',
      class: 'property',
      validation: 'optional|url',
    },
    // repetable
    hasPart: {
      $formkit:'group',
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
    // done
    isPartOf: {
      identifier: 'isPartOf',
      name: 'dct:isPartOf',
      class: 'property',
      $formkit:'url',
      validation: 'optional|url',
    },
    // done
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
    // repetable
    catalog: {
      $formkit:'group',
      identifier: 'catalog',
      name: 'dcat:catalog',
      class: 'property',
      children: [
        {
          identifier: 'catalogURL',
          $formkit:'url',
          validation: 'optional|url',
          name: '@id',
        },
      ],
    },
    // homepage custom-url
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
        // {
        //   identifier: 'creatorHomepage',
        //   $formkit:'custom-url',
        //   name: 'foaf:homepage',
        //   validation: 'optional|url',
        // },
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
