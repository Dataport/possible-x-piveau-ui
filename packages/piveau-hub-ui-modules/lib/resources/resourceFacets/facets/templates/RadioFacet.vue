<template>
    <div>
        <h3>{{ props.facet.title }}</h3>
        <div class="mt-1" v-for="(option, index) in props.facet.items" :key="index">
            <input type="radio" :name="props.facet.title" @change="facetClicked(props.facet.id, option.id)" :checked="option.id === getCheckedOption">
            <label>{{ option.title }}</label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps(['facet']);
const emit = defineEmits(['facetClicked']);

let checkedOption = ref(props.facet.initialOption);

const facetClicked = (facetID, facetField) => {
    if (checkedOption === facetField) return;
    checkedOption.value = facetField;
    emit('facetClicked', facetID, facetField, 'radio');
};

const getCheckedOption = computed(() => {
  return route.query.facets && JSON.parse(route.query.facets)[props.facet.id]
    ? JSON.parse(route.query.facets)[props.facet.id] 
    : checkedOption.value;
});
</script>