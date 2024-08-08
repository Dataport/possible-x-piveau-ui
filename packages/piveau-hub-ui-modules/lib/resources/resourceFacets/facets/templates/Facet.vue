<template>
    <div class="mb-3">
        <h3>{{ props.facet.title }}</h3>
        <div class="mt-1" v-for="facetField in props.facet.items">
            <button class="w-100 text-left" @click="facetClicked(props.facet.id, facetField.id)">
                <span class="text-truncate text-break text-wrap">{{ facetField.title }}</span> 
                <span class="float-right">{{ facetField.count }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps(['facet']);

const emit = defineEmits(['facetClicked']);

const facetClicked = (facetID, facetField) => {
    emit('facetClicked', facetID, facetField);
};
</script>