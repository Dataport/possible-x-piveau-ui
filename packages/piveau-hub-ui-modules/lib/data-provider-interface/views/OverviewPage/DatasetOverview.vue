<template>
    <div>
        <div class="mt-2" v-if="pageLoaded">
            <div class="overviewHeader p-3">
                <div class="firstRow d-flex ">
                    <div class="datasetNotation dsd-title-tag d-flex align-items-center"><span>Dataset</span></div>
                    <h1 class="dsTitle"> {{ getData('datasets')['dct:title'][0]['@value'] }}</h1>
                </div>
                <div class="secondRow d-flex justify-content-between">
                    <div class="dsCatalogue ">
                        <span><b>Catalog:</b></span>
                        <a href="">
                            {{ checkIfSet(getData('datasets')['dct:catalog']) }}
                        </a>

                    </div>
                    <div class="dsPublisher">
                        <span><b>Publisher:</b></span>
                        <a href="">
                            {{ checkIfSet(getData('datasets')['dct:publisher']) }}

                        </a>
                    </div>
                    <div class="dsUpdated ">
                        <span><b>Updated:</b></span>
                        <a>
                            {{ checkIfSet(new Date(getData('datasets')['dct:modified'])).toISOString().split('T')[0] }}
                            <!-- {{ new Date(getData('datasets')['dct:modified']).toISOString().split('T')[0] }} -->
                        </a>

                    </div>
                </div>
            </div>
            <div class="dsMainWrap d-flex flex-column mt-3">
                <div class="">
                    <p class="dsDesc px-3">
                        {{ getData('datasets')['dct:description'].filter(el => el['@language'] ===
                            dpiLocale).map(el =>
                                el['@value'])[0] }}
                    </p>

                </div>
                <div class="">
                    <table class="table table-borderless table-responsive  bg-light disOverview p-3">
                        <div v-for="(value, name, index) in tableProperties" :key="index">
                            <PropertyEntry :data="getData('datasets')" profile="datasets" :property="name" :value="value"
                                :dpiLocale="dpiLocale"></PropertyEntry>
                        </div>
                    </table>
                </div>
            </div>
            <div class="dsDist b-top p-3" v-if="getData('distributions').length > 0">
                <h2 class="my-4">{{ $t('message.metadata.distributions') }} ({{ getData('distributions').length
                }})</h2>
                <table class="w-100">
                    <tr class="">
                        <th class="">Link to the Data</th>
                        <th class="">Format</th>
                        <th class="">Updated</th>
                        <th class="">Actions</th>
                    </tr>
                    <tr class="border-bottom" v-for="(distribution, id) in getData('distributions')"
                        :key="`distribution${id + 1}`">
                        <td>
                            {{ distribution['dct:title'].filter(el => el['@language'] === dpiLocale).map(el =>
                                el['@value'])[0] }}

                        </td>
                        <td>
                            <!-- {{distribution}} -->
                            {{ distribution['dct:format'] }}
                        </td>
                        <td>
                            {{ new Date(distribution['dct:modified']).toISOString().split('T')[0] }}
                        </td>
                        <td>
                            <div class="dist-edit justify-content-end">
                                <a href="">more info</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="dsKeywords b-top my-2 p-3"
                v-if="getData('datasets')['dcat:keyword'] != undefined && getData('datasets')['dcat:keyword'][0]['@language'] != undefined && getData('datasets')['dcat:keyword'].length > 0">
                <h2 class="my-4">Keywords <span>({{ getData('datasets')['dcat:keyword'].length }})</span></h2>
                <div class="d-flex">
                    <span class="mx-1"
                        v-for="(element, index) in getData('datasets')['dcat:keyword'].filter(el => el['@language'] === dpiLocale)"
                        :key="index">
                        <small :title="element"
                            class="d-inline-block w-100 p-2 ml-1 rounded-pill text-center text-white text-truncate bg-primary">
                            {{ element['@value'] }}
                        </small>
                    </span>
                </div>
            </div>
            <!-- <div class="dsDocumentation b-top">
                <h2 class="my-4">Documentation <span>({{ }})</span></h2>
            </div> -->
        </div>
    </div>
</template>

<script>
import PropertyEntry from './PropertyEntry.vue';
import DistributionOverview from './DistributionOverview.vue';
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            pageLoaded: false,
            pageData: {},
            tableProperties: {
                'dct:publisher': { type: 'conditional', voc: 'corporate-body', label: 'message.metadata.publisher' },
                'dcat:contactPoint': { type: 'special', voc: '', label: 'message.metadata.contactPoints' },
                'dct:creator': { type: 'special', voc: '', label: 'message.metadata.creator' },
                'dct:issued': { type: 'date', label: 'message.metadata.created' },
                'dct:modified': { type: 'date', label: 'message.metadata.updated' },
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
                'dct:spatial': { type: 'multiURISpatial', voc: '', label: 'message.metadata.spatial' },
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
                'dcatde:politicalGeocodingURI': { type: 'multiURIspecial', voc: '', label: 'message.dataupload.datasets.politicalGeocodingURI.label' },

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
        showTable() {
            return Object.keys(this.tableProperties).filter(prop => this.getData('datasets')[prop]).length > 0;
        }
    },
    mounted() {
        this.$nextTick(() => {
            // console.log(this.getData('datasets')['dcat:keyword']);
            this.pageLoaded = true
        })
    },
    methods: {
        checkIfSet(data) {
            // console.log(data);
            if (data != undefined) return data
            else return "unset"


        }
    }
}
</script>
<style>
.overviewHeader {
   
    border-bottom: 1px solid lightgray
}

.dsMainWrap,
.fiftyfifty {
    flex-grow: 1;
}

.fiftyfifty {
    max-width: 50%;
}

.dsDist {}

.dsDist th {
    padding: 1rem;
    background-color: #f2f4f8;
}

.dsDist td {
    padding: 1rem;

}

.b-top {
    border-top: 1px solid lightgray
}
</style>