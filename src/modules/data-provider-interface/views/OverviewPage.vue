<template>
  <div class="col-12">
    <div class="mb-3" v-if="showDatasetsOverview">

      <!-- DATASET ID && CATALOG -->
      <div class="mt-5 mb-0" >
        <div class="row">

          <!-- DATASET ID -->
          <div class="col-5 offset-1" v-if="showProperty('datasets', '@id')">
            <p class="mb-0">Dataset ID: {{ getString('datasets', '@id') }}</p>
          </div>

          <!-- CATALOG -->
          <div class="col-5 offset-1" v-if="showProperty('datasets', 'dct:catalog')">
            <p class="mb-0">Catalog: {{ getString('datasets', 'dct:catalog') }}</p>
          </div>
        </div>
        <hr>
      </div>

      <!-- TITLE -->
      <div class="mt-2 mb-4" v-if="showLanguageArray('datasets', 'dct:title')">
        <div class="row">
          <div class="col-8 offset-1">
            <h2 v-for="(title, index) in getLanguageArray('datasets', 'dct:title')" :key="index">
              {{ languageNames[title['@language']] }}: {{ title['@value'] }}
            </h2>
          </div>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="mt-2" v-if="showLanguageArray('datasets', 'dct:description')">
        <div class="row">
          <div class="col-10 offset-1">
            <p v-for="(description, index) in getLanguageArray('datasets', 'dct:description')" :key="index">
              {{ languageNames[description['@language']] }}: {{ description['@value'] }}
            </p>
          </div>
        </div>
        <hr>
      </div>

      <!-- DISTRIBUTIONS -->
      <div class="mt-2">
        <div class="row">
          <div class="col-12">
            <div class="row">
              <div class="col-10 offset-1 py-2 text-left">
                <h2>{{ $t('message.metadata.distributions') }} ({{ values.distributions.length }})</h2>
              </div>
              <ul class="list list-unstyled col-12" v-if="showDistributions">
                <li class="row" v-for="(distribution, i) in getDistributions" :key="`distribution${i+1}`">
                  <!-- DISTRIBUTIONS FORMAT -->
                  <span class="d-inline-block col-md-1 col-2 pt-3 pr-md-1 pr-0 m-md-0 m-auto">
                    <div v-if="showDistributionProperty(distribution, 'dct:format')" class="circle float-md-right text-center text-white text-truncate"
                         :type="getDistributionFormat(distribution)"
                         :title="getDistributionFormat(distribution)">
                      <span>
                        {{ truncate(getDistributionFormat(distribution), 4, true) }}
                      </span>
                    </div>
                    <div v-else class="circle float-md-right text-center text-white text-truncate" type="UNKNOWN" title="UNKNOWN"><span>UNKNOWN</span></div>
                  </span>
                  <span class="col-10">
                    <span class="row">
                      <span class="d-inline-block col-md-8 col-12">
                        <!-- DISTRIBUTIONS TITLE -->
                        <span v-if="showDistributionProperty(distribution, 'dct:title')">
                          <h6 class="font-weight-bold m-0" v-for="(title, index) in getDistributionLanguageArray(distribution, 'dct:title')" :key="index">
                            {{ languageNames[title['@language']] }}: {{ title['@value'] }}
                          </h6>
                        </span>
                        <!-- DISTRIBUTIONS DESCRIPTION -->
                        <span class="mt-2 text-muted text-truncate" v-if="showDistributionProperty(distribution, 'dct:description')">
                          <small v-for="(description, index) in getDistributionLanguageArray(distribution, 'dct:description')" :key="index">
                            {{ languageNames[description['@language']] }}: {{ description['@value'] }}
                          </small>
                        </span>
                      </span>
                      <span class="d-inline-block col-md-4 col-12">
                        <!-- DISTRIBUTIONS ACCESS URL -->
                        <span class="mt-2" v-if="showDistributionProperty(distribution, 'dcat:accessURL')">
                          <h6 v-for="(accessURL, index) in getDistributionObjectArray(distribution, 'dcat:accessURL')" :key="index">
                            {{ $t('message.metadata.accessUrl') }}: <a :href="accessURL['@id']">{{ accessURL['@id'] }}</a>
                          </h6>
                        </span>
                      </span>
                      <span class="d-inline-block col-12 mt-2">
                        <!-- DISTRIBUTIONS DATA SERVICE -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dcat:accessService')">
                          <span class="d-block">
                            <div v-for="(accessService, index) in getDistributionObjectArray(distribution, 'dcat:accessService')" :key="index">
                              <div><small v-for="(title, index) in getDistributionLanguageArray(accessService, 'dct:title')" :key="index">
                                {{ languageNames[title['@language']] }}: {{ title['@value'] }}
                              </small></div>
                              <div><small v-for="(description, index) in getDistributionLanguageArray(accessService, 'dct:description')" :key="index">
                                {{ languageNames[description['@language']] }}: {{ description['@value'] }}
                              </small></div>
                              <div><small v-if="showObjectElementValue(accessService, 'dcat:endpointURL', '@id')" class="pr-1">
                                <a :href="getDistributionProperty(accessService, 'dcat:endpointURL', '@id')">{{ getDistributionProperty(accessService, 'dcat:endpointURL', '@id') }}</a>
                              </small></div>
                            </div>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS DOWNLOAD URL -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dcat:downloadURL')">
                          <span class="d-block">
                            <div v-for="(downloadURL, index) in getDistributionObjectArray(distribution, 'dcat:downloadURL')" :key="index">
                              <small v-if="showElementValue(downloadURL, '@id')" class="pr-1">
                                {{ $t('message.metadata.downloadUrl') }}: <a :href="downloadURL['@id']">{{ downloadURL['@id'] }}</a>
                              </small>
                            </div>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS LICENSE -->
                        <span class="mt-2 text-left"  v-if="showDistributionProperty(distribution, 'dct:license')">
                          <small>{{ $t('message.metadata.license') }} : {{ getDistributionProperty(distribution, 'dct:license', '@id') }}</small>
                        </span>
                        <!-- DISTRIBUTIONS ISSUED -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dct:issued')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.created') }} : {{ filterDateFormatEU(getDistributionProperty(distribution, 'dct:issued', '@value')) }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS MODIFIED -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dct:modified')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.updated') }} : {{ filterDateFormatEU(getDistributionProperty(distribution, 'dct:modified', '@value')) }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS TYPE -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dct:type')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.type') }} : {{ getDistributionProperty(distribution, 'dct:type', '@id') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS MEDIA TYPE -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dcat:mediaType')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.mediaType') }} : {{ getDistributionProperty(distribution, 'dcat:mediaType', '@id') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS AVAILABILITY -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dcat:availability')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.availability') }} : {{ getDistributionProperty(distribution, 'dcat:availability', '@id') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS BYTE SIZE -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dcat:byteSize')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.byteSize') }} : {{ getDistributionString(distribution, 'dcat:byteSize') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS PACKAGE FORMAT -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dcat:packageFormat')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.packageFormat') }} : {{ getDistributionProperty(distribution, 'dcat:packageFormat', '@id') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS COMPRESS FORMAT -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dcat:compressFormat')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.compressFormat') }} : {{ getDistributionProperty(distribution, 'dcat:compressFormat', '@id') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS STATUS -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'adms:status')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.status') }} : {{ getDistributionProperty(distribution, 'adms:status', '@id') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS SPATIAL RESOLUTION IN METERS -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dcat:spatialResolutionInMeters')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.spatialResolutionInMeters') }} : {{ getDistributionProperty(distribution, 'dcat:spatialResolutionInMeters', '@value') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS TEMPORAL RESOLUTION -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dcat:temporalResolution')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.temporalResolution') }} : {{ getDistributionProperty(distribution, 'dcat:temporalResolution', '@value') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS CONFORMS TO -->
                        <!-- <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dct:conformsTo')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.conformsTo') }} : {{ getDistributionProperty(distribution, 'dct:conformsTo', '@id') }}</small>
                          </span>
                        </span> -->
                        <!-- DISTRIBUTIONS LANGUAGE -->
                        <!-- <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dct:language')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.language') }} : {{ getDistributionProperty(distribution, 'dct:language', '@id') }}</small>
                          </span>
                        </span> -->
                        <!-- DISTRIBUTIONS RIGHTS -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'dct:rights')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.rights') }} : {{ getDistributionProperty(distribution, 'dct:rights', '@id') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS PAGE -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'foaf:page')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.page') }} : {{ getDistributionProperty(distribution, 'foaf:page', '@id') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS HAS POLICY -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'odrl:hasPolicy')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.hasPolicy') }} : {{ getDistributionProperty(distribution, 'odrl:hasPolicy', '@id') }}</small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS CHECKSUM -->
                        <span class="mt-2 text-left" v-if="showDistributionProperty(distribution, 'spdx:checksum')">
                          <span class="d-block">
                            <small class="pr-1">{{ $t('message.metadata.checksum') }} : {{ getDistributionProperty(distribution, 'spdx:checksum', '@id') }}</small>
                          </span>
                        </span>
                      </span>
                    </span>
                    <hr>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- KEYWORDS -->
      <div class="mt-2" v-if="showLanguageArray('datasets', 'dcat:keyword')">
        <div class="row">
          <div class="col-10 offset-1">
            <div class="row">
              <span class="col-4 col-sm-3 col-md-2 mt-md-0 mt-3 pr-0" v-for="(keyword, index) in getLanguageArray('datasets', 'dcat:keyword')" :key="index">
                <small class="d-inline-block w-100 p-2 ml-1 rounded-pill text-center text-white text-truncate bg-primary" :title="keyword['@value']">
                  {{ languageNames[keyword['@language']] }}: {{ keyword['@value'] }}
                </small>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- INFO TABLE -->
      <div class="mt-5" v-if="showTable">
        <div class="row">
          <div class="col-10 offset-1 py-2 bg-white">
            <h2 class="heading">{{ $t('message.datasetDetails.additionalInfo') }}</h2>
          </div>
          <div class="col-10 offset-1">
            <table class="table table-borderless table-responsive pl-3 bg-light">

              <!-- PUBLISHER -->
              <tr v-if="showProperty('datasets', 'dct:publisher')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.publisher') }}</td>
                <td>{{ getObjectString('datasets', 'dct:publisher', '@id') }}</td>
              </tr>

              <!-- CONTACT POINT -->
              <tr v-if="showProperty('datasets', 'dcat:contactPoint')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.contactPoints') }}</td>
                <td v-if="showObjectArray('datasets', 'dcat:contactPoint')">
                  <div v-for="(contactPoint, index) in getObjectArray('datasets', 'dcat:contactPoint')" :key="index">
                    <div v-if="showElementValue(contactPoint, '@type')">
                      {{ $t('message.metadata.type') }}: {{ contactPoint['@type'] }}
                    </div>
                    <div v-if="showElementValue(contactPoint, 'vcard:fn')">
                      {{ $t('message.metadata.name') }}: {{ contactPoint['vcard:fn'] }}
                    </div>
                    <div v-if="showObjectElementValue(contactPoint, 'vcard:hasEmail', '@id')">
                      {{ $t('message.metadata.email') }}: <app-link :to="`mailto:${contactPoint['vcard:hasEmail']['@id']}`">{{ contactPoint['vcard:hasEmail']['@id'] }}</app-link>
                    </div>
                    <div v-if="showElementValue(contactPoint, 'vcard:hasOrganizationName')">
                      {{ $t('message.metadata.organizationName') }}: {{ contactPoint['vcard:hasOrganizationName'] }}
                    </div>
                    <div v-if="showElementValue(contactPoint, 'vcard:hasTelephone')">
                      {{ $t('message.metadata.telephone') }}: {{ contactPoint['vcard:hasTelephone'] }}
                    </div>
                    <div v-if="showObjectElementValue(contactPoint, 'vcard:hasURL', '@id')">
                      {{ $t('message.metadata.url') }}: <app-link :to="contactPoint['vcard:hasURL']['@id']">{{ contactPoint['vcard:hasURL']['@id'] }}</app-link>
                    </div>
                    <div v-if="showObjectElementValue(contactPoint, 'vcard:hasAddress', 'vcard:street_address')
                            || showObjectElementValue(contactPoint, 'vcard:hasAddress', 'vcard:postal_code')
                            || showObjectElementValue(contactPoint, 'vcard:hasAddress', 'vcard:locality')
                            || showObjectElementValue(contactPoint, 'vcard:hasAddress', 'vcard:country_name')">
                      {{ $t('message.metadata.address') }}: {{ contactPoint['vcard:hasAddress']['vcard:street_address'] }},
                                                            {{ contactPoint['vcard:hasAddress']['vcard:postal_code'] }}
                                                            {{ contactPoint['vcard:hasAddress']['vcard:locality'] }},
                                                            {{ contactPoint['vcard:hasAddress']['vcard:country_name'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- CREATOR -->
              <tr v-if="showProperty('datasets', 'dct:creator')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.creator') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:creator')">
                  <div v-for="(creator, index) in getObjectArray('datasets', 'dct:creator')" :key="index">
                    <div v-if="showElementValue(creator, '@type')">
                      {{ $t('message.metadata.type') }}: {{ creator['@type'] }}
                    </div>
                    <div v-if="showElementValue(creator, 'foaf:name')">
                      {{ $t('message.metadata.name') }}: {{ creator['foaf:name'] }}
                    </div>
                    <div v-if="showObjectElementValue(creator, 'foaf:mbox', '@id')">
                      {{ $t('message.metadata.email') }}: <app-link :to="`mailto:${creator['foaf:mbox']['@id']}`">{{ creator['foaf:mbox']['@id'] }}</app-link>
                    </div>
                    <div v-if="showObjectElementValue(creator, 'foaf:homepage', '@id')">
                      {{ $t('message.metadata.homepage') }}: <app-link :to="creator['foaf:homepage']['@id']">{{ creator['foaf:homepage']['@id'] }}</app-link>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- ISSUED -->
              <tr v-if="showProperty('datasets', 'dct:issued')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.created') }} </td>
                <td>{{ filterDateFormatEU(getObjectString('datasets', 'dct:issued', '@value')) }}</td>
              </tr>

              <!-- MODIFIED -->
              <tr v-if="showProperty('datasets', 'dct:modified')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.updated') }}</td>
                <td>{{ filterDateFormatEU(getObjectString('datasets', 'dct:modified', '@value')) }}</td>
              </tr>

              <!-- LANGUAGES -->
              <tr v-if="showProperty('datasets', 'dct:language')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.languages') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:language')">
                  <div v-for="(language, index) in getObjectArray('datasets', 'dct:language')" :key="index">
                    <div v-if="showElementValue(language, '@id')">
                      {{ language['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- SUBJECT -->
              <tr v-if="showProperty('datasets', 'dct:subject')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.subject.label') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:subject')">
                  <div v-for="(subject, index) in getObjectArray('datasets', 'dct:subject')" :key="index">
                    <div v-if="showElementValue(subject, '@id')">
                      {{ subject['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- THEME -->
              <tr v-if="showProperty('datasets', 'dcat:theme')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.theme.label') }}</td>
                <td v-if="showObjectArray('datasets', 'dcat:theme')">
                  <div v-for="(theme, index) in getObjectArray('datasets', 'dcat:theme')" :key="index">
                    <div v-if="showElementValue(theme, '@id')">
                      {{ theme['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- TYPE -->
              <tr v-if="showProperty('datasets', 'dct:type')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.type') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:type')">
                  <div v-for="(type, index) in getObjectArray('datasets', 'dct:type')" :key="index">
                    <div v-if="showElementValue(type, '@id')">
                      {{ type['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- SOURCE -->
              <tr v-if="showProperty('datasets', 'dct:source')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.sources') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:source')">
                  <div v-for="(source, index) in getObjectArray('datasets', 'dct:source')" :key="index">
                    <div v-if="showElementValue(source, '@id')">
                      {{ source['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- IDENTIFIER -->
              <tr v-if="showProperty('datasets', 'dct:identifier')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.identifiers') }}</td>
                <td v-if="showStringArray('datasets', 'dct:identifier')">
                  <div v-for="(identifier, index) in getStringArray('datasets', 'dct:identifier')" :key="index">
                    <div v-if="showString(identifier)">
                      {{ identifier }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- ADMS:IDENTIFIER -->
              <tr v-if="showProperty('datasets', 'adms:identifier')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.otherIdentifiers') }}</td>
                <td v-if="showObjectArray('datasets', 'adms:identifier')">
                  <div v-for="(identifier, index) in getObjectArray('datasets', 'adms:identifier')" :key="index">
                    <div v-if="showElementValue(identifier, '@id')">
                      {{ $t('message.metadata.url') }}: {{ identifier['@id'] }}
                    </div>
                    <div v-if="showElementValue(identifier['skos:notation'][0], '@value')">
                      {{ $t('message.metadata.identifier') }}: {{ identifier['skos:notation'][0]['@value'] }}
                    </div>
                    <div v-if="showElementValue(identifier['skos:notation'][0], '@type')">
                      {{ $t('message.metadata.type') }}: {{ identifier['skos:notation'][0]['@type'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- PAGE -->
              <tr v-if="showProperty('datasets', 'foaf:page')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.page.label') }}</td>
                <td v-if="showObjectArray('datasets', 'foaf:page')">
                  <div v-for="(page, index) in getObjectArray('datasets', 'foaf:page')" :key="index">
                    <div v-if="showElementValue(page, 'dct:title')">
                      {{ $t('message.metadata.title') }}: {{ page['dct:title'] }}
                    </div>
                    <div v-if="showElementValue(page, 'dct:description')">
                      {{ $t('message.metadata.description') }}: {{ page['dct:description'] }}
                    </div>
                    <div v-if="showElementValue(page, 'dct:format')">
                      {{ $t('message.metadata.format') }}:{{ page['dct:format'] }}
                    </div>
                    <div v-if="showElementValue(page, '@id')">
                      {{ $t('message.metadata.url') }}: <app-link :to="page['@id']">{{ page['@id'] }}</app-link>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- LANDING PAGE -->
              <tr v-if="showProperty('datasets', 'dcat:landingPage')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.landingPage') }}</td>
                <td v-if="showObjectArray('datasets', 'dcat:landingPage')">
                  <div v-for="(landingPage, index) in getObjectArray('datasets', 'dcat:landingPage')" :key="index">
                    <app-link v-if="showElementValue(landingPage, '@id')" :to="landingPage">{{ landingPage['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- PROVENANCE -->
              <tr v-if="showProperty('datasets', 'dct:provenance')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.provenances') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:provenance')">
                  <div v-for="(provenance, index) in getObjectArray('datasets', 'dct:provenance')" :key="index">
                    <div v-if="showElementValue(provenance, 'rdfs:label')">
                      {{ provenance['rdfs:label'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- ACCRUAL PERIODICITY -->
              <tr v-if="showProperty('datasets', 'dct:accrualPeriodicity')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.accrualPeriodicity') }}</td>
                <td>{{ getObjectString('datasets', 'dct:accrualPeriodicity', '@id') }}</td>
              </tr>

              <!-- ACCESS RIGHTS -->
              <tr v-if="showProperty('datasets', 'dct:accessRights')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.accessRights') }}</td>
                <td>{{ getObjectString('datasets', 'dct:accessRights', '@id') }}</td>
              </tr>

              <!-- CONFORMS TO -->
              <tr v-if="showProperty('datasets', 'dct:conformsTo')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.conformsTo') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:conformsTo')">
                  <div v-for="(conformsTo, index) in getObjectArray('datasets', 'dct:conformsTo')" :key="index">
                    <div v-if="showElementValue(conformsTo, 'rdfs:label')">
                      {{ conformsTo['rdfs:label'] }}
                    </div>
                    <div v-if="showElementValue(conformsTo, '@id')">
                      {{ conformsTo['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- RELATION -->
              <tr v-if="showProperty('datasets', 'dct:relation')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.relation.label') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:relation')">
                  <div v-for="(relation, index) in getObjectArray('datasets', 'dct:relation')" :key="index">
                    <app-link v-if="showElementValue(relation, '@id')" :to="relation">{{ relation['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- QUALIFIED RELATION -->
              <tr v-if="showProperty('datasets', 'dcat:qualifiedRelation')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.qualifiedRelation.label') }}</td>
                <td v-if="showObjectArray('datasets', 'dcat:qualifiedRelation')">
                  <div v-for="(qualifiedRelation, index) in getObjectArray('datasets', 'dcat:qualifiedRelation')" :key="index">
                    <app-link v-if="showElementValue(qualifiedRelation, '@id')" :to="qualifiedRelation">{{ qualifiedRelation['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- QUALIFIED ATTRIBUTION -->
              <tr v-if="showProperty('datasets', 'prov:qualifiedAttribution')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.qualifiedAttribution.label') }}</td>
                <td v-if="showObjectArray('datasets', 'prov:qualifiedAttribution')">
                  <div v-for="(qualifiedAttribution, index) in getObjectArray('datasets', 'prov:qualifiedAttribution')" :key="index">
                    <app-link v-if="showElementValue(qualifiedAttribution, '@id')" :to="qualifiedAttribution">{{ qualifiedAttribution['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- SPATIAL -->
              <tr v-if="showProperty('datasets', 'dct:spatial')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.spatial') }}</td>
                <td>{{ getObjectString('datasets', 'dct:spatial', '@id') }}</td>
              </tr>

              <!-- SPATIAL RESOLUTION IN METERS -->
              <tr v-if="showProperty('datasets', 'dcat:spatialResolutionInMeters')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.spatialResolutionInMeters.label') }}</td>
                <td v-if="showObjectValue('datasets', 'dcat:spatialResolutionInMeters', '@value')">
                  {{ getObjectString('datasets', 'dcat:spatialResolutionInMeters', '@value') }}
                </td>
              </tr>

              <!-- TEMPORAL -->
              <tr v-if="showProperty('datasets', 'dct:temporal')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.temporal') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:temporal')">
                  <div v-for="(temporal, index) in getObjectArray('datasets', 'dct:temporal')" :key="index">
                    <div v-if="showObjectElementValue(temporal, 'dcat:startDate', '@value')">
                      {{ temporal['dcat:startDate']['@value'] }}
                    </div>
                    <div v-if="showObjectElementValue(temporal, 'dcat:endDate', '@value')">
                      {{ temporal['dcat:endDate']['@value'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- TEMPORAL RESOLUTION -->
              <tr v-if="showProperty('datasets', 'dcat:temporalResolution')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.temporalResolution.label') }}</td>
                <td v-if="showObjectValue('datasets', 'dcat:temporalResolution', '@value')">
                  {{ getObjectString('datasets', 'dcat:temporalResolution', '@value') }}
                </td>
              </tr>

              <!-- IS REFERENCED BY -->
              <tr v-if="showProperty('datasets', 'dct:isReferencedBy')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.isReferencedBy.label') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:isReferencedBy')">
                  <div v-for="(isReferencedBy, index) in getObjectArray('datasets', 'dct:isReferencedBy')" :key="index">
                    <app-link v-if="showElementValue(isReferencedBy, '@id')" :to="isReferencedBy">{{ isReferencedBy['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- WAS GENERATED BY -->
              <tr v-if="showProperty('datasets', 'prov:wasGeneratedBy')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.wasGeneratedBy.label') }}</td>
                <td v-if="showObjectArray('datasets', 'prov:wasGeneratedBy')">
                  <div v-for="(wasGeneratedBy, index) in getObjectArray('datasets', 'prov:wasGeneratedBy')" :key="index">
                    <app-link v-if="showElementValue(wasGeneratedBy, '@id')" :to="wasGeneratedBy">{{ wasGeneratedBy['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- IS VERSION OF -->
              <tr v-if="showProperty('datasets', 'dct:isVersionOf')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.isVersionOf') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:isVersionOf')">
                  <div v-for="(isVersionOf, index) in getObjectArray('datasets', 'dct:isVersionOf')" :key="index">
                    <app-link v-if="showElementValue(isVersionOf, '@id')" :to="isVersionOf['@id']">{{ isVersionOf['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- IS USED BY -->
              <tr v-if="showProperty('datasets', 'dext:metadataExtension')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.step2.isUsedBy.label') }}</td>
                <td v-if="showObjectArray('datasets', 'dext:metadataExtension')">
                  <div v-for="(isUsedBy, index) in getObjectArray('datasets', 'dext:metadataExtension')" :key="index">
                    <app-link v-if="showObjectElementValue(isUsedBy, 'dext:isUsedBy', '@id')" :to="isUsedBy['dext:isUsedBy']['@id']">{{ isUsedBy['dext:isUsedBy']['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- HAS VERSION -->
              <tr v-if="showProperty('datasets', 'dct:hasVersion')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.hasVersion') }}</td>
                <td v-if="showObjectArray('datasets', 'dct:hasVersion')">
                  <div v-for="(hasVersion, index) in getObjectArray('datasets', 'dct:hasVersion')" :key="index">
                    <app-link v-if="showElementValue(hasVersion, '@id')" :to="hasVersion">{{ hasVersion['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- VERSION INFO -->
              <tr v-if="showProperty('datasets', 'owl:versionInfo')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.versionInfo') }}</td>
                <td>{{ getString('datasets', 'owl:versionInfo') }}</td>
              </tr>

              <!-- VERSION NOTES -->
              <tr v-if="showLanguageArray('datasets', 'adms:versionNotes')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.versionNotes') }}</td>
                <td>
                  <div v-for="(versionNotes, index) in getLanguageArray('datasets', 'adms:versionNotes')" :key="index">
                    {{ languageNames[versionNotes['@language']] }}: {{ versionNotes['@value'] }}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3" v-if="showCatalogsOverview">
    </div>
  </div>
</template>

<script>
/* eslint-disable no-restricted-syntax,guard-for-in */
import axios from 'axios';
import { mapActions, mapGetters } from 'vuex';
import {
  has,
  isNil,
  isEmpty,
  isString,
  isArray,
  isObject,
} from 'lodash';
import LANGS from '../config/selector-languages.json';
import { getTranslationFor, truncate } from '../../utils/helpers';
import AppLink from "@/modules/widgets/AppLink";
import dateFilters from "@/modules/filters/dateFilters";

export default {
  components: {
    AppLink
  },
  props: ['property'],
  data() {
    return {
      values: {},
      languageNames: LANGS,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getIsEditMode',
    ]),
    ...mapGetters('dpiStore', [
      'getNumberOfDistributions',
      'getNavSteps',
      'getData',
    ]),
    getDistributions() {
      return this.getData('distributions');
    },
    showDatasetsOverview() {
      return this.$route.params.property === 'datasets' && has(this.values, 'datasets');
    },
    showCatalogsOverview() {
      return this.$route.params.property === 'catalogues' && has(this.values, 'catalogues');
    },
    showDistributions() {
      return this.values.distributions.length > 0;
    },
    showTable() {
      /* eslint-disable semi-style */
      return this.showProperty('datasets', 'dct:publisher')
          || this.showProperty('datasets', 'dcat:contactPoint')
          || this.showProperty('datasets', 'dct:creator')
          || this.showProperty('datasets', 'dct:issued')
          || this.showProperty('datasets', 'dct:modified')
          || this.showProperty('datasets', 'dct:language')
          || this.showProperty('datasets', 'dct:subject')
          || this.showProperty('datasets', 'dcat:theme')
          || this.showProperty('datasets', 'dct:type')
          || this.showProperty('datasets', 'dct:source')
          || this.showProperty('datasets', 'dct:identifier')
          || this.showProperty('datasets', 'adms:identifier')
          || this.showProperty('datasets', 'foaf:page')
          || this.showProperty('datasets', 'dcat:landingPage')
          || this.showProperty('datasets', 'dct:provenance')
          || this.showProperty('datasets', 'dct:accrualPeriodicity')
          || this.showProperty('datasets', 'dct:accessRights')
          || this.showProperty('datasets', 'dct:conformsTo')
          || this.showProperty('datasets', 'dct:relation')
          || this.showProperty('datasets', 'dcat:qualifiedRelation')
          || this.showProperty('datasets', 'prov:qualifiedAttribution')
          || this.showProperty('datasets', 'dct:spatial')
          || this.showProperty('datasets', 'dcat:spatialResolutionInMeters')
          || this.showProperty('datasets', 'dct:temporal')
          || this.showProperty('datasets', 'dcat:temporalResolution')
          || this.showProperty('datasets', 'dct:isReferencedBy')
          || this.showProperty('datasets', 'prov:wasGeneratedBy')
          || this.showProperty('datasets', 'dct:isVersionOf')
          || this.showProperty('datasets', 'dext:isUsedBy')
          || this.showProperty('datasets', 'dct:hasVersion')
          || this.showProperty('datasets', 'owl:versionInfo')
          || this.showProperty('datasets', 'adms:versionNotes')
      ;
    },
  },
  methods: {
    ...mapActions('dpiStore', [
      'clearAll',
      'saveExistingJsonld',
    ]),
    has,
    isNil,
    isEmpty,
    isString,
    isArray,
    isObject,
    getTranslationFor,
    truncate,
    clear() {
      this.clearAll();
    },
    capitalize(word) {
      return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
    },
    filterDateFormatEU(date) {
      return dateFilters.formatEU(date);
    },
    showString(property) {
      return isString(property) && !isNil(property);
    },
    showElementValue(property, value) {
      return has(property, value) && !isNil(property[value]) && this.showString(property[value]);
    },
    showObjectValue(property, object, value) {
      return has(this.values, property) && has(this.values[property], object) && has(this.values[property][object], value) && !isNil(this.values[property][object][value]) && this.showString(this.values[property][object][value]);
    },
    showObjectElementValue(property, object, value) {
      return has(property, object) && has(property[object], value) && !isNil(property[object][value]) && this.showString(property[object][value]);
    },
    showProperty(property, name) {
      return has(this.values, property) && has(this.values[property], name) && !isNil(this.values[property][name]) && !isEmpty(this.values[property][name]);
    },
    showStringArray(property, name) {
      return has(this.values, property) && has(this.values[property], name) && isArray(this.values[property][name]);
    },
    showObjectArray(property, name) {
      return has(this.values, property) && has(this.values[property], name) && isArray(this.values[property][name]);
    },
    showLanguageArray(property, name) {
      return this.showObjectArray(property, name) && this.values[property][name].filter(el => has(el, '@value') && has(el, '@language')).length > 0;
    },
    getString(property, name) {
      return this.values[property][name];
    },
    getObjectString(property, object, name) {
      return this.values[property][object][name];
    },
    getStringArray(property, name) {
      return this.values[property][name];
    },
    getObjectArray(property, name) {
      return this.values[property][name];
    },
    getLanguageArray(property, name) {
      return this.values[property][name].filter(el => has(el, '@value') && has(el, '@language'));
    },
    showDistributionProperty(distribution, name) {
      return has(this.values, 'distributions') && !isEmpty(this.values.distributions) && !isEmpty(distribution) && has(distribution, name) && !isNil(distribution[name]) && !isEmpty(distribution[name]);
    },
    getDistributionProperty(distribution, property, name) {
      return has(distribution, property) && has(distribution[property], name)
        ? distribution[property][name]
        : [];
    },
    getDistributionString(distribution, name) {
      return has(distribution, name) 
        ? distribution[name]
        : [];
    },
    getDistributionObjectArray(distribution, property) {
      return has(distribution, property) 
        ? distribution[property]
        : [];
    },
    getDistributionLanguageArray(distribution, property) {
      return has(distribution, property) 
        ? distribution[property].filter(el => has(el, '@value') && has(el, '@language'))
        : [];
    },
    getDistributionFormat(distribution) {
      return distribution['dct:format']['@id'].substring(distribution['dct:format']['@id'].lastIndexOf('/') + 1);
    },
    getLocalstorageValues() {
      this.values = {...this.values};
      this.values[this.property] = this.getData(this.property);
      if (this.property === 'datasets') {
        this.values['distributions'] = this.getData('distributions');
      }
    },
    checkDatasetMandatory() {
      // Check if mandatory dataset properties are set
      if (!this.showProperty('datasets', 'dct:title') || !this.showProperty('datasets', 'dct:description') || !this.showProperty('datasets', 'dct:catalog')) {
        this.$router.push({ name: 'DataProviderInterface-Input', params: { property: 'datasets', page: 'step1' }, query: { error: 'mandatoryDataset', locale: this.$route.query.locale } });
      }
    },
    checkDistributionMandatory() {
      // Check if mandatory distribution properties are set
      if (this.values.distributions.filter(dist => !has(dist, 'dcat:accessURL') || dist['dcat:accessURL'].length === 0).length > 0) {
        this.$router.push({
          name: 'DataProviderInterface-Input',
          path: '/dpi/datasets/distoverview',
          params: {
            property: 'datasets',
            page: 'distoverview',
          },
          query: { 
            error: 'mandatoryDist',
            locale: this.$route.query.locale
          },
        });
      }
    },
    checkCatalogueMandatory() {
      // Check if mandatory catalogue properties are set
      if (!this.showProperty('catalogues', 'dct:title') || !this.showProperty('datasets', 'dct:description')) {
        this.$router.push({ name: 'DataProviderInterface-Input', params: { property: 'catalogues', page: 'step1' }, query: { error: 'mandatoryCatalog', locale: this.$route.query.locale } });
      }
    },
    checkDatasetID() {
      // Check uniqueness of Dataset ID
      if (!this.getIsEditMode) {
        this.checkUniqueID()
          .then((isUniqueID) => {
            if (!isUniqueID) {
              // Dataset ID not unique / taken in meantime --> Redirect to step1 where the user can choose a new ID
              this.$router.push({ name: 'DataProviderInterface-Input', params: { property: 'datasets', page: 'step1' }, query: { error: 'id', locale: this.$route.query.locale } });
            }
          });
      }
    },
    checkUniqueID() {
      return new Promise((resolve) => {
        if (this.values.datasets.datasetID !== '') {
          const request = `${this.$env.api.hubUrl}datasets/${this.values.datasets.datasetID}?useNormalizedId=true`;
          axios.head(request)
            .then(() => {
              resolve(false);
            })
            .catch(() => {
              resolve(true);
            });
        }
      });
    },
    addPrecedingZero(value) {
      return parseInt(value, 10) < 10 ? 0 : '';
    },
  },
  created() {
    this.$nextTick(() => {
      // if (this.property === 'datasets') {
      //   this.checkDatasetMandatory();
      //   this.checkDatasetID();
      //   this.checkDistributionMandatory();
      // }

      // if (this.property === 'catalogues') {
      //   this.checkCatalogueMandatory();
      // }
    });
  },
  mounted(){
    this.saveExistingJsonld(this.property);
    this.getLocalstorageValues();
  }
};
</script>

<style lang="scss" scoped>
  .heading, .description, .arrow {
    cursor: pointer;
  }

  .options, .download {
    .dropdown-menu {
      min-width: 300px;
      .dropdown-item {
        &:hover {
          color: initial;
          background-color: initial;
        }
      }
    }
  }

  .circle {
    width: 40px;
    height: 40px;
    margin: 0 auto;
    padding: 20px 0;
    font-size: 12px;
    line-height: 1px;
    border-radius: 50%;
    background-color: #000000;
    &[type="HTML"] {
      background-color: #285C76;
    }
    &[type="JSON"] {
      background-color: var(--dark-orange);
    }
    &[type="XML"] {
      background-color: #8F4300;
    }
    &[type="TXT"] {
      background-color: #2B5E73;
    }
    &[type="CSV"] {
      background-color: var(--badge-green);
    }
    &[type="XLS"] {
      background-color: #1A6537;
    }
    &[type="ZIP"] {
      background-color: #252525;
    }
    &[type="API"] {
      background-color: #923560;
    }
    &[type="PDF"] {
      background-color: #B30519;
    }
    &[type="SHP"] {
      background-color: var(--badge-black);
    }
    &[type="RDF"],
    &[type="NQUAD"],
    &[type="NTRIPLES"],
    &[type="TURTLE"] {
      background-color: #0b4498;
    }
  }
</style>
