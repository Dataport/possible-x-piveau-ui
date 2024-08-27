<template>
    <div v-if="resourceDetailsData">
        <ResourceDetailsSlotComponent :selected-resource="selectedResource" :resource-details-data="resourceDetailsData">
            <template #resource-details>
                <!-- USE DEFAULT DETAILS PAGE -->
                <div v-if="!customResources.includes(selectedResource)">
                    <ResourceDetailsDefaultRenderer :resource-details-data="resourceDetailsData"></ResourceDetailsDefaultRenderer>
                </div>
                <!-- USE CUSTOM DETAILS PAGE -->
                <div v-else>
                    <ResourceDetailsCustomRenderer :selected-resource="selectedResource" :resource-details-data="resourceDetailsData"></ResourceDetailsCustomRenderer>
                </div>
            </template>
        </ResourceDetailsSlotComponent>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

import { storeToRefs } from 'pinia';
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';

import { useResourceDetailsStore } from '../../store/resourceDetailsStore';

import ResourceDetailsDefaultRenderer from './ResourceDetailsDefaultRenderer.vue';
import ResourceDetailsCustomRenderer from './ResourceDetailsCustomRenderer.vue';
import ResourceDetailsSlotComponent from './ResourceDetailsSlotComponent.vue';

const resourceDetailsStore = useResourceDetailsStore();
const { resourceDetailsData } = storeToRefs(resourceDetailsStore);
const { fetchResourceDetails } = resourceDetailsStore;

const route = useRoute();
const ENV = useRuntimeEnv();

const resourceMapping:object = ENV.content.resources.resourceMapping;

let type: string = route.params.resource_type.toString();
let id: string = route.params.resource_id.toString();

const selectedResource = resourceMapping[type as keyof object];
const customResources = ENV.content.resourceDetails.customResources;

onMounted(async () => {
    await fetchResourceDetails(type, id);
});
</script>