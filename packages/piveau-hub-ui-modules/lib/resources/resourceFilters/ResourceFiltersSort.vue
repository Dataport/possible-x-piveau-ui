<template>
    <div class="resource-filters-sort btn-group d-flex flex-row flex-wrap align-items-center">
        <span class="mr-2">Sort by:</span>
        <button class="d-flex align-items-center custom-dropdown-button list-group-item p-0 py-1" id="resourceFiltersSort" type="button" data-toggle="dropdown" aria-expanded="false">
            <div class="resource-filters-sort-text">
            {{ sortSelectedLabel }}
            </div>
            <div class="resource-filters-sort-icon text-white">
                <i class="material-icons">keyboard_arrow_down</i>
            </div>
        </button>
        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="resourceFiltersSort">
            <button
            class="dropdown-item mb-0 nav-link"
            @click="setSortMethod('modified', 'desc', $t('message.sort.lastModified'))"
            >
            {{ $t('message.sort.lastUpdated') }}
            </button>
            <button
            class="dropdown-item mb-0 nav-link"
            @click="setSortMethod('relevance', 'desc', $t('message.sort.relevance'))"
            >
            {{ $t('message.sort.relevance') }}
            </button>
            <button 
            class="dropdown-item mb-0 nav-link" 
            @click="setSortMethod(`title.${$route.query.locale}`, 'asc', $t('message.sort.nameAZ'))">
            {{ $t('message.sort.nameAZ') }}
            </button>
            <button 
            class="dropdown-item mb-0 nav-link" 
            @click="setSortMethod(`title.${$route.query.locale}`, 'desc', $t('message.sort.nameZA'))">
            {{ $t('message.sort.nameZA') }}
            </button>
            <button 
            class="dropdown-item mb-0 nav-link" 
            @click="setSortMethod('issued', 'desc', $t('message.sort.lastCreated'))">
            {{ $t('message.sort.lastCreated') }}
            </button>
        </ul>
    </div>
</template>
    
<script>
import { useResourcesStore } from '../../store/resourcesStore';
import { defineComponent } from 'vue';
  
export default defineComponent({
    name: 'ResourceFiltersSort',
    data() {
        return {
            sortSelected: '',
            sortSelectedLabel: this.$t('message.sort.relevance'),
        };
    },
    computed: {},
    methods: {
        setSort(sort) {
        this.resourcesStore.mutations.setSort(sort);
        },
        initSort() {
        let sort = this.$route.query.sort;
        if (sort) {
            sort = sort.split(',')[0].toLowerCase();
            if (sort.includes('title')) {
            if (sort.includes('desc')) {
                this.sortSelectedLabel = this.$t('message.sort.nameZA');
                this.setSortMethod(`title.${this.$route.query.locale}`, 'desc', this.$t('message.sort.nameZA'));
            } else {
                this.sortSelectedLabel = this.$t('message.sort.nameAZ');
                this.setSortMethod(`title.${this.$route.query.locale}`, 'asc', this.$t('message.sort.nameAZ'));
            }
            } else {
            if (sort === 'relevance+desc') {
                this.sortSelectedLabel = this.$t('message.sort.relevance');
                this.setSortMethod('relevance', 'desc', this.$t('message.sort.relevance'));
            }
            if (sort === 'modified+desc') {
                this.sortSelectedLabel = this.$t('message.sort.lastUpdated');
                this.setSortMethod('modified', 'desc', this.$t('message.sort.lastUpdated'));
            }
            if (sort === 'issued+desc') {
                this.sortSelectedLabel = this.$t('message.sort.lastCreated');
                this.setSortMethod('issued', 'desc', this.$t('message.sort.lastCreated'));
            }
            }
        } else this.setSort(`relevance+desc, modified+desc, title.${this.$route.query.locale}+asc`);
        },
        setSortMethod(method, order, label) {
        this.sortSelectedLabel = label;
        if (method === 'relevance') this.sortSelected = `${method}+${order}, modified+desc, title.${this.$route.query.locale}+asc`;
        if (method === 'modified') this.sortSelected = `${method}+${order}, relevance+desc, title.${this.$route.query.locale}+asc`;
        if (method === `title.${this.$route.query.locale}`) this.sortSelected = `${method}+${order}, relevance+desc, modified+desc`;
        if (method === 'issued') this.sortSelected = `${method}+${order}, relevance+desc, title.${this.$route.query.locale}+asc`;
        return this.sortSelected;
        },
    },
    watch: {
        sortSelected: {
        handler(sort) {
            this.$router.replace({ query: Object.assign({}, this.$route.query, { sort }) })
            .catch(error => { console.error(error); });
            this.setSort(sort);
        },
        deep: true,
        }
    },
    setup() {
        const resourcesStore = useResourcesStore();
        return { resourcesStore };
    },
    created() {
        this.$nextTick(() => {
        this.initSort();
        });
    },
    mounted() {},
});
</script>

<style lang="scss">
.resource-filters-sort {

    .resource-filters-sort-text {
        padding: 0 4rem 0 0.5rem !important;
        height: 100% !important;
    }

    .resource-filters-sort-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 2.75rem;
        background-color: var(--primary);

        .material-icons {
            font-size: 30px;
        }
    }
}
</style>