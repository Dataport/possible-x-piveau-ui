<template>
    <div class="mt-2" v-if="pageLoaded">
        <!-- <details>{{ values }}</details> -->
        <div class="overviewHeader p-3">
            <div class="firstRow d-flex  ">
                <div class="datasetNotation dsd-title-tag d-flex align-items-center"><span>Dataset</span></div>
                <h1 class="dsTitle"> {{ getTitle() }}</h1>
            </div>
            <div class="secondRow d-flex justify-content-between">
                <div class="dsCatalogue ">
                    <span><b>Catalog:</b></span>
                    <a href="">
                        {{ checkIfPropertySet(getDatasets, 'dcat:catalog') }}
                    </a>

                </div>
                <div class="dsPublisher">
                    <span><b>Published by:</b></span>
                    <a> {{ checkIfPropertyValueSet(getDatasets, 'dct:publisher', 'name') }}</a>
                </div>
                <div class="dsIssued ">
                    <span><b>Issued:</b></span>
                    <a>
                        {{ new Date(checkIfPropertyValueSet(getDatasets, 'dct:issued', '@value')).toDateString() }}
                        <!-- {{ new Date(getDatasets['dct:modified']).toISOString().split('T')[0] }} -->
                    </a>
                </div>
                <div class="dsUpdated ">
                    <span><b>Updated:</b></span>
                    <a>
                        {{ new Date(checkIfPropertyValueSet(getDatasets, 'dct:modified', '@value')).toDateString() }}
                        <!-- {{ new Date(getDatasets['dct:modified']).toISOString().split('T')[0] }} -->
                    </a>
                </div>
            </div>
        </div>
        <div class="dsMainWrap d-flex flex-column mt-3">
            <div class="">
                <p class="dsDesc px-3">
                    {{ getDescription() }}
                </p>
            </div>
            <div class="">

                <table class="table table-borderless table-responsive  bg-light disOverview p-3">
                    <div v-for="(value, name, index) in tableProperties" :key="index">
                        <!-- <details>{{ values }}</details> -->
                        <PropertyEntry v-if="trigger" profile="datasets" :data="values" :property="name" :value="value"
                            :dpiLocale="dpiLocale"></PropertyEntry>
                    </div>
                </table>
            </div>
        </div>
        <div class="dsDist b-top p-3" v-if="getDistributions.length > 0">
            <h2 class="my-4">{{ $t('message.metadata.distributions') }} ({{ getDistributions.length }})</h2>
            <DistributionOverview :dpiLocale="dpiLocale" :distributions="getDistributions"></DistributionOverview>
        </div>
        <div class="dsKeywords b-top my-2 p-3"
            v-if="getDatasets['dct:keyword'] != undefined && getDatasets['dct:keyword'][0]['@value'] != undefined && getDatasets['dct:keyword'].length > 0">
            <h2 class="my-4">Keywords <span>({{ getDatasets['dct:keyword'].length }})</span></h2>
            <div class="d-flex">
                <span class="mx-1"
                    v-for="( element, index ) in  getDatasets['dct:keyword'].filter(el => el['@language'] === dpiLocale)"
                    :key="index">
                    <small :title="element"
                        class="d-inline-block w-100 p-2 ml-1 rounded-pill text-center text-white text-truncate bg-primary">
                        {{ element['@value'] }}
                    </small>
                </span>
            </div>
        </div>
    </div>
</template>

<script>

