<template>
    <div>
        <!-- DATASET ID && CATALOG -->
        <div class="mt-5 mb-0" >
            <div class="row">

            <!-- DATASET ID -->
            <div class="col-5 offset-1" v-if="getData('datasets')['datasetID']">
                <p class="mb-0">
                <span class="font-weight-bold">Dataset ID:</span>
                {{ getData('datasets')['datasetID'] }}</p>
            </div>

            <!-- CATALOG -->
            <div class="col-5" v-if="getData('datasets')['dct:catalog']">
                <p class="mb-0">
                <span class="font-weight-bold">Catalog:</span>
                {{ getData('datasets')['dct:catalog'] }}</p>
            </div>
            </div>
            <hr>
        </div>

        <!-- TITLE -->
        <div class="mt-2 mb-4" v-if="getData('datasets')['dct:title']">
            <div class="row">
            <div class="col-8 offset-1">
                <h2>
                    {{getData('datasets')['dct:title'].filter(el => el['@language'] === dpiLocale).map(el => el['@value'])[0]}}
                </h2>
            </div>
            </div>
        </div>

        <!-- DESCRIPTION -->
        <div class="mt-2" v-if="getData('datasets')['dct:description']">
            <div class="row">
            <div class="col-10 offset-1">
                <p>
                {{getData('datasets')['dct:description'].filter(el => el['@language'] === dpiLocale).map(el => el['@value'])[0]}}
                </p>
            </div>
            </div>
            <hr>
        </div>

        <DistributionOverview :dpiLocale="dpiLocale"></DistributionOverview>

        <!-- KEYWORDS -->
        <div class="mt-2" v-if="getData('datasets')['dcat:keyword'] && getData('datasets')['dcat:keyword'].filter(el => el['@language'] === dpiLocale).length > 0">
            <div class="row">
            <div class="col-10 offset-1">
                <div class="row">
                <span class="col-4 col-sm-3 col-md-2 mt-md-0 mt-3 pr-0" v-for="(element, index) in getData('datasets')['dcat:keyword'].filter(el => el['@language'] === dpiLocale)" :key="index">
                    <small :title="element"
                    class="d-inline-block w-100 p-2 ml-1 rounded-pill text-center text-white text-truncate bg-primary">
                    {{ element['@value'] }}
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

                    <div v-for="(value, name, index) in tableProperties" :key="index">
                        <PropertyEntry :data="getData('datasets')" profile="datasets" :property="name" :value="value" :dpiLocale="dpiLocale"></PropertyEntry>
                    </div>    
                </table>
            </div>
            </div>
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
            tableProperties: {
                'dct:publisher': {type: 'singularURI', voc: 'corporate-body', label: 'message.metadata.publisher' }, 
                'dcat:contactPoint': { type: 'special', voc: '', label: 'message.metadata.contactPoints'},
                'dct:creator': {type: 'special', voc: '', label: 'message.metadata.creator'},
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
                'dcat:landingPage': { type:'multiURL', voc: '', label:'message.metadata.landingPage' },
                'dct:provenance': { type:'multiString', voc: '', label:'message.metadata.provenances' },
                'dct:accrualPeriodicity': { type:'singularURI', voc: 'frequency', label:'message.metadata.accrualPeriodicity' },
                'dct:accessRights': { type:'singularURI', voc: 'access-right', label:'message.metadata.accessRights' },
                'dct:conformsTo': { type: 'special', voc: '', label: 'message.metadata.conformsTo' },
                'dct:relation': { type:'multiURL', voc: '', label:'message.dataupload.datasets.relation.label' },
                'dcat:qualifiedRelation': { type:'multiURL', voc: '', label:'message.dataupload.datasets.qualifiedRelation.label' },
                'prov:qualifiedAttribution': { type:'multiURL', voc: '', label:'message.dataupload.datasets.qualifiedAttribution.label' },
                'dct:spatial': { type: 'singularURI', voc: '', label: 'message.metadata.spatial' },
                'dcat:spatialResolutionInMeters': { type: 'singularString', voc: '', label: 'message.dataupload.datasets.spatialResolutionInMeters.label' },
                'dct:temporal': { type: 'special', voc: '', label: 'message.metadata.temporal' },
                'dcat:temporalResolution': { type: 'special', voc: '', label: 'message.dataupload.datasets.temporalResolution.label' },
                'dct:isReferencedBy': { type:'multiURL', voc: '', label:'message.dataupload.datasets.isReferencedBy.label' },
                'prov:wasGeneratedBy': { type:'multiURL', voc: '', label:'message.dataupload.datasets.wasGeneratedBy.label' },
                'dct:isVersionOf': { type:'multiURL', voc: '', label:'message.metadata.isVersionOf' },
                'dext:metadataExtension': { type:'multiURL', voc: '', label:'message.dataupload.datasets.isUsedBy.label' },
                'dct:hasVersion': { type:'multiURL', voc: '', label:'message.metadata.hasVersion' },
                'owl:versionInfo': { type: 'singularString', voc: '', label: 'message.metadata.versionInfo' },
                'adms:versionNotes': { type: 'multiLingual', voc: '', label: 'message.metadata.versionNotes' }
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
    }
}
</script>