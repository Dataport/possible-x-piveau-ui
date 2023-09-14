<template>
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
                        {{ reqName(getData('datasets')['dct:publisher']) }}
                        <!-- {{getData('datasets')['dct:publisher']}} -->
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
                    <!-- ToDo integrate Weblate -->
                    <th class="">Name of the Distribution</th>
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
                            <DistributionModal :distributionData="distribution" :locale="dpiLocale"></DistributionModal>
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
    </div>
</template>

<script>
import DistributionModal from './DistributionModal.vue'
import PropertyEntry from './PropertyEntry.vue';
import DistributionOverview from './DistributionOverview.vue';
import { mapGetters, mapActions } from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import Distribution from '../../../datasetDetails/distributions/Distribution.vue';



export default {
    data() {
        return {
            pageLoaded: false,
            pageData: {},
            URIcache: "",
            tableProperties: {
                'dct:publisher': { type: 'conditional', voc: 'corporate-body', label: 'message.metadata.publisher' },
                'dcat:contactPoint': { type: 'special', voc: '', label: 'message.metadata.contactPoints' },
            }
        }
    },
    methods: {
        ...mapActions("dpiStore", [
            "requestFirstEntrySuggestions",
            "requestAutocompleteSuggestions",
            "requestResourceName",
        ]),
    },
    props: {
        dpiLocale: String,
    },
    components: {
        PropertyEntry,
        DistributionOverview,
        DistributionModal,
        Distribution,

    },
    computed: {
        ...mapGetters('dpiStore', [
            'getData',
        ]),

        showTable() {
            return Object.keys(this.tableProperties).filter(prop => this.getData('datasets')[prop]).length > 0;
        }

    },
    created() {

    },
    async mounted() {
        this.$nextTick(() => {
            console.log("loaded");
            this.pageLoaded = true
        })
    },
    updated() {

    },
    methods: {
        checkIfSet(data) {
            if (data != undefined) return data
            else return "unset"
        },

        async reqName(URI) {
            let nameOfProperty = URI.split('/')
            let req = `${Vue.prototype.$env.api.baseUrl}vocabularies/${nameOfProperty[nameOfProperty.length - 2]}/${nameOfProperty[nameOfProperty.length - 1]}`

            const data = await axios.get(req)
            console.log(data['data']['result']['pref_label'][this.dpiLocale]);
            return data['data']['result']['pref_label'][this.dpiLocale]
        }
    }
}
</script>
<style>
.overviewHeader {

    border-bottom: 1px solid lightgray
}

.dsDist tr {
    display: table-row !important;
}

.dsDist td {
    padding: 1rem;

}

.dsDist th {
    padding: 1rem;
    background-color: #f2f4f8;
}

.b-top {
    border-top: 1px solid lightgray
}
.dist-edit{
    cursor:pointer
}
</style>
