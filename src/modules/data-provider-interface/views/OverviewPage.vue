<template>
  <div class="col-12">
    <div class="mb-3" v-if="showDatasetsOverview">
      <!-- LANGUAGE SELECTOR -->
      <div class="mt-5 mb-0" >
        <div class="row">
          <div class="col-10 offset-1">
            Select Display Language:
            <LanguageSelector class="ml-1" v-model="dpiLocale"></LanguageSelector>
          </div>
        </div>
      </div>
      <!-- DATASET ID && CATALOG -->
      <div class="mt-5 mb-0" >
        <div class="row">

          <!-- DATASET ID -->
          <div class="col-5 offset-1" v-if="showValue(getDataset, '@id')">
            <p class="mb-0">
              <span class="font-weight-bold">Dataset ID:</span>
              {{ getValue(getDataset, '@id') }}</p>
          </div>

          <!-- CATALOG -->
          <div class="col-5" v-if="showValue(getDataset, 'dct:catalog')">
            <p class="mb-0">
              <span class="font-weight-bold">Catalog:</span>
              {{ getValue(getDataset, 'dct:catalog') }}</p>
          </div>
        </div>
        <hr>
      </div>

      <!-- TITLE -->
      <div class="mt-2 mb-4" v-if="showLanguageArray(getDataset, 'dct:title')">
        <div class="row">
          <div class="col-8 offset-1">
            <h2>
              {{ getLanguageArrayValue(getDataset, 'dct:title') }}
            </h2>
          </div>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="mt-2" v-if="showLanguageArray(getDataset, 'dct:description')">
        <div class="row">
          <div class="col-10 offset-1">
            <p>
              {{ getLanguageArrayValue(getDataset, 'dct:description') }}
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
                <h2>{{ $t('message.metadata.distributions') }} ({{ getDistributions.length }})</h2>
              </div>
              <ul class="list list-unstyled col-12" v-if="showDistributions">
                <li class="row border-bottom" v-for="(distribution, i) in getDistributions" :key="`distribution${i+1}`">
                  <!-- DISTRIBUTIONS FORMAT -->
                  <span class="d-inline-block col-md-1 col-2 pt-3 pr-md-1 pr-0 m-md-0 m-auto">
                    <div v-if="showValue(distribution, 'dct:format')" class="circle float-md-right text-center text-white text-truncate"
                         :type="getDistributionFormat(distribution)"
                         :title="getDistributionFormat(distribution)">
                      <span>
                        {{ truncate(getDistributionFormat(distribution), 4, true) }}
                      </span>
                    </div>
                    <div v-else class="circle float-md-right text-center text-white text-truncate" type="UNKNOWN" title="UNKNOWN"><span>UNKNOWN</span></div>
                  </span>
                  <span class="col-10 mb-3">
                    <span class="row">
                      <span class="d-inline-block col-12">
                        <!-- DISTRIBUTIONS TITLE -->
                        <span v-if="showLanguageArray(distribution, 'dct:title')">
                          <h6 class="font-weight-bold m-0">
                            {{ getLanguageArrayValue(distribution, 'dct:title') }}
                          </h6>
                        </span>
                        <!-- DISTRIBUTIONS DESCRIPTION -->
                        <span class="mt-2 text-muted text-truncate" v-if="showLanguageArray(distribution, 'dct:description')">
                          <small>
                            {{ getLanguageArrayValue(distribution, 'dct:description') }}
                          </small>
                        </span>
                      </span>
                    </span>
                    <span class="row bg-light py-3 mt-2 mb-2">
                      <span class="d-inline-block col-12">
                        <!-- DISTRIBUTIONS ACCESS URL -->
                        <span class="mt-2" v-if="showValue(distribution, 'dcat:accessURL')">
                          <div v-for="(accessURL, index) in getArray(distribution, 'dcat:accessURL')" :key="index">
                            <span class="font-weight-bold">
                              {{ $t('message.metadata.accessUrl') }}:
                            </span>
                            <small>
                              <a :href="accessURL['@id']">
                                {{ accessURL['@id'] }}
                              </a>
                            </small>
                          </div>                          
                        </span>
                      </span>
                      <span class="d-inline-block col-12 mt-2">
                        <!-- DISTRIBUTIONS DATA SERVICE -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dcat:accessService')">
                          <span class="d-block">
                            <div v-for="(accessService, index) in getArray(distribution, 'dcat:accessService')" :key="index">
                              <div v-if="showLanguageArray(accessService, 'dct:title')">
                                <small>
                                  <span class="font-weight-bold">
                                    {{ $t('message.dataupload.distributions.accessServiceTitle.label') }}:
                                  </span>
                                  {{ getLanguageArrayValue(accessService, 'dct:title') }}
                                </small>
                              </div>
                              <div v-if="showLanguageArray(accessService, 'dct:description')">
                                <small>
                                  <span class="font-weight-bold">
                                    {{ $t('message.dataupload.distributions.accessServiceDescription.label') }}:
                                  </span>
                                  {{ getLanguageArrayValue(accessService, 'dct:description') }}
                                </small>
                              </div>
                              <div v-if="showObjectElementValue(accessService, 'dcat:endpointURL', '@id')" class="pr-1">
                                <small>
                                  <span class="font-weight-bold">
                                    {{ $t('message.dataupload.distributions.accessServiceEndpointURL.label') }}:
                                  </span>
                                  <a :href="getObjectValue(accessService, 'dcat:endpointURL', ['@id'])">
                                    {{ getObjectValue(accessService, 'dcat:endpointURL', ['@id']) }}
                                  </a>
                                </small>
                              </div>
                            </div>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS DOWNLOAD URL -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dcat:downloadURL')">
                          <span class="d-block">
                            <div v-for="(downloadURL, index) in getArray(distribution, 'dcat:downloadURL')" :key="index">
                              <small v-if="showValue(downloadURL, '@id')" class="pr-1">
                                <span class="font-weight-bold">
                                  {{ $t('message.metadata.downloadUrl') }}:
                                  </span>
                                  <a :href="downloadURL['@id']">{{ downloadURL['@id'] }}</a>
                              </small>
                            </div>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS LICENSE -->
                        <span class="mt-2 text-left"  v-if="showValue(distribution, 'dct:license')">
                          <small>
                            <span class="font-weight-bold">
                              {{ $t('message.metadata.license') }}:
                            </span>
                            {{ getObjectValue(distribution, 'dct:license', ['@id']) }}
                          </small>
                        </span>
                        <!-- DISTRIBUTIONS ISSUED -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dct:issued')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.created') }}:
                              </span>
                              {{ filterDateFormatEU(getObjectValue(distribution, 'dct:issued', ['@value'])) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS MODIFIED -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dct:modified')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.updated') }}:
                              </span> 
                              {{ filterDateFormatEU(getObjectValue(distribution, 'dct:modified', ['@value'])) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS TYPE -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dct:type')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.type') }}:
                              </span>
                              {{ getObjectValue(distribution, 'dct:type', ['@id']) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS MEDIA TYPE -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dcat:mediaType')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.mediaType') }}:
                              </span> 
                              {{ getObjectValue(distribution, 'dcat:mediaType', ['@id']) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS AVAILABILITY -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dcat:availability')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.availability') }}:
                              </span> 
                              {{ getObjectValue(distribution, 'dcat:availability', ['@id']) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS BYTE SIZE -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dcat:byteSize')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.byteSize') }}:
                              </span> 
                              {{ getValue(distribution, 'dcat:byteSize') }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS PACKAGE FORMAT -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dcat:packageFormat')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.packageFormat') }}:
                              </span> 
                              {{ getObjectValue(distribution, 'dcat:packageFormat', ['@id']) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS COMPRESS FORMAT -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dcat:compressFormat')">
                          <span class="d-block">
                            <small class="pr-1"><span class="font-weight-bold">
                              {{ $t('message.metadata.compressFormat') }}:
                            </span> 
                            {{ getObjectValue(distribution, 'dcat:compressFormat', ['@id']) }}
                          </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS STATUS -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'adms:status')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.status') }}:
                              </span> 
                              {{ getObjectValue(distribution, 'adms:status', ['@id']) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS SPATIAL RESOLUTION IN METERS -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dcat:spatialResolutionInMeters')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.spatialResolutionInMeters.label') }}:
                              </span> 
                              {{ $t('message.metadata.spatialResolutionInMeters.label', { number: getObjectValue(distribution, 'dcat:spatialResolutionInMeters', ['@value'])}) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS TEMPORAL RESOLUTION -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dcat:temporalResolution')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.temporalResolution') }}:
                              </span> 
                              {{ formatDatetime(getObjectValue(distribution, 'dcat:temporalResolution', ['@value'])) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS CONFORMS TO -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dct:conformsTo')">
                          <span class="d-block">
                            <div v-for="(conformsTo, index) in getArray(distribution, 'dct:conformsTo')" :key="index">
                              <small v-if="showValue(conformsTo, 'rdfs:label')" class="pr-1">
                                <span class="font-weight-bold">
                                  {{ $t('message.metadata.conformsTo') }}:
                                </span> 
                                <a :href="conformsTo['rdfs:label']">
                                  {{ conformsTo['rdfs:label'] }}
                                </a>
                              </small>
                              <small v-if="showValue(conformsTo, '@id')" class="pr-1">
                                <span class="font-weight-bold">
                                  {{ $t('message.metadata.conformsTo') }}:
                                </span> 
                                <a :href="conformsTo['@id']">
                                  {{ conformsTo['@id'] }}
                                </a>
                              </small>
                            </div>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS LANGUAGE -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dct:language')">
                          <span class="d-block">
                            <div v-for="(language, index) in getArray(distribution, 'dct:language')" :key="index">
                              <small v-if="showValue(language, '@id')" class="pr-1">
                                <span class="font-weight-bold">
                                  {{ $t('message.metadata.languages') }}:
                                </span> 
                                <a :href="language['@id']">
                                  {{ language['@id'] }}
                                </a>
                              </small>
                            </div>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS RIGHTS -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'dct:rights')">
                          <span class="d-block">
                            <small class="pr-1">
                              <span class="font-weight-bold">
                                {{ $t('message.metadata.rights') }}:
                              </span> 
                              {{ getObjectValue(distribution, 'dct:rights', ['rdfs:label']) }}
                            </small>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS PAGE -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'foaf:page')">
                          <span class="d-block">
                            <span class="font-weight-bold"></span>{{ $t('message.dataupload.datasets.page.label') }}
                            <div v-for="(page, index) in getArray(distribution, 'foaf:page')" :key="index">
                              <div v-if="showValue(page, 'dct:title')" class="pr-1">
                                <small>
                                  <span class="font-weight-bold">
                                    {{ $t('message.dataupload.datasets.pageTitle.label') }}:
                                  </span> 
                                  <a :href="page['dct:title']">
                                    {{ page['dct:title'] }}
                                  </a>
                                </small>
                              </div>
                              <div v-if="showValue(page, 'dct:description')" class="pr-1">
                                <small>
                                  <span class="font-weight-bold">
                                    {{ $t('message.dataupload.datasets.pageDescription.label') }}:
                                  </span> 
                                  <a :href="page['dct:description']">
                                    {{ page['dct:description'] }}
                                  </a>
                                </small>
                              </div>
                              <div v-if="showValue(page, '@id')" class="pr-1">
                                <small>
                                  <span class="font-weight-bold">
                                    {{ $t('message.dataupload.datasets.pageUrl.label') }}:
                                  </span> 
                                  <a :href="page['@id']">
                                    {{ page['@id'] }}
                                  </a>
                                </small>
                              </div>
                              <div v-if="showValue(page, 'dct:format')" class="pr-1">
                                <small>
                                  <span class="font-weight-bold">
                                    {{ $t('message.dataupload.datasets.pageFormat.label') }}:
                                  </span>
                                  <a :href="page['dct:format']">
                                    {{ page['dct:format'] }}
                                  </a>
                                </small>
                              </div>
                            </div>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS HAS POLICY -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'odrl:hasPolicy')">
                          <span class="d-block">
                            <div v-for="(hasPolicy, index) in getArray(distribution, 'odrl:hasPolicy')" :key="index">
                              <small v-if="showValue(hasPolicy, '@id')" class="pr-1">
                                <span class="font-weight-bold">
                                  {{ $t('message.metadata.hasPolicy') }}:
                                </span> 
                                <a :href="hasPolicy['@id']">
                                  {{ hasPolicy['@id'] }}
                                </a>
                              </small>
                            </div>
                          </span>
                        </span>
                        <!-- DISTRIBUTIONS CHECKSUM -->
                        <span class="mt-2 text-left" v-if="showValue(distribution, 'spdx:checksum')">
                          <span class="d-block">
                            <span class="font-weight-bold">{{ $t('message.metadata.checksum') }}</span>
                            <small class="pr-1">{{ getObjectValue(distribution, 'spdx:checksum', ['spdx:checksumValue']) }}</small>
                            <small class="pr-1">{{ getObjectValue(distribution, 'spdx:checksum', ['spdx:algorithm', '@id']) }}</small>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- KEYWORDS -->
      <div class="mt-2" v-if="showLanguageArray(getDataset, 'dcat:keyword')">
        <div class="row">
          <div class="col-10 offset-1">
            <div class="row">
              <span class="col-4 col-sm-3 col-md-2 mt-md-0 mt-3 pr-0">
                <small :title="getLanguageArrayValue(getDataset, 'dcat:keyword')"
                  class="d-inline-block w-100 p-2 ml-1 rounded-pill text-center text-white text-truncate bg-primary">
                  {{ getLanguageArrayValue(getDataset, 'dcat:keyword') }}
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
              <tr v-if="showValue(getDataset, 'dct:publisher')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.publisher') }}</td>
                <td>{{ getObjectValue(getDataset, 'dct:publisher', '@id') }}</td>
              </tr>

              <!-- CONTACT POINT -->
              <tr v-if="showValue(getDataset, 'dcat:contactPoint')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.contactPoints') }}</td>
                <td>
                  <div v-for="(contactPoint, index) in getArray(getDataset, 'dcat:contactPoint')" :key="index">
                    <div v-if="showValue(contactPoint, '@type')">
                      {{ $t('message.metadata.type') }}: {{ contactPoint['@type'] }}
                    </div>
                    <div v-if="showValue(contactPoint, 'vcard:fn')">
                      {{ $t('message.metadata.name') }}: {{ contactPoint['vcard:fn'] }}
                    </div>
                    <div v-if="showObjectElementValue(contactPoint, 'vcard:hasEmail', '@id')">
                      {{ $t('message.metadata.email') }}: <app-link :to="`mailto:${contactPoint['vcard:hasEmail']['@id']}`">{{ contactPoint['vcard:hasEmail']['@id'] }}</app-link>
                    </div>
                    <div v-if="showValue(contactPoint, 'vcard:hasOrganizationName')">
                      {{ $t('message.metadata.organizationName') }}: {{ contactPoint['vcard:hasOrganizationName'] }}
                    </div>
                    <div v-if="showValue(contactPoint, 'vcard:hasTelephone')">
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
              <tr v-if="showValue(getDataset, 'dct:creator')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.creator') }}</td>
                <td>
                  <div v-for="(creator, index) in getArray(getDataset, 'dct:creator')" :key="index">
                    <div v-if="showValue(creator, '@type')">
                      {{ $t('message.metadata.type') }}: {{ creator['@type'] }}
                    </div>
                    <div v-if="showValue(creator, 'foaf:name')">
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
              <tr v-if="showValue(getDataset, 'dct:issued')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.created') }} </td>
                <td>{{ filterDateFormatEU(getObjectValue(getDataset, 'dct:issued', '@value')) }}</td>
              </tr>

              <!-- MODIFIED -->
              <tr v-if="showValue(getDataset, 'dct:modified')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.updated') }}</td>
                <td>{{ filterDateFormatEU(getObjectValue(getDataset, 'dct:modified', '@value')) }}</td>
              </tr>

              <!-- LANGUAGES -->
              <tr v-if="showValue(getDataset, 'dct:language')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.languages') }}</td>
                <td>
                  <div v-for="(language, index) in getArray(getDataset, 'dct:language')" :key="index">
                    <div v-if="showValue(language, '@id')">
                      {{ language['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- SUBJECT -->
              <tr v-if="showValue(getDataset, 'dct:subject')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.subject.label') }}</td>
                <td>
                  <div v-for="(subject, index) in getArray(getDataset, 'dct:subject')" :key="index">
                    <div v-if="showValue(subject, '@id')">
                      {{ subject['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- THEME -->
              <tr v-if="showValue(getDataset, 'dcat:theme')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.theme.label') }}</td>
                <td>
                  <div v-for="(theme, index) in getArray(getDataset, 'dcat:theme')" :key="index">
                    <div v-if="showValue(theme, '@id')">
                      {{ theme['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- TYPE -->
              <tr v-if="showValue(getDataset, 'dct:type')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.type') }}</td>
                <td>
                  <div v-for="(type, index) in getArray(getDataset, 'dct:type')" :key="index">
                    <div v-if="showValue(type, '@id')">
                      {{ type['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- SOURCE -->
              <tr v-if="showValue(getDataset, 'dct:source')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.sources') }}</td>
                <td>
                  <div v-for="(source, index) in getArray(getDataset, 'dct:source')" :key="index">
                    <app-link v-if="showValue(source, '@id')" :to="source['@id']">
                      {{ source['@id'] }}
                    </app-link>
                  </div>
                </td>
              </tr>

              <!-- IDENTIFIER -->
              <tr v-if="showValue(getDataset, 'dct:identifier')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.identifiers') }}</td>
                <td>
                  <div v-for="(identifier, index) in getArray(getDataset, 'dct:identifier')" :key="index">
                    <div v-if="showString(identifier)">
                      {{ identifier }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- ADMS:IDENTIFIER -->
              <tr v-if="showValue(getDataset, 'adms:identifier')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.otherIdentifiers') }}</td>
                <td>
                  <div v-for="(identifier, index) in getArray(getDataset, 'adms:identifier')" :key="index">
                    <div v-if="showValue(identifier, '@id')">
                      {{ $t('message.metadata.url') }}: 
                      <app-link :to="identifier['@id']">{{ identifier['@id'] }}</app-link>
                    </div>
                    <div v-if="showValue(identifier['skos:notation'][0], '@value')">
                      {{ $t('message.metadata.identifier') }}: 
                      {{ identifier['skos:notation'][0]['@value'] }}
                    </div>
                    <div v-if="showValue(identifier['skos:notation'][0], '@type')">
                      {{ $t('message.metadata.type') }}: 
                      {{ identifier['skos:notation'][0]['@type'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- PAGE -->
              <tr v-if="showValue(getDataset, 'foaf:page')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.page.label') }}</td>
                <td>
                  <div v-for="(page, index) in getArray(getDataset, 'foaf:page')" :key="index">
                    <div v-if="showValue(page, 'dct:title')">
                      {{ $t('message.metadata.title') }}: {{ page['dct:title'] }}
                    </div>
                    <div v-if="showValue(page, 'dct:description')">
                      {{ $t('message.metadata.description') }}: {{ page['dct:description'] }}
                    </div>
                    <div v-if="showObjectElementValue(page, 'dct:format', '@id')">
                      {{ $t('message.metadata.format') }}:{{ page['dct:format']['@id'] }}
                    </div>
                    <div v-if="showValue(page, '@id')">
                      {{ $t('message.metadata.url') }}: <app-link :to="page['@id']">{{ page['@id'] }}</app-link>
                    </div>
                  </div>
                </td>
              </tr>

              <!-- LANDING PAGE -->
              <tr v-if="showValue(getDataset, 'dcat:landingPage')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.landingPage') }}</td>
                <td>
                  <div v-for="(landingPage, index) in getArray(getDataset, 'dcat:landingPage')" :key="index">
                    <app-link v-if="showValue(landingPage, '@id')" :to="landingPage">{{ landingPage['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- PROVENANCE -->
              <tr v-if="showValue(getDataset, 'dct:provenance')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.provenances') }}</td>
                <td>
                  <div v-for="(provenance, index) in getArray(getDataset, 'dct:provenance')" :key="index">
                    <div v-if="showValue(provenance, 'rdfs:label')">
                      {{ provenance['rdfs:label'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- ACCRUAL PERIODICITY -->
              <tr v-if="showValue(getDataset, 'dct:accrualPeriodicity')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.accrualPeriodicity') }}</td>
                <td>{{ getObjectValue(getDataset, 'dct:accrualPeriodicity', '@id') }}</td>
              </tr>

              <!-- ACCESS RIGHTS -->
              <tr v-if="showValue(getDataset, 'dct:accessRights')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.accessRights') }}</td>
                <td>{{ getObjectValue(getDataset, 'dct:accessRights', '@id') }}</td>
              </tr>

              <!-- CONFORMS TO -->
              <tr v-if="showValue(getDataset, 'dct:conformsTo')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.conformsTo') }}</td>
                <td>
                  <div v-for="(conformsTo, index) in getArray(getDataset, 'dct:conformsTo')" :key="index">
                    <div v-if="showValue(conformsTo, 'rdfs:label')">
                      {{ conformsTo['rdfs:label'] }}
                    </div>
                    <app-link v-if="showValue(conformsTo, '@id')" :to="conformsTo['@id']">
                      {{ conformsTo['@id'] }}
                    </app-link>
                  </div>
                </td>
              </tr>

              <!-- RELATION -->
              <tr v-if="showValue(getDataset, 'dct:relation')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.relation.label') }}</td>
                <td>
                  <div v-for="(relation, index) in getArray(getDataset, 'dct:relation')" :key="index">
                    <app-link v-if="showValue(relation, '@id')" :to="relation">{{ relation['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- QUALIFIED RELATION -->
              <tr v-if="showValue(getDataset, 'dcat:qualifiedRelation')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.qualifiedRelation.label') }}</td>
                <td>
                  <div v-for="(qualifiedRelation, index) in getArray(getDataset, 'dcat:qualifiedRelation')" :key="index">
                    <app-link v-if="showValue(qualifiedRelation, '@id')" :to="qualifiedRelation">{{ qualifiedRelation['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- QUALIFIED ATTRIBUTION -->
              <tr v-if="showValue(getDataset, 'prov:qualifiedAttribution')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.qualifiedAttribution.label') }}</td>
                <td>
                  <div v-for="(qualifiedAttribution, index) in getArray(getDataset, 'prov:qualifiedAttribution')" :key="index">
                    <app-link v-if="showValue(qualifiedAttribution, '@id')" :to="qualifiedAttribution">{{ qualifiedAttribution['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- SPATIAL -->
              <tr v-if="showValue(getDataset, 'dct:spatial')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.spatial') }}</td>
                <td>{{ getObjectValue(getDataset, 'dct:spatial', '@id') }}</td>
              </tr>

              <!-- SPATIAL RESOLUTION IN METERS -->
              <tr v-if="showValue(getDataset, 'dcat:spatialResolutionInMeters')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.spatialResolutionInMeters.label') }}</td>
                <td v-if="showObjectElementValue(getDataset, 'dcat:spatialResolutionInMeters', '@value')">
                  {{ getObjectValue(getDataset, 'dcat:spatialResolutionInMeters', '@value') }}
                </td>
              </tr>

              <!-- TEMPORAL -->
              <tr v-if="showValue(getDataset, 'dct:temporal')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.temporal') }}</td>
                <td>
                  <div v-for="(temporal, index) in getArray(getDataset, 'dct:temporal')" :key="index">
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
              <tr v-if="showValue(getDataset, 'dcat:temporalResolution')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.temporalResolution.label') }}</td>
                <td v-if="showObjectElementValue(getDataset, 'dcat:temporalResolution', '@value')">
                  {{ formatDatetime(getObjectValue(getDataset, 'dcat:temporalResolution', '@value')) }}
                </td>
              </tr>

              <!-- IS REFERENCED BY -->
              <tr v-if="showValue(getDataset, 'dct:isReferencedBy')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.isReferencedBy.label') }}</td>
                <td>
                  <div v-for="(isReferencedBy, index) in getArray(getDataset, 'dct:isReferencedBy')" :key="index">
                    <app-link v-if="showValue(isReferencedBy, '@id')" :to="isReferencedBy">{{ isReferencedBy['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- WAS GENERATED BY -->
              <tr v-if="showValue(getDataset, 'prov:wasGeneratedBy')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.wasGeneratedBy.label') }}</td>
                <td>
                  <div v-for="(wasGeneratedBy, index) in getArray(getDataset, 'prov:wasGeneratedBy')" :key="index">
                    <app-link v-if="showValue(wasGeneratedBy, '@id')" :to="wasGeneratedBy">{{ wasGeneratedBy['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- IS VERSION OF -->
              <tr v-if="showValue(getDataset, 'dct:isVersionOf')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.isVersionOf') }}</td>
                <td>
                  <div v-for="(isVersionOf, index) in getArray(getDataset, 'dct:isVersionOf')" :key="index">
                    <app-link v-if="showValue(isVersionOf, '@id')" :to="isVersionOf['@id']">{{ isVersionOf['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- IS USED BY -->
              <tr v-if="showValue(getDataset, 'dext:metadataExtension')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.datasets.isUsedBy.label') }}</td>
                <td>
                  <div v-for="(isUsedBy, index) in getArray(getDataset, 'dext:metadataExtension')" :key="index">
                    <app-link v-if="showObjectElementValue(isUsedBy, 'dext:isUsedBy', '@id')" :to="isUsedBy['dext:isUsedBy']['@id']">{{ isUsedBy['dext:isUsedBy']['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- HAS VERSION -->
              <tr v-if="showValue(getDataset, 'dct:hasVersion')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.hasVersion') }}</td>
                <td>
                  <div v-for="(hasVersion, index) in getArray(getDataset, 'dct:hasVersion')" :key="index">
                    <app-link v-if="showValue(hasVersion, '@id')" :to="hasVersion">{{ hasVersion['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- VERSION INFO -->
              <tr v-if="showValue(getDataset, 'owl:versionInfo')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.versionInfo') }}</td>
                <td>{{ getValue(getDataset, 'owl:versionInfo') }}</td>
              </tr>

              <!-- VERSION NOTES -->
              <tr v-if="showLanguageArray(getDataset, 'adms:versionNotes')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.versionNotes') }}</td>
                <td>
                  <div>
                    {{ getLanguageArrayValue(getDataset, 'adms:versionNotes') }}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>


    <div class="mb-3" v-if="showCatalogsOverview">
      <!-- TITLE -->
      <div class="mt-2 mb-4" v-if="showLanguageArray(getCatalogue, 'dct:title')">
        <div class="row">
          <div class="col-8 offset-1">
            <h2>
              {{ getLanguageArrayValue(getCatalogue, 'dct:title') }}
            </h2>
          </div>
        </div>
      </div>

      <!-- DESCRIPTION -->
      <div class="mt-2" v-if="showLanguageArray(getCatalogue, 'dct:description')">
        <div class="row">
          <div class="col-10 offset-1">
            <p>
              {{ getLanguageArrayValue(getCatalogue, 'dct:description') }}
            </p>
          </div>
        </div>
        <hr>
      </div>

      <!-- INFO TABLE -->
      <div class="mt-5">
        <div class="row">
          <div class="col-10 offset-1 py-2 bg-white">
            <h2 class="heading">{{ $t('message.datasetDetails.additionalInfo') }}</h2>
          </div>
          <div class="col-10 offset-1">
            <table class="table table-borderless table-responsive pl-3 bg-light">

              <!-- PUBLISHER -->
              <tr v-if="showValue(getCatalogue, 'dct:publisher')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.publisher') }}</td>
                <td>{{ getObjectValue(getCatalogue, 'dct:publisher', '@id') }}</td>
              </tr>

              <!-- HOMEPAGE -->
              <tr v-if="showValue(getCatalogue, 'foaf:homepage')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.homepage') }}</td>
                <td>{{ getObjectValue(getCatalogue, 'foaf:homepage', '@id') }}</td>
              </tr>

              <!-- LANGUAGES -->
              <tr v-if="showValue(getCatalogue, 'dct:language')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.languages') }}</td>
                <td>
                  <div v-for="(language, index) in getArray(getCatalogue, 'dct:language')" :key="index">
                    <div v-if="showValue(language, '@id')">
                      {{ language['@id'] }}
                    </div>
                  </div>
                </td>
              </tr>

              <!-- SPATIAL -->
              <tr v-if="showValue(getCatalogue, 'dct:spatial')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.spatial') }}</td>
                <td>{{ getObjectValue(getCatalogue, 'dct:spatial', '@id') }}</td>
              </tr>

              <!-- CREATOR -->
              <tr v-if="showValue(getCatalogue, 'dct:creator')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.creator') }}</td>
                <td>
                  <div v-for="(creator, index) in getArray(getCatalogue, 'dct:creator')" :key="index">
                    <div v-if="showValue(creator, '@type')">
                      {{ $t('message.metadata.type') }}: {{ creator['@type'] }}
                    </div>
                    <div v-if="showValue(creator, 'foaf:name')">
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

              <!-- HAS PART -->
              <tr v-if="showValue(getCatalogue, 'dct:hasPart')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.catalogues.hasPart.label') }}</td>
                <td>
                  <div v-for="(relation, index) in getArray(getCatalogue, 'dct:hasPart')" :key="index">
                    <app-link v-if="showValue(relation, '@id')" :to="relation">{{ relation['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- IS PART OF -->
              <tr v-if="showValue(getCatalogue, 'dct:isPartOf')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.isPartOf') }}</td>
                <td>{{ getObjectValue(getCatalogue, 'dct:isPartOf', '@id') }}</td>
              </tr>

              <!-- CATALOG -->
              <tr v-if="showValue(getCatalogue, 'dcat:catalog')">
                <td class="w-25 font-weight-bold">{{ $t('message.dataupload.catalogues.catalog.label') }}</td>
                <td>
                  <div v-for="(relation, index) in getArray(getCatalogue, 'dcat:catalog')" :key="index">
                    <app-link v-if="showValue(relation, '@id')" :to="relation">{{ relation['@id'] }}</app-link>
                  </div>
                </td>
              </tr>

              <!-- RIGHTS -->
              <tr v-if="showValue(getCatalogue, 'dct:rights')">
                <td class="w-25 font-weight-bold">{{ $t('message.metadata.rights') }}</td>
                <td v-if="typeof getObjectValue(getCatalogue, 'dct:rights', 'rdfs:label') === 'object'">
                  <app-link>{{ getObjectValue(getCatalogue, 'dct:rights', 'rdfs:label')['@id'] }}</app-link>
                </td>
                <td v-else>
                  <p>{{ getObjectValue(getCatalogue, 'dct:rights', 'rdfs:label') }}</p>
                </td>
              </tr>

            </table>
          </div>
        </div>
      </div>
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
import { getTranslationFor, truncate, addPrecedingZero, formatDatetime } from '../../utils/helpers';
import LanguageSelector from '../components/LanguageSelector';
import AppLink from "@/modules/widgets/AppLink";
import dateFilters from "@/modules/filters/dateFilters";

export default {
  components: {
    AppLink,
    LanguageSelector,
  },
  props: ['property'],
  data() {
    return {
      dpiLocale: 'en',
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
    getDataset() {
      return this.getData('datasets');
    },
    getDistributions() {
      return this.getData('distributions');
    },
    getCatalogue() {
      return this.getData('catalogues');
    },
    showDatasetsOverview() {
      return this.$route.params.property === 'datasets';
    },
    showCatalogsOverview() {
      return this.$route.params.property === 'catalogues';
    },
    showDistributions() {
      return this.getDistributions.length > 0;
    },
    showTable() {
      /* eslint-disable semi-style */
      let tableProperties = [
        'dct:publisher',
        'dcat:contactPoint',
        'dct:creator',
        'dct:issued',
        'dct:modified',
        'dct:language',
        'dct:subject',
        'dcat:theme',
        'dct:type',
        'dct:source',
        'dct:identifier',
        'adms:identifier',
        'foaf:page',
        'dcat:landingPage',
        'dct:provenance',
        'dct:accrualPeriodicity',
        'dct:accessRights',
        'dct:conformsTo',
        'dct:relation',
        'dcat:qualifiedRelation',
        'prov:qualifiedAttribution',
        'dct:spatial',
        'dcat:spatialResolutionInMeters',
        'dct:temporal',
        'dcat:temporalResolution',
        'dct:isReferencedBy',
        'prov:wasGeneratedBy',
        'dct:isVersionOf',
        'dext:isUsedBy',
        'dct:hasVersion',
        'owl:versionInfo',
        'adms:versionNotes',
      ];
      return tableProperties.filter(prop => this.showValue(this.getDataset, prop)).length > 0;
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
    formatDatetime,
    addPrecedingZero,
    clear() {
      this.clearAll();
    },
    capitalize(word) {
      return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
    },
    filterDateFormatEU(date) {
      return dateFilters.formatEU(date);
    },
    /*** Overview Page display functionality ***/
    showLanguage(element) {
      return has(element, '@language') && element['@language'] === this.dpiLocale;
    },
    showValue(property, value) {
      return has(property, value) && !isNil(property[value]) && !isEmpty(property[value]);
    },
    showString(property) {
      return isString(property) && this.showValue(property);
    },
    showObjectElementValue(property, object, value) {
      return has(property, object) && this.showValue(property[object], value);
    },
    showLanguageArray(property, name) {
      return has(property, name) && this.getArray(property, name).filter((el) => {
        return this.showLanguage(el) && this.showValue(el, '@value');
      }).length > 0;
    },
    /*** Overview Page getter functionality ***/
    getValue(property, name) {
      return property[name];
    },
    getObjectValue(property, object, name) {
      return this.getValue(property[object], [name]);
    },
    getArray(property, name) {
      return isArray(property[name])
        ? property[name]
        : [];
    },
    getLanguageArrayValue(property, name) {
      let languageArray = this.getArray(property, name).filter((el) => {
        return this.showLanguage(el) && this.showValue(el, '@value');
      })[0];

      return has(property, name) && has(languageArray, ['@value']) 
        ? languageArray['@value']
        : [];
    },
    getDistributionFormat(distribution) {
      return distribution['dct:format']['@id'].substring(distribution['dct:format']['@id'].lastIndexOf('/') + 1);
    },
    /*** Overview Page checker functionality ***/
    checkDatasetMandatory() {
      if (this.getArray(this.getDataset, 'dct:title').filter(title => this.showValue(title, '@value')).length === 0 
      || this.getArray(this.getDataset, 'dct:description').filter(desc => this.showValue(desc, '@value')).length === 0
      || !this.showValue(this.getDataset, 'dct:catalog')) {
        this.$router.push({ 
          name: 'DataProviderInterface-Input', 
          params: { 
            property: 'datasets', 
            page: 'step1' 
          }, 
          query: { 
            error: 'mandatoryDataset', 
            locale: this.$route.query.locale 
          } 
        });
      }
    },
    checkDistributionMandatory() {
      if (this.getDistributions.filter(dist => !has(dist, 'dcat:accessURL') || dist['dcat:accessURL'].length === 0).length > 0) {
        this.$router.push({
          name: 'DataProviderInterface-Input',
          path: '/dpi/datasets/distoverview',
          params: {
            property: 'datasets',
            page: 'distoverview',
          },
          query: {
            error: 'mandatoryDistribution',
            locale: this.$route.query.locale
          },
        });
      }
    },
    checkCatalogueMandatory() {
      if (this.getArray(this.getCatalogue, 'dct:title').filter(title => this.showValue(title, '@value')).length === 0 
      || this.getArray(this.getCatalogue, 'dct:description').filter(desc => this.showValue(desc, '@value')).length === 0
      || !this.showValue(this.getCatalogue, 'dct:publisher')
      || !this.showValue(this.getCatalogue, 'dct:language')) {
        this.$router.push({ 
          name: 'DataProviderInterface-Input', 
          params: { 
            property: 'catalogues', 
            page: 'step1' 
          }, 
          query: { 
            error: 'mandatoryCatalog', 
            locale: this.$route.query.locale
          } 
        });
      }
    },
    checkID(property) {
      // Check uniqueness of Dataset ID
      if (!this.getIsEditMode) {
        this.checkUniqueID(property)
          .then((isUniqueID) => {
            if (!isUniqueID) {
              // Dataset ID not unique / taken in meantime --> Redirect to step1 where the user can choose a new ID
              this.$router.push({ 
                name: 'DataProviderInterface-Input',
                params: { 
                  property: property, 
                  page: 'step1' 
                }, 
                query: { 
                  error: 'id', 
                  locale: this.$route.query.locale 
                } 
              });
            }
          });
      }
    },
    checkUniqueID(property) {
      return new Promise((resolve) => {
        if (this.getData(property)['@id'] !== '') {
          const request = `${this.$env.api.hubUrl}${property}/${this.getData(property)['@id']}?useNormalizedId=true`;
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
  },
  created() {
    this.$nextTick(() => {
      if (this.property === 'datasets') {
        this.checkID('datasets');
        this.checkDatasetMandatory();
        this.checkDistributionMandatory();
      }

      if (this.property === 'catalogues') {
        this.checkID('catalogues')
        this.checkCatalogueMandatory();
      }
    });
  },
  mounted(){
    this.saveExistingJsonld(this.property);
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

</style>
