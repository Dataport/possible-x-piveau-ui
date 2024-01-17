<template>
    <div>
        <!-- DISTRIBUTIONS -->
        <div class="w-100 disDetailsWrap">
            <div class="tHeadWrap">
                <!-- ToDo integrate Weblate -->
                <p class="">Name of the Distribution</p>
                <p class="">Format</p>
                <p class="">Updated</p>
                <p class="">Actions</p>
            </div>
            <div v-for="( distribution, id) in disList" :key="'distribution' + id">

                <div class="tdWrap" v-if="id % 2 == 0">
                    <p v-if="distribution['dct:title'] != undefined && distribution['dct:title'].filter(el => el['@language'] === dpiLocale).map(el =>
                        el['@value'])[0]">
                        {{ distribution['dct:title'].filter(el => el['@language'] === dpiLocale).map(el =>
                            el['@value'])[0] }}
                    </p>
                    <p v-else>
                        No title in this language
                    </p>
                    <p v-if="distribution['dct:format'] != undefined">
                        {{ getDistributionFormat(distribution) }}
                    </p>
                    <p v-else>
                        No format provided
                    </p>
                    <p v-if="distribution['dct:modified'] != undefined && distribution['dct:modified']">
                        {{ new Date(distribution['dct:modified']).toDateString() }}
                    </p>
                    <p v-else>
                        -
                    </p>
                    <p>
                        <a class="moreDisInfoBtn" @click="unfoldDisDetails(id)">
                            More information
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-chevron-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </a>
                    </p>
                </div>
                <div class="tdWrap grey" v-else>
                    <p v-if="distribution['dct:title'] != undefined && distribution['dct:title'].filter(el => el['@language'] === dpiLocale).map(el =>
                        el['@value'])[0]">
                        {{ distribution['dct:title'].filter(el => el['@language'] === dpiLocale).map(el =>
                            el['@value'])[0] }}
                    </p>
                    <p v-else>
                        No title in this language
                    </p>
                    <p v-if="distribution['dct:format'] != undefined">
                        {{ getDistributionFormat(distribution) }}
                    </p>
                    <p v-else>
                        No format provided
                    </p>
                    <p v-if="distribution['dct:modified'] != undefined && distribution['dct:modified']">
                        {{ new Date(distribution['dct:modified']).toDateString() }}
                    </p>
                    <p v-else>
                        -
                    </p>
                    <p>
                        <a class="moreDisInfoBtn" @click="unfoldDisDetails(id)">
                            More information
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-chevron-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </a>
                    </p>
                </div>

                <div class="disInfoWrap">
                    <ul class="list list-unstyled" v-if="disList.length > 0">
                        <li class="disWrapper" :key="`distribution${id + 1}`">
                            <!-- DISTRIBUTIONS FORMAT -->

                            <span class=" mb-3 disDetails">
                                <span class="row">

                                </span>
                                <span class="row bg-light mb-2 ">
                                    <!-- DISTRIBUTIONS ACCESS URL -->
                                    <table class="table table-borderless table-responsive pl-3 bg-light mb-0"
                                        v-if="showValue(distribution, 'dcat:accessURL')">
                                        <tr v-for="( elem, index ) in  distribution['dcat:accessURL'] " :key="index">
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
                                        <div v-for="( value, name, index ) in  tableProperties " :key="index">
                                            <PropertyEntry profile="distributions" :data="disList['@id']"
                                                :property="name" :value="value" :dpiLocale="dpiLocale" :distId="id">
                                            </PropertyEntry>
                                        </div>
                                    </table>
                                </span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

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
        disList: {
            required:true
        }
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

            try {
                return distribution['dct:format'].split('/')[6];
            } catch (error) {
                return "No format provided"
            }

        },
        showValue(property, value) {
            return has(property, value) && !isNil(property[value]) && !isEmpty(property[value]);
        },
        unfoldDisDetails(e) {
            document.getElementsByClassName("tdWrap")[e].classList.toggle('dropShdw')
            document.getElementsByClassName("bi-chevron-down")[e].classList.toggle('turnChev')
            document.getElementsByClassName("disInfoWrap")[e].classList.toggle('openDisDetails')
        }
    },
    data() {
        return {
            showThis: false,
            disId: '',
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

<style>
.disDetailsWrap p {
    margin-bottom: 0;
}

.moreDisInfoBtn {
    cursor: pointer;
    transition: all 300ms ease-in-out;
}

.moreDisInfoBtn svg {

    transition: all 300ms ease-in-out;
}

.turnChev {
    transform: scale(-1);
}

.moreDisInfoBtn:hover {
    text-decoration: none;
}

.openDisDetails {
    max-height: 2000px !important;
}


.disDetails {
    width: 95%
}

.disInfoWrap {
    overflow: hidden;

    max-height: 0;
    height: auto;
    position: relative;
    z-index: 0;
    transition: all 500ms ease-in-out;
}

.grey {
    background: rgb(248, 248, 248);
}

.tHeadWrap {
    display: flex;
    padding: 1rem;
    background-color: #f2f4f8;
}

.tHeadWrap p {
    width: 25%;
    font-weight: bold;
}

.tdWrap {
    display: flex;
    padding: 1rem;
    position: relative;
    z-index: 1;
    transition: all 300ms ease-in-out;

}

.dropShdw {
    box-shadow: 0 3px 6px -6px black;
}

.tdWrap p {
    width: 25%;
    display: flex;
    align-items: center;
}
</style>