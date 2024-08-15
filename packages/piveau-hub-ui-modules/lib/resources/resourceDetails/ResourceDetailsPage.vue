<template>
    <div v-if="resourceDetailsData">
        <GenericSlotComponent :resourceDetailsData="resourceDetailsData"
            v-if="!customResources.includes(selectedResource)">
            <!-- <h1>Default setup</h1> -->

            <!-- <div>{{ resourceDetailsData }}</div> -->

            <div v-for="(value, key) in resourceDetailsData" :key="key">
                <DataRenderer :label="key" :value="value" v-show="value !== null && key !== 'id' && key !== 'name' && key !== 'description'" />
            </div>
        </GenericSlotComponent>

        <GenericSlotComponent :resourceDetailsData="resourceDetailsData" v-else>
            <!-- <i>Your custom details page content can be added here</i> -->
            <!-- <div v-for="(value, key) in resourceDetailsData" :key="key">
                <DataRenderer :label="key" :value="value" v-show="value !== null && key !== 'id' && key !== 'name' && key !== 'description'" />
            </div> -->
            <!-- <div>{{ resourceDetailsData }}</div> -->

            <CustomResourceRenderer :resource="selectedResource" :resourceDetailsData="resourceDetailsData" />
        </GenericSlotComponent>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, defineComponent } from 'vue';
import { useRoute } from 'vue-router';

import { storeToRefs } from 'pinia';
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';

import { useResourcesStore } from '../../store/resourcesStore'
import { useResourceDetailsStore } from '../../store/resourceDetailsStore';

import DataRenderer from './DataRenderer.vue';
import CustomResourceRenderer from './CustomResourceRenderer.vue';
import GenericSlotComponent from './GenericSlotComponent.vue'

const resourcesStore = useResourcesStore();
const resourceDetailsStore = useResourceDetailsStore();
const { resourceDetailsData } = storeToRefs(resourceDetailsStore);
const { fetchResourceDetails, resetResourceDetails } = resourceDetailsStore;

const route = useRoute();
const ENV = useRuntimeEnv();

// Map resource IDs from kebap-case to camel-case
const resourceMapping:object = ENV.content.resources.resourceMapping;

let type = route.params.resource_type;
let id = route.params.resource_id;

const selectedResource = resourceMapping[type as keyof object];
const customResources = ENV.content.resourceDetails.customResources;

onMounted(async () => {
    await fetchResourceDetails(type, id);
});
</script>