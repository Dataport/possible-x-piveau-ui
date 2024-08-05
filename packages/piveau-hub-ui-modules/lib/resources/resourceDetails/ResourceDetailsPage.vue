<template>
    <div>   

        <GenericSlotComponent v-if="!resoure_array.includes(resource_nature)">
            <h1>Default setup</h1>
        </GenericSlotComponent>
        <GenericSlotComponent v-else><h1>Your custom content can be added here</h1></GenericSlotComponent>

    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useResourcesStore } from '../../store/resourcesStore'
import { useResourceDetailsStore } from '../../store/resourceDetailsStore';
import GenericSlotComponent from './GenericSlotComponent.vue'

const resourcesStore = useResourcesStore()
const resourceDetailsStore = useResourceDetailsStore()

const resoure_array = ["random", "test", "legalPersons"]

const route = useRoute();
const id = route.params?.resource_id;

// resourcesStore.actions.fetchDatasetDetails(id)
resourceDetailsStore.fetchResourceDetails(id)


const resource_nature = resourcesStore.getters.getSelectedResource

console.log(resource_nature);

</script>