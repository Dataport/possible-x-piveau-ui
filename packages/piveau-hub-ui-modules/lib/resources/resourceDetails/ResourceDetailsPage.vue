<template>
    <div>   
        <GenericSlotComponent v-if="!customResources.includes(resource_nature)">
            <h1>Default setup</h1>
           
            <div>{{ resourceDetailsData }}</div>
        </GenericSlotComponent>

        <GenericSlotComponent v-else><h1>Your custom content can be added here</h1>
            
        <div>{{ resourceDetailsData }}</div>
        </GenericSlotComponent>

    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useResourcesStore } from '../../store/resourcesStore'
import { useResourceDetailsStore } from '../../store/resourceDetailsStore';
import GenericSlotComponent from './GenericSlotComponent.vue'
import { onMounted } from 'vue';

import { storeToRefs } from 'pinia';
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';



const resourcesStore = useResourcesStore()
const resourceDetailsStore = useResourceDetailsStore()
const { resourceDetailsData } = storeToRefs(resourceDetailsStore)
const {fetchResourceDetails, resetResourceDetails} = resourceDetailsStore



const route = useRoute();
let id = route.params.resource_id


onMounted(async () => {
    await fetchResourceDetails(id)
})


const resource_nature =  resourcesStore.getters.getSelectedResource

console.log(resource_nature);

const ENV = useRuntimeEnv();

const customResources = ENV.content.resourceDetails.customResources

</script>