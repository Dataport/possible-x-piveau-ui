<template>
    <div>
        <h3>{{ props.facet.title }}</h3>
        <div class="mt-1" v-for="option in props.facet.items">
            <input type="checkbox" :name="props.facet.title" @click="facetClicked(props.facet.id, option.id)" :checked="getCheckedOption">
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
    checkedOption.value = !checkedOption.value;
    emit('facetClicked', facetID, facetField, 'checkbox');
};

const getCheckedOption = computed(() => {
  return route.query.facets && JSON.parse(route.query.facets)[props.facet.id]
    ? JSON.parse(route.query.facets)[props.facet.id] 
    : checkedOption.value;
});
</script>