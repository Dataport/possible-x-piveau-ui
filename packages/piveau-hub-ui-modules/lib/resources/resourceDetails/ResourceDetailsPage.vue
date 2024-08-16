<template>
    <div v-if="resourceDetailsData">
        <GenericSlotComponent :resourceDetailsData="resourceDetailsData" v-if="!customResources.includes(selectedResource)">
            <div v-for="(value, key) in resourceDetailsData" :key="key">
                <DataRenderer :label="key" :value="value" v-show="value !== null && key !== 'id' && key !== 'name' && key !== 'description'" />
            </div>
        </GenericSlotComponent>

        <GenericSlotComponent :resourceDetailsData="resourceDetailsData" v-else>
            <CustomResourceRenderer :selected-resource="selectedResource" :resource-details-data="resourceDetailsData" />
        </GenericSlotComponent>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { storeToRefs } from 'pinia';
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';

import { useResourceDetailsStore } from '../../store/resourceDetailsStore';

import DataRenderer from './DataRenderer.vue';
import CustomResourceRenderer from './CustomResourceRenderer.vue';
import GenericSlotComponent from './GenericSlotComponent.vue';

const resourceDetailsStore = useResourceDetailsStore();
const { resourceDetailsData } = storeToRefs(resourceDetailsStore);
const { fetchResourceDetails } = resourceDetailsStore;

const route = useRoute();
const ENV = useRuntimeEnv();

const resourceMapping:object = ENV.content.resources.resourceMapping;

let type = route.params.resource_type;
let id = route.params.resource_id;

const selectedResource = resourceMapping[type as keyof object];
const customResources = ENV.content.resourceDetails.customResources;

onMounted(async () => {
    await fetchResourceDetails(type, id);
});
</script>