<template>
    <div>
        <!-- DISTRIBUTIONS -->
        <div class="col-10 offset-1 py-2 text-left">
            <h2>{{ $t('message.metadata.distributions') }} ({{ getData('distributions').length }})</h2>
        </div>
        <ul class="list list-unstyled col-12" v-if="getData('distributions').length > 0">
            <li class="row border-bottom mt-2" v-for="(distribution, id) in getData('distributions')"
                :key="`distribution${id + 1}`">
                <!-- DISTRIBUTIONS FORMAT -->
                <span class="d-inline-block col-md-1 col-2 pr-md-1 pr-0 m-md-0 m-auto">
                    <div v-if="showValue(distribution, 'dct:format')"
                        class="circle float-md-right text-center text-white text-truncate"
                        :type="getDistributionFormat(distribution)" :title="getDistributionFormat(distribution)">
                        <span>
                            {{ truncate(getDistributionFormat(distribution), 4, true) }}
                        </span>
                    </div>
                    <div v-else class="circle float-md-right text-center text-white text-truncate" type="UNKNOWN"
                        title="UNKNOWN"><span>UNKNOWN</span></div>
                </span>
                <span class="col-10 mb-3">
                    <span class="row">
                        <span class="d-inline-block col-12">
                            <!-- DISTRIBUTIONS TITLE -->
                            <span v-if="showValue(distribution, 'dct:title')">
                                <h6 class="font-weight-bold m-0">
                                    {{ distribution['dct:title'].filter(el => el['@language'] === dpiLocale).map(el =>
                                        el['@value'])[0] }}
                                </h6>
                            </span>
                            <!-- DISTRIBUTIONS DESCRIPTION -->
                            <span class="mt-2 text-muted text-truncate" v-if="showValue(distribution, 'dct:description')">
                                <small>
                                    {{ distribution['dct:description'].filter(el => el['@language'] ===
                                        dpiLocale).map(el => el['@value'])[0] }}
                                </small>
                            </span>
                        </span>
                    </span>
                    <span class="row bg-light mb-2 ">
                        <!-- DISTRIBUTIONS ACCESS URL -->
                        <table class="table table-borderless table-responsive pl-3 bg-light mb-0" v-if="showValue(distribution, 'dcat:accessURL')">
                            <tr v-for="(elem, index) in distribution['dcat:accessURL']" :key="index">
                                <td class="font-weight-bold w-25">
                                    {{ $t('message.metadata.accessUrl') }}:
                                </td>
                                <td class="w-75">
                                    <a :href="elem['@id']">
                                        {{ elem['@id'] }}
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <table class="table table-borderless table-responsive pl-3 bg-light">
                            <div v-for="(value, name, index) in tableProperties" :key="index">
                                <PropertyEntry profile="distributions" :data="getData('distributions')[id]" :property="name"
                                    :value="value" :dpiLocale="dpiLocale" :distId="id"></PropertyEntry>
                            </div>
                        </table>
                    </span>
                </span>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PropertyEntry from './PropertyEntry.vue';
import { has, isNil, isEmpty } from 'lodash';
import { truncate } from '../../../utils/helpers';

export default {
    props: {
        dpiLocale: String,
    },
    components: {
        PropertyEntry,
    },
    computed: {
        ...mapGetters('dpiStore', [
            'getData',
        ]),
    },
    methods: {
        truncate,
        getDistributionFormat(distribution) {
            return 'abc';
            // return distribution['dct:format']['@id'].substring(distribution['dct:format']['@id'].lastIndexOf('/') + 1);
        },
        showValue(property, value) {
            return has(property, value) && !isNil(property[value]) && !isEmpty(property[value]);
        },
    },
    data() {
        return {
            tableProperties: {
                'dcat:downloadURL': { type: 'multiURL', voc: '', label: 'message.metadata.downloadUrl' },
                'dcat:accessService': { type: 'special', voc: '', label: 'message.dataupload.distributions.accessService.label' },
                'dct:license': { type: 'singularURI', voc: '', label: 'message.metadata.license' },
                'dct:issued': { type: 'date', voc: '', label: 'message.metadata.created' },
                'dct:modified': { type: 'date', voc: '', label: 'message.metadata.updated' },
                'dct:type': { type: 'singularURI', voc: '', label: 'message.metadata.type' },
                'dcat:mediaType': { type: 'singularURI', voc: '', label: 'message.metadata.mediaType' },
                'dcatap:availability': { type: 'singularURI', voc: '', label: 'message.metadata.availability' },
                'dcat:byteSize': { type: 'singularString', voc: '', label: 'message.metadata.byteSize' },
                'dcat:packageFormat': { type: 'singularURI', voc: '', label: 'message.metadata.packageFormat' },
                'dcat:compressFormat': { type: 'singularURI', voc: '', label: 'message.metadata.compressFormat' },
                'adms:status': { type: 'singularURI', voc: '', label: 'message.metadata.status' },
                'dcat:spatialResolutionInMeters': { type: 'singularString', voc: '', label: 'message.metadata.spatialResolutionInMeters.label' },
                'dcat:temporalResolution': { type: 'special', voc: '', label: 'message.dataupload.datasets.temporalResolution.label' },
                'dct:conformsTo': { type: 'special', voc: '', label: 'message.metadata.conformsTo' },
                'dct:language': { type: 'multiURI', voc: '', label: 'message.metadata.languages' },
                'dct:rights': { type: 'singularString', voc: '', label: 'message.metadata.rights' },
                'foaf:page': { type: 'special', voc: '', label: 'message.dataupload.datasets.page.label' },
                'odrl:hasPolicy': { type: 'multiURL', voc: '', label: 'message.metadata.hasPolicy' },
                'spdx:checksum': { type: 'special', voc: '', label: 'message.metadata.checksum' },
                'dcatde:licenseAttributionByText': { type: 'multiLingual', voc: '', label: 'message.dataupload.distributions.licenseAttributionByText.label' },
            }
        }
    },
}
</script>

<style></style>