import PropertyEntry from './PropertyEntry.vue';
import DistributionOverview from './DistributionOverview.vue';
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
    data() {
        return {
            trigger: true,
            values: [],
            pageLoaded: false,
            tableProperties: {
                // 'dct:publisher': { type: 'conditional', voc: 'corporate-body', label: 'message.metadata.publisher' },
                'dcat:contactPoint': { type: 'special', voc: '', label: 'message.metadata.contactPoints' },
                'dct:creator': { type: 'special', voc: '', label: 'message.metadata.creator' },
                // 'dct:issued': { type: 'date', label: 'message.metadata.created' },
                // 'dct:modified': { type: 'date', label: 'message.metadata.updated' },
                'dct:language': { type: 'multiURI', voc: 'language', label: 'message.metadata.languages' },
                'dct:subject': { type: 'multiURI', voc: 'eurovoc', label: 'message.dataupload.datasets.subject.label' },
                'dcat:theme': { type: 'multiURI', voc: 'data-theme', label: 'message.dataupload.datasets.theme.label' },
                'dct:type': { type: 'singularURI', voc: 'dataset-type', label: 'message.metadata.type' },
                'dct:source': { type: 'multiURL', voc: '', label: 'message.metadata.sources' },
                'dct:identifier': { type: 'multiString', voc: '', label: 'message.metadata.identifiers' },
                'adms:identifier': { type: 'special', voc: '', label: 'message.metadata.otherIdentifiers' },
                'foaf:page': { type: 'special', voc: '', label: 'message.dataupload.datasets.page.label' },
                'dcat:landingPage': { type: 'multiURL', voc: '', label: 'message.metadata.landingPage' },
                'dct:provenance': { type: 'multiString', voc: '', label: 'message.metadata.provenances' },
                'dct:accrualPeriodicity': { type: 'singularURI', voc: 'frequency', label: 'message.metadata.accrualPeriodicity' },
                'dct:accessRights': { type: 'singularURI', voc: 'access-right', label: 'message.metadata.accessRights' },
                'dct:conformsTo': { type: 'special', voc: '', label: 'message.metadata.conformsTo' },
                'dct:relation': { type: 'multiURL', voc: '', label: 'message.dataupload.datasets.relation.label' },
                'dcat:qualifiedRelation': { type: 'multiURL', voc: '', label: 'message.dataupload.datasets.qualifiedRelation.label' },
                'prov:qualifiedAttribution': { type: 'multiURL', voc: '', label: 'message.dataupload.datasets.qualifiedAttribution.label' },
                'dct:spatial': { type: 'multiURI', voc: '', label: 'message.metadata.spatial' },
                'dcat:spatialResolutionInMeters': { type: 'singularString', voc: '', label: 'message.dataupload.datasets.spatialResolutionInMeters.label' },
                'dct:temporal': { type: 'special', voc: '', label: 'message.metadata.temporal' },
                'dcat:temporalResolution': { type: 'special', voc: '', label: 'message.dataupload.datasets.temporalResolution.label' },
                'dct:isReferencedBy': { type: 'multiURL', voc: '', label: 'message.dataupload.datasets.isReferencedBy.label' },
                'prov:wasGeneratedBy': { type: 'multiURL', voc: '', label: 'message.dataupload.datasets.wasGeneratedBy.label' },
                'dct:isVersionOf': { type: 'multiURL', voc: '', label: 'message.metadata.isVersionOf' },
                'dext:metadataExtension': { type: 'multiURL', voc: '', label: 'message.dataupload.datasets.isUsedBy.label' },
                'dct:hasVersion': { type: 'multiURL', voc: '', label: 'message.metadata.hasVersion' },
                'owl:versionInfo': { type: 'singularString', voc: '', label: 'message.metadata.versionInfo' },
                'adms:versionNotes': { type: 'multiLingual', voc: '', label: 'message.metadata.versionNotes' },
                'dcatde:qualityProcessURI': { type: 'singularURI', voc: '', label: 'message.dataupload.datasets.qualityProcessURI.label' },
                'dct:references': { type: 'singularURI', voc: '', label: 'message.dataupload.datasets.references.label' },
                'dcatde:legalBasis': { type: 'multiLingual', voc: '', label: 'message.dataupload.datasets.legalBasis.label' },
                'dct:contributor': { type: 'special', voc: '', label: 'message.dataupload.datasets.contributor.label' },
                'dcatde:contributorID': { type: 'multiURI', voc: 'contributors', label: 'message.dataupload.datasets.contributorID.label' },
                'dcatde:originator': { type: 'special', voc: '', label: 'message.dataupload.datasets.originator.label' },
                'dcatde:maintainer': { type: 'special', voc: '', label: 'message.dataupload.datasets.maintainer.label' },
                'dcatap:availability': { type: 'singularURI', voc: 'planned-availability', label: 'message.dataupload.datasets.availabilityDE.label' },
                'dcatde:geocodingDescription': { type: 'multiLingual', voc: '', label: 'message.dataupload.datasets.geocodingDescription.label' },
                'dcatde:politicalGeocodingLevelURI': { type: 'multiURI', voc: '', label: 'message.dataupload.datasets.politicalGeocodingLevelURI.label' },
                'dcatde:politicalGeocodingURI': { type: 'multiURI', voc: '', label: 'message.dataupload.datasets.politicalGeocodingURI.label' },
            }
        }
    },
    props: {
        dpiLocale: String,

    },
    components: {
        PropertyEntry,
        DistributionOverview,
    },
    computed: {
        ...mapGetters('dpiStore', [
            'getData',
        ]),
        getDatasets() {
            return this.getData('datasets');
        },
        getDistributions() {
            return this.getDatasets['distributionList'] || [];
        },
        showTable() {
            return Object.keys(this.tableProperties).filter(prop => this.getDatasets[prop]).length > 0;
        },

    },
    methods: {
        ...mapActions("dpiStore", [
            "requestFirstEntrySuggestions",
            "requestAutocompleteSuggestions",
            "requestResourceName",
        ]),
        checkIfPropertySet(data, property) {
            if (data[property] != undefined) return data[property]
            else {
                return "No data available"
            }
        },
        checkIfPropertyValueSet(data, property, value) {
            if (data[property] != undefined && data[property][value] != undefined) return data[property][value]
            else {
                return "No data available"
            }
        },
        getTitle() {
            return this.getDatasets['dct:title'] && this.getDatasets['dct:title'].filter(el => el['@language'] === this.dpiLocale).map(el => el['@value'])[0];
        },
        getDescription() {
            return this.getDatasets['dct:description'] && this.getDatasets['dct:description'].filter(el => el['@language'] === this.dpiLocale).map(el => el['@value'])[0];
        },
        async reqName(URI) {
            let nameOfProperty = URI.split('/')
            let req = `${this.$env.api.baseUrl}vocabularies/${nameOfProperty[nameOfProperty.length - 2]}/${nameOfProperty[nameOfProperty.length - 1]}`

            const data = await axios.get(req)
            return data['data']['result']['pref_label'][this.dpiLocale]
        }
    },
    async mounted() {
        this.$nextTick(() => {
            this.pageLoaded = true;
            this.values = this.getDatasets
        })


    },
    watch: {
        // ugly solution needs rework
        getDatasets: function (e) {
            this.trigger = false
            this.values = e
            this.$nextTick(() => {
                this.trigger = true;
            })
        }

    }
}
</script>

<style>
.overviewHeader {

    border-bottom: 1px solid lightgray
}

.firstRow {
    align-items: center;
}

.dsDist td:first-child {
    padding: 1rem;
    width: 25%;

}

.disOverview td:first-child {
    min-width: 25%;
}

.disOverview td:last-child {
    width: 75%;
}

.b-top {
    border-top: 1px solid lightgray
}

.dist-edit {
    cursor: pointer
}
</style>
