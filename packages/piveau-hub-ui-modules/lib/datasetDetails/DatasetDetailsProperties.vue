<template>
  <div class="mt-5 dsd-properties">
    <div class="col-12 mb-2 p-0 dsd-properties-list">
      <dataset-details-feature-header
        :title="$t('message.datasetDetails.additionalInfo')"
        :arrowDown="!infoVisible"
        tag="additional-information-toggle"
        :onClick="toggleInfo"
      />
      <div class="position-relative dsd-item additional-information"
           data-cy="additional-information"
           v-show="infoVisible">
        <table class="table table-borderless table-responsive" ref="dsdProperties" id="myTab" role="tablist">
<!--          <tbody>-->
            <tr v-if="showString(getReleaseDate)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.created')">
                  {{ $t('message.metadata.created') }}
                </tooltip>
              </td>
              <td>{{ filterDateFormatEU(getReleaseDate) }}</td>
            </tr>
            <tr v-if="showString(getModificationDate)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.updated')">
                  {{ $t('message.metadata.updated') }}
                </tooltip>
              </td>
              <td>{{ filterDateFormatEU(getModificationDate) }}</td>
            </tr>
            <tr v-if="showArray(getLandingPagesResource)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.landingPage')">
                  {{ $t('message.metadata.landingPage') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(landingPage, i) of getLandingPagesResource" :key="i">
                  <app-link v-if="!isNil(landingPage)" :to="landingPage">{{ truncate(landingPage, 75) }}</app-link>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getSources)">
              <td class="w-25 text-break font-weight-bold">{{ $t('message.metadata.sources') }}</td>
              <td>
                <div v-for="(source, i) of getSources" :key="i">
                  <app-link v-if="!isNil(source) && isString(source)" :to="source">{{ source }}</app-link>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getLanguages)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.language')">
                  {{ $t('message.metadata.languages') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(language, i) of getLanguages" :key="i">
                  <app-link v-if="!isNil(language) && isString(language.label) && isString(language.resource)" :to="language.resource">{{ language.label }}</app-link>
                </div>
              </td>
            </tr>
            <tr v-if="showObject(getPublisher)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.publisher')">
                  {{ $t('message.metadata.publisher') }}
                </tooltip>
              </td>
              <td>
                <div v-if="has(getPublisher, 'name') && !isNil(getPublisher.name)">
                  {{ $t('message.metadata.name') }}:
                  {{ getPublisher.name }}
                </div>
                <div v-if="has(getPublisher, 'email') && !isNil(getPublisher.email)">
                  {{ $t('message.metadata.email') }}:
                  <app-link :to="`mailto:${removeMailtoOrTel(getPublisher.email)}`">{{ removeMailtoOrTel(getPublisher.email) }}</app-link>
                </div>
                <div v-if="has(getPublisher, 'homepage') && !isNil(getPublisher.homepage)">
                  {{ $t('message.metadata.homepage') }}:
                  <a :href="getPublisher.homepage">{{ truncate(getPublisher.homepage, 75) }}</a>
                </div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getContactPoints) && showContactPoint(getContactPoints)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.contactPoints')">
                  {{ $t('message.metadata.contactPoints') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(contactPoint, i) in getContactPoints" :key="i">
                  <div v-if="has(contactPoint, 'name') && !isNil(contactPoint.name)">
                    {{ $t('message.datasetDetails.contactPoints.organizationName') }}:
                    {{contactPoint.name}}
                  </div>
                  <div v-if="has(contactPoint, 'email') && !isNil(contactPoint.email)">
                    {{ $t('message.metadata.email') }}:
                    <app-link :to="`mailto:${removeMailtoOrTel(contactPoint.email)}`">{{ removeMailtoOrTel(contactPoint.email) }}</app-link>
                  </div>
                  <div v-if="has(contactPoint, 'telephone') && !isNil(contactPoint.telephone)">
                    {{ $t('message.metadata.telephone') }}:
                    <app-link :to="`tel:${removeMailtoOrTel(contactPoint.telephone)}`">{{ removeMailtoOrTel(contactPoint.telephone) }}</app-link>
                  </div>
                  <div v-if="has(contactPoint, 'address') && !isNil(contactPoint.address)">
                    {{ $t('message.metadata.address') }}:
                    {{contactPoint.address}}
                  </div>
                  <div v-if="has(contactPoint, 'url') && showArray(contactPoint.url)">
                    URL:
                    <div class="ml-1">
                      <div v-for="(url, i) of contactPoint.url" :key="i">
                        <div v-if="showString(url)">
                          <app-link :to="url">{{ truncate(url, 75) }}</app-link>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br>
                </div>
              </td>
            </tr>
            <!-- Add new fields for DCAT-AP.de -->
            <tr v-if="showObjectArray(getPoliticalGeocodingLevelURI)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.politicalGeocodingLevelURI')">
                  {{ $t('message.metadata.politicalGeocodingLevelURI') }}
                </tooltip>
              </td>
              <td v-for="(element, i) in getPoliticalGeocodingLevelURI" :key="`PoliticalGeocodingLevelURI-`+i">
                <div v-if="has(element, 'label') && !isNil(element.label)"> {{ $t('message.metadata.label') }}: {{ element.label }}</div>
                <div v-if="has(element, 'resource') && !isNil(element.resource)"> {{ $t('message.metadata.resource') }}: <a :href="element.resource">{{ element.resource }}</a></div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getPoliticalGeocodingURI)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.politicalGeocodingURI")'>
                  {{ $t('message.metadata.politicalGeocodingURI') }}
                </tooltip>
              </td>
              <td v-for="(element, i) in getPoliticalGeocodingURI" :key="`PoliticalGeocodingURI-`+i">
                <div v-if="has(element, 'label') && !isNil(element.label)"> {{ $t('message.metadata.label') }}: {{ element.label }}</div>
                <div v-if="has(element, 'resource') && !isNil(element.resource)"> {{ $t('message.metadata.resource') }}: <a :href="element.resource">{{ element.resource }}</a></div>
              </td>
            </tr>
            <tr v-if="showObject(getAvailability)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.availabilityDE")'>
                  {{ $t('message.metadata.availability') }}
                </tooltip>
              </td>
              <td>
                <div v-if="has(getAvailability, 'label') && !isNil(getAvailability.label)"> {{ $t('message.metadata.label') }}: {{ getAvailability.label }}</div>
                <div v-if="has(getAvailability, 'resource') && !isNil(getAvailability.resource)"> {{ $t('message.metadata.resource') }}: <a :href="getAvailability.resource">{{ getAvailability.resource }}</a></div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getContributorID)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.contributorID")'>
                  {{ $t('message.metadata.contributorID') }}
                </tooltip>
              </td>
              <td v-for="(element, i) in getContributorID" :key="`ContributorID-`+i">
                <div v-if="has(element, 'label') && !isNil(element.label)"> {{ $t('message.metadata.label') }}: {{ element.label }}</div>
                <div v-if="has(element, 'resource') && !isNil(element.resource)"> {{ $t('message.metadata.resource') }}: <a :href="element.resource">{{ element.resource }}</a></div>
              </td>
            </tr>
            <tr v-if="showObject(getGeocodingDescriptionDe)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.geocodingDescription")'>
                  {{ $t('message.metadata.geocodingDescription') }}
                </tooltip>
              </td>
              <td >
                <div> {{ getTranslationFor(getGeocodingDescriptionDe) }}</div>
              </td>
            </tr>
            <tr v-if="showObject(getLegalBasis)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.legalBasis")'>
                  {{ $t('message.metadata.legalBasis') }}
                </tooltip>
              </td>
              <td >
                <div> {{ getTranslationFor(getLegalBasis) }}</div>
              </td>
            </tr>
            <tr v-if="showString(getQualityProcessURI)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.qualityProcessURI")'>
                  {{ $t('message.metadata.qualityProcessURI') }}
                </tooltip>
              </td>
              <td>
                <a :href="getQualityProcessURI">{{ getQualityProcessURI }}</a>
              </td>
            </tr>
            <tr v-if="showString(getTypeDe)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.type")'>
                  {{ $t('message.metadata.type') }}
                </tooltip>
              </td>
              <td>
                {{ getTypeDe }}
              </td>
            </tr>
            <tr v-if="showString(getReferences)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.references")'>
                  {{ $t('message.metadata.references') }}
                </tooltip>
              </td>
              <td>
                <a :href="getReferences">{{ getReferences }}</a>
              </td>
            </tr>
            <tr v-if="showObjectArray(getContributor)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.contributor")'>
                  {{ $t('message.metadata.contributor') }}
                </tooltip>
              </td>
              <td v-for="(element, i) in getContributor" :key="`Contributor-`+i">
                <div v-if="has(element, 'name') && !isNil(element.name)"> {{ $t('message.metadata.name') }}: {{ element.name }}</div>
                <div v-if="has(element, 'type') && !isNil(element.type)"> {{ $t('message.metadata.type') }}: {{ element.type }}</div>
                <div v-if="has(element, 'homepage') && !isNil(element.homepage)"> {{ $t('message.metadata.homepage') }}: <a :href="element.homepage">{{ element.homepage }}</a></div>
                <div v-if="has(element, 'email') && !isNil(element.email)"> {{ $t('message.metadata.email') }}: <a :href="'mailto:' + element.email">{{ element.email }}</a></div>
                <div v-if="has(element, 'resource') && !isNil(element.resource)"> {{ $t('message.metadata.resource') }}: <a :href="element.resource">{{ element.resource }}</a></div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getOriginator)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.originator")'>
                  {{ $t('message.metadata.originator') }}
                </tooltip>
              </td>
              <td v-for="(element, i) in getOriginator" :key="`Originator-`+i">
                <div v-if="has(element, 'name') && !isNil(element.name)"> {{ $t('message.metadata.name') }}: {{ element.name }}</div>
                <div v-if="has(element, 'type') && !isNil(element.type)"> {{ $t('message.metadata.type') }}: {{ element.type }}</div>
                <div v-if="has(element, 'homepage') && !isNil(element.homepage)"> {{ $t('message.metadata.homepage') }}: <a :href="element.homepage">{{ element.homepage }}</a></div>
                <div v-if="has(element, 'email') && !isNil(element.email)"> {{ $t('message.metadata.email') }}: <a :href="'mailto:' + element.email">{{ element.email }}</a></div>
                <div v-if="has(element, 'resource') && !isNil(element.resource)"> {{ $t('message.metadata.resource') }}: <a :href="element.resource">{{ element.resource }}</a></div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getMaintainer)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title='$t("message.tooltip.datasetDetails.maintainer")'>
                  {{ $t('message.metadata.maintainer') }}
                </tooltip>
              </td>
              <td v-for="(element, i) in getMaintainer" :key="`Maintainer-`+i">
                <div v-if="has(element, 'name') && !isNil(element.name)"> {{ $t('message.metadata.name') }}: {{ element.name }}</div>
                <div v-if="has(element, 'type') && !isNil(element.type)"> {{ $t('message.metadata.type') }}: {{ element.type }}</div>
                <div v-if="has(element, 'homepage') && !isNil(element.homepage)"> {{ $t('message.metadata.homepage') }}: <a :href="element.homepage">{{ element.homepage }}</a></div>
                <div v-if="has(element, 'email') && !isNil(element.email)"> {{ $t('message.metadata.email') }}: <a :href="'mailto:' + element.email">{{ element.email }}</a></div>
                <div v-if="has(element, 'resource') && !isNil(element.resource)"> {{ $t('message.metadata.resource') }}: <a :href="element.resource">{{ element.resource }}</a></div>
              </td>
            </tr>
            <!-- ### END DCAT-AP.de fields ### -->
            <tr v-if="showObject(getCatalogRecord)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.catalogRecord')" >
                  {{ $t('message.metadata.catalogRecord') }}
                </tooltip>
              </td>
              <td>
                <div v-if="getCatalogRecord.issued" class="catalogue-label">{{ `${$t('message.metadata.addedToDataEuropaEU')}:\n${filterDateFormatEU(getCatalogRecord.issued)}` }}</div>
                <div v-if="getCatalogRecord.modified" class="catalogue-label" :class="{'mt-1': getCatalogRecord.issued}">{{ `${$t('message.metadata.updatedOnDataEuropaEU')}:\n${filterDateFormatEU(getCatalogRecord.modified)}` }}</div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getSpatial)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.spatial')">
                  {{ $t('message.metadata.spatial') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(spatial, i) of getSpatial" :key="i">
                  <div v-if="has(spatial, 'coordinates') && !isNil(spatial.coordinates)">
                    {{ $t('message.metadata.coordinates') }}:
                    {{ spatial.coordinates }}
                  </div>
                  <div v-if="has(spatial, 'type') && !isNil(spatial.type)">
                    {{ $t('message.metadata.type') }}:
                    {{ spatial.type }}
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getSpatialResource)">
              <td class="w-25 text-break font-weight-bold">{{ $t('message.metadata.spatialResource') }}</td>
              <td>
                <div v-for="(spatialResource, i) of getSpatialResource.map(s => s.resource || '')" :key="i">
                  <app-link v-if="!isNil(spatialResource)" :to="spatialResource">{{ truncate(spatialResource, 75) }}</app-link>
                </div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getConformsTo)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.conformsTo')">
                  {{ $t('message.metadata.conformsTo') }}
                </tooltip>
              </td>
              <td >
                <div v-for="(conformTo, i) in getConformsTo" :key="i">
                  <div v-if="has(conformTo, 'title') && !isNil(conformTo.title)">
                    {{ $t('message.metadata.label') }}:
                    {{ conformTo.title}}
                  </div>
                  <div v-if="has(conformTo, 'resource') && !isNil(conformTo.resource)">
                    {{ $t('message.metadata.resource') }}:
                    <app-link :to="conformTo.resource"
                              target="_blank"
                              @click="$emit('track-link', conformTo.resource, 'link')">
                      {{ truncate(conformTo.resource, 75) }}
                    </app-link>
                  </div>
                  <br>
                </div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getProvenances)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.provenance')">
                  {{ $t('message.metadata.provenances') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(provenance, i) in getProvenances" :key="i">
                  <div v-if="has(provenance, 'label') && !isNil(provenance.label)">
                    {{ $t('message.metadata.label') }}:
                    {{ provenance.label }}
                  </div>
                  <div v-if="has(provenance, 'resource') && !isNil(provenance.resource)">
                    {{ $t('message.metadata.resource') }}:
                    <app-link :to="provenance.resource">{{ truncate(provenance.resource, 75) }}</app-link>
                  </div>
                  <br>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getRelatedResources)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.relatedResource')">
                  {{ $t('message.metadata.relatedResources') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(resource, i) of getRelatedResources" :key="i">
                  <app-link v-if="!isNil(resource)" :to="resource">{{ truncate(resource, 75) }}</app-link>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getIdentifiers)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.identifier')" >
                  {{ $t('message.metadata.identifiers') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(identifier, i) of getIdentifiers" :key="i">
                  <app-link :to="appendCurrentLocaleToURL(identifier)" v-if="showString(identifier)">
                    {{ truncate(identifier, 75) }}
                  </app-link>
                </div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getOtherIdentifiers)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.otherIdentifier')" >
                  {{ $t('message.metadata.otherIdentifiers') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(otherIdentifier, i) of getOtherIdentifiers" :key="i">
                  <div  v-if="has(otherIdentifier, 'identifier') && !isNil(otherIdentifier.identifier)">
                    {{ $t('message.metadata.identifier') }}:
                    <app-link :to="otherIdentifier.resource || otherIdentifier.identifier">
                      {{ otherIdentifier.identifier }}
                    </app-link>
                  </div>
                  <div v-if="has(otherIdentifier, 'scheme') && !isNil(otherIdentifier.scheme)">
                    {{ $t('message.metadata.scheme') }}:
                    <app-link :to="otherIdentifier.scheme">
                      {{ otherIdentifier.scheme }}
                    </app-link>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showString(getResource)" class="dsd-properties-uriref">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.uriRef')">
                  URIref
                </tooltip>
              </td>
              <td>
                Hello
              </td>
            </tr>
            <tr v-if="showArray(getDocumentations)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.documentation')" >
                  {{ $t('message.metadata.documentations') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(documentation, i) of getDocumentations" :key="i">
                  <app-link v-if="!isNil(documentation)" :to="documentation">{{ truncate(documentation, 75) }}</app-link>
                </div>
              </td>
            </tr>
            <tr v-if="showObject(getFrequency)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.frequency')" >
                  {{ $t('message.metadata.frequency') }}
                </tooltip>
              </td>
              <td>
                <div v-if="has(getFrequency, 'title') && !isNil(getFrequency.title)">
                  {{ getFrequency.title }}
                </div>
                <div v-if="has(getFrequency, 'resource') && !isNil(getFrequency.resource)">
                  <app-link :to="getFrequency.resource">{{ truncate(getFrequency.resource, 75) }}</app-link>
                </div>
              </td>
            </tr>
            <tr v-if="showObject(getAccessRights)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.distributions.rights')" >
                  {{ $t('message.metadata.accessRights') }}
                </tooltip>
              </td>
              <td v-if="has(getAccessRights, 'label') && !isNil(getAccessRights.label)">{{ getAccessRights.label }}</td>
            </tr>
            <tr v-if="showString(getAccrualPeriodicityLabel)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.frequency')" >
                  {{ $t('message.metadata.accrualPeriodicity') }}
                </tooltip>
              </td>
              <td v-if="!isNil(getAccrualPeriodicityLabel)">{{ getAccrualPeriodicityLabel }}</td>
            </tr>
            <tr v-if="showObject(getCreator)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.creator')" >
                  {{ $t('message.metadata.creator') }}
                </tooltip>
              </td>
              <td>
                <div v-if="has(getCreator, 'name') && !isNil(getCreator.name)">
                  {{ $t('message.metadata.name') }}:
                  {{ getCreator.name }}
                </div>
                <div v-if="has(getCreator, 'email') && !isNil(getCreator.email)">
                  {{ $t('message.metadata.email') }}:
                  <app-link :to="`mailto:${removeMailtoOrTel(getCreator.email)}`">{{ truncate(removeMailtoOrTel(getCreator.email), 75) }}</app-link>
                </div>
                <div v-if="has(getCreator, 'homepage') && !isNil(getCreator.homepage)">
                  {{ $t('message.metadata.homepage') }}:
                  <app-link :to="getCreator.homepage">{{ truncate(getCreator.homepage, 75) }}</app-link>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getHasVersion)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.hasVersion')" >
                  {{ $t('message.metadata.hasVersion') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(hasVersion, i) of getHasVersion" :key="i">
                  <div v-if="!isNil(hasVersion) && isString(hasVersion)">
                    <app-link :to="hasVersion">{{ truncate(hasVersion, 75) }}</app-link>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getIsVersionOf)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.versionOf')" >
                  {{ $t('message.metadata.isVersionOf') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(isVersionOf, i) of getIsVersionOf" :key="i">
                  <div v-if="!isNil(isVersionOf) && isString(isVersionOf)">
                    <app-link :to="isVersionOf">{{ truncate(isVersionOf, 75) }}</app-link>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getTemporal)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.distributions.temporalResolution')" >
                  {{ $t('message.metadata.temporal') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(temporal, i) of getTemporal" :key="i">
                  <div v-if="has(temporal, 'gte') && !isNil(temporal.gte) && has(temporal, 'lte') && !isNil(temporal.lte)">{{ filterDateFormatEU(temporal.gte) }} - {{ filterDateFormatEU(temporal.lte) }}</div>
                </div>
              </td>
            </tr>
            <tr v-if="showString(getVersionInfo)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.versionInfo')" >
                  {{ $t('message.metadata.versionInfo') }}
                </tooltip>
              </td>
              <td v-if="!isNil(getVersionInfo)">{{ getVersionInfo }}</td>
            </tr>
            <tr v-if="showObject(getVersionNotes)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.versionNotes')" >
                  {{ $t('message.metadata.versionNotes') }}
                </tooltip>
              </td>
              <td>{{ getTranslationFor(getVersionNotes) }}</td>
            </tr>
            <tr v-if="showArray(getAttributes)">
              <td class="w-25 text-break font-weight-bold">{{ $t('message.metadata.attributes') }}</td>
              <td>
                <div v-for="(attribute, i) of getAttributes" :key="i">
                  <div v-if="showString(attribute)">
                    <app-link :to="attribute">{{ truncate(attribute, 75) }}</app-link>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getDimensions)">
              <td class="w-25 text-break font-weight-bold">{{ $t('message.metadata.dimensions') }}</td>
              <td>
                <div v-for="(dimension, i) of getDimensions" :key="i">
                  <div v-if="showString(dimension)">
                    <app-link :to="dimension">{{ truncate(dimension, 75) }}</app-link>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showNumber(getNumSeries)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.numSeries')" >
                  {{ $t('message.metadata.numSeries') }}
                </tooltip>
              </td>
              <td>
                {{ getNumSeries }}
              </td>
            </tr>
            <tr v-if="showArray(getHasQualityAnnotations)">
              <td class="w-25 text-break font-weight-bold">{{ $t('message.metadata.qualityAnnotations') }}</td>
              <td>
                <div v-for="(hasQualityAnnotation, i) of getHasQualityAnnotations" :key="i">
                  <div v-if="showString(hasQualityAnnotation)">
                    <app-link :to="hasQualityAnnotation">{{ truncate(hasQualityAnnotation, 75) }}</app-link>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getStatUnitMeasures)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.unitsOfMeasurement')" >
                  {{ $t('message.metadata.unitsOfMeasurement') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(statUnitMeasure, i) of getStatUnitMeasures" :key="i">
                  <div v-if="showString(statUnitMeasure)">
                    <app-link :to="statUnitMeasure">{{ truncate(statUnitMeasure, 75) }}</app-link>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getIsReferencedBy)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.isReferencedBy')">
                  {{ $t('message.metadata.isReferencedBy') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(reference, i) of getIsReferencedBy" :key="i">
                  <div v-if="showString(reference)">
                    <a :href="appendCurrentLocaleToURL(reference)">{{ truncate(reference, 75) }}</a>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getQualifiedAttributions)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.qualifiedAttribution')">
                  {{ $t('message.metadata.qualifiedAttribution') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(qualifiedAttribution, i) of getQualifiedAttributions" :key="i">
                  <div v-if="showString(qualifiedAttribution)">
                    <a :href="appendCurrentLocaleToURL(qualifiedAttribution)">{{ truncate(qualifiedAttribution, 75) }}</a>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getWasGeneratedBy)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.wasGeneratedBy')">
                  {{ $t('message.metadata.wasGeneratedBy') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(wasGeneratedBy, i) of getWasGeneratedBy" :key="i">
                  <div v-if="showString(wasGeneratedBy)">
                    <a :href="appendCurrentLocaleToURL(wasGeneratedBy)">{{ truncate(wasGeneratedBy, 75) }}</a>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showObjectArray(getQualifiedRelations)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.qualifiedRelation')" >
                  {{ $t('message.metadata.qualifiedRelation') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(qualifiedRelation, i) of getQualifiedRelations" :key="i">
                  <div v-if="has(qualifiedRelation, 'relation') && !isNil(qualifiedRelation.relation)">
                    {{ $t('message.metadata.relation') }}:
                    <div v-for="(relation, i) of qualifiedRelation.relation" :key="i" class="d-inline-table">
                      <div v-if="showString(relation)">
                        <a :href="appendCurrentLocaleToURL(relation)">{{ truncate(relation, 75) }}</a>
                      </div>
                    </div>
                  </div>
                  <div v-if="has(qualifiedRelation, 'had_role') && !isNil(qualifiedRelation.had_role)">
                    {{ $t('message.metadata.role') }}:
                    <div v-for="(role, i) of qualifiedRelation.had_role" :key="i" class="d-inline-table">
                      <div v-if="showString(role)">
                        <a :href="appendCurrentLocaleToURL(role)">{{ truncate(role, 75) }}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getSample)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.sample')">
                  {{ $t('message.metadata.sample') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(sample, i) of getSample" :key="i">
                  <div v-if="showString(sample)">
                    <a :href="appendCurrentLocaleToURL(sample)">{{ truncate(sample, 75) }}</a>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getSpatialResolutionInMeters)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.spatialResolutionInMeters')">
                  {{ $t('message.metadata.spatialResolutionInMeters.label') }}
                </tooltip>
              </td>
              <td>
                <div v-if="showNumber(getSpatialResolutionInMeters[0])">
                  {{ $t('message.metadata.spatialResolutionInMeters.value', {number: getSpatialResolutionInMeters[0]}) }}
                </div>
              </td>
            </tr>
            <tr v-if="showObject(getType)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.type')">
                  {{ $t('message.metadata.type') }}
                </tooltip>
              </td>
              <td>
                <div v-if="has(getType, 'label') && !isNil(getType.label)">
                  {{ $t('message.metadata.label') }}:
                  {{ getType.label }}
                </div>
                <div v-if="has(getType, 'resource') && !isNil(getType.resource)">
                  {{ $t('message.metadata.resource') }}:
                  <a :href="appendCurrentLocaleToURL(getType.resource)">{{ truncate(getType.resource, 75) }}</a>
                </div>
              </td>
            </tr>
            <tr v-if="showArray(getTemporalResolution)">
              <td class="w-25 text-break font-weight-bold">
                <tooltip :title="$t('message.tooltip.datasetDetails.temporalResolution')">
                  {{ $t('message.metadata.temporalResolution') }}
                </tooltip>
              </td>
              <td>
                <div v-for="(temporalResolution, i) of getTemporalResolution" :key="i">
                  {{ formatDatetime(temporalResolution) }}
                </div>
              </td>
            </tr>
<!--          </tbody>-->
        </table>
        <div class="additional-information-overlay" ref="overlay" v-show="showMoreVisible && !expanded"></div>
      </div>
    </div>
    <pv-show-more
      v-if="showMoreVisible"
      :label="expanded? $t('message.metadata.showLess') : $t('message.metadata.showMore')"
      :upArrow="expanded"
      :action="toggleExpanded"
      class="row text-primary"
    />
  </div>
</template>

<script>
import {isArray, isNil, isString, has} from "lodash";
import {mapGetters} from "vuex";
import {removeMailtoOrTel, truncate, appendCurrentLocaleToURL, getTranslationFor, formatDatetime } from "../utils/helpers";
import AppLink from "../widgets/AppLink";
import Tooltip from "../widgets/Tooltip";

export default {
  name: "DatasetDetailsProperties",
  components: {
    // DatasetDetailsFeatureHeader,
    Tooltip, AppLink},
  props: {
    filterDateFormatEU: Function,
    showObjectArray: Function,
    showArray: Function,
    showObject: Function,
    showNumber: Function,
    showString: Function
  },
  data() {
    return {
      infoVisible: true,
      initialHeight: 0,
      restrictedHeight: 100,
      expanded: false
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      // DCAT-AP.de
      'getDataset',
      'getAvailability',
      'getPoliticalGeocodingLevelURI',
      'getPoliticalGeocodingURI',
      'getContributorID',
      'getGeocodingDescriptionDe',
      'getLegalBasis',
      'getQualityProcessURI',
      'getTypeDe',
      'getReferences',
      'getContributor',
      'getOriginator',
      'getMaintainer',
      //
      'getSources',
      'getAccessRights',
      'getAccrualPeriodicity',
      'getAttributes',
      'getCatalogRecord',
      'getConformsTo',
      'getContactPoints',
      'getCreator',
      'getDimensions',
      'getDocumentations',
      'getFrequency',
      'getHasQualityAnnotations',
      'getHasVersion',
      'getIdentifiers',
      'getIsVersionOf',
      'getIsReferencedBy',
      'getLandingPages',
      'getLanguages',
      'getModificationDate',
      'getNumSeries',
      'getOtherIdentifiers',
      'getProvenances',
      'getPublisher',
      'getRelatedResources',
      'getReleaseDate',
      'getResource',
      'getSample',
      'getSpatial',
      'getSpatialResolutionInMeters',
      'getSpatialResource',
      'getStatUnitMeasures',
      'getTemporal',
      'getTemporalResolution',
      'getType',
      'getVersionInfo',
      'getVersionNotes',
      'getQualifiedAttributions',
      'getQualifiedRelations',
      'getWasGeneratedBy',
      'getDatasetDescriptionHeight'
    ]),
    // Provides resource data only of landing pages
    // Example: [{ format: 'bar', resource: 'foo' }, ...] -> ['foo']
    getLandingPagesResource() {
      return isArray(this.getLandingPages) && this.getLandingPages.map(value => value && value.resource);
    },
    // Returns the label property of accrual periodicity
    getAccrualPeriodicityLabel() {
      return !isNil(this.getAccrualPeriodicity) && has(this.getAccrualPeriodicity, 'label') ? this.getAccrualPeriodicity.label : '';
    },
    showMoreVisible() {
      return this.initialHeight > this.restrictedHeight;
    }
  },
  methods: {
    isNil,
    truncate,
    isString,
    has,
    removeMailtoOrTel,
    appendCurrentLocaleToURL,
    getTranslationFor,
    formatDatetime,
    toggleInfo() {
      this.infoVisible = !this.infoVisible;
    },
    showContactPoint(contactPoints) {
      return Object.keys(contactPoints[0]).filter(contactPoint => contactPoint !== 'resource' && contactPoint !== 'type').length > 0;
    },
    toggleExpanded() {
      this.expanded = ! this.expanded;
      this.adaptHeight();
    },
    adaptHeight() {
      this.$refs.dsdProperties.style['flex'] = this.expanded ? "0 0 100%": `0 0 ${this.restrictedHeight}px`;
      this.$refs.dsdProperties.style['max-height'] = this.expanded ? "100%": `${this.restrictedHeight}px`;
      // this.$refs.dsdProperties.style['overflow-y'] = this.expanded ? "auto": "hidden";
    }
  },
  mounted() {
    this.initialHeight = this.$refs.dsdProperties.clientHeight;
    this.$refs.overlay.style.bottom = (this.$refs.dsdProperties.offsetHeight - this.$refs.dsdProperties.clientHeight) + "px";
    if (this.getDatasetDescriptionHeight >= this.initialHeight) {
      this.restrictedHeight = this.getDatasetDescriptionHeight;
      this.toggleExpanded()
    } else if ((this.getDatasetDescriptionHeight >= this.restrictedHeight) && (this.getDatasetDescriptionHeight <= this.initialHeight)) {
      this.restrictedHeight = this.getDatasetDescriptionHeight
    }
    this.adaptHeight();
  }
}
</script>

<style scoped lang="scss">
.arrow {
  cursor: pointer;
}

.additional-information-overlay {
  width: 100%;
  height: 100px;
  position: absolute;
  left: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0, white 100%);
  pointer-events: none;
}
table {
  background: #F5F5F5;
}

.text-break {
  //word-break: normal !important;
}

.w-25 {
  min-width: 160px;
}

tr {
  width: 100%;
}
</style>
