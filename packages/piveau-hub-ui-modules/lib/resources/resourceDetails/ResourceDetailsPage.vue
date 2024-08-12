<template>
    <div v-if="resourceDetailsData">
        <GenericSlotComponent :id="resourceDetailsData.id" :description="resourceDetailsData.description"
            v-if="!customResources.includes(resource_nature)">
            <!-- <h1>Default setup</h1> -->

            <div>{{ resourceDetailsData }}</div>

            <div v-for="(value, key) in resourceDetailsData" :key="key">
                <DataRenderer :label="key" :value="value" v-show="value !== null && key !== 'id' && key !== 'name' && key !== 'description'" />
            </div>
        </GenericSlotComponent>

        <GenericSlotComponent :id="resourceDetailsData.id" :description="resourceDetailsData.description" v-else>
            <!-- <i>Your custom details page content can be added here</i> -->
            <div v-for="(value, key) in resourceDetailsData" :key="key">
                <DataRenderer :label="key" :value="value" />
            </div>
            <div>{{ resourceDetailsData }}</div>
        </GenericSlotComponent>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import DataRenderer from './DataRenderer.vue';
import { useResourcesStore } from '../../store/resourcesStore'
import { useResourceDetailsStore } from '../../store/resourceDetailsStore';
import GenericSlotComponent from './GenericSlotComponent.vue'
import { onMounted, defineComponent } from 'vue';

import { storeToRefs } from 'pinia';
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';



const resourcesStore = useResourcesStore()
const resourceDetailsStore = useResourceDetailsStore()
const { resourceDetailsData } = storeToRefs(resourceDetailsStore)
const { fetchResourceDetails, resetResourceDetails } = resourceDetailsStore



const route = useRoute();
let id = route.params.resource_id


onMounted(async () => {
    await fetchResourceDetails(id)
})


const resource_nature = resourcesStore.getters.getSelectedResource;

console.log(resource_nature);

const ENV = useRuntimeEnv();

const customResources = ENV.content.resourceDetails.customResources;


</script>