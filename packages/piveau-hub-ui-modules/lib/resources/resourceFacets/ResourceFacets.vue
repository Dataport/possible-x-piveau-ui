<template>
    <div class="bg-primary text-white align-self-start p-5">
        <div>
            Add facets for {{ $t(`message.header.navigation.data.${getSelectedResource}`) }} here
        </div>
        <div class="mt-5">
            <button @click="resetFilters()">
                Reset Filters
            </button>
        </div>
    </div>
</template>

<script>
import { useResourcesStore } from '../../store/resourcesStore';

export default {
    name: "ResourceFacets",
    components: {},
    data() {
        return {};
    },
    computed: {
        getSelectedResource() {
            return this.resourcesStore.getters.getSelectedResource;
        },
    },
    methods: {
        resetFilters() {
            this.$emit('resetFilters');
            this.$router.replace({ query: Object.assign({}, { locale: this.$route.query.locale }) })
                .catch(error => { console.error(error); });
        },
    },
    setup() {
        const resourcesStore = useResourcesStore();
        return { resourcesStore };
    },
    created() {},
}
</script>