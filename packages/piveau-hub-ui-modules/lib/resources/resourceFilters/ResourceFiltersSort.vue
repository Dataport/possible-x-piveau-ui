<template>
    <div class="resource-filters-sort btn-group d-flex flex-row flex-wrap align-items-center">
        <span class="mr-2">Sort by:</span>
        <button class="d-flex align-items-center custom-dropdown-button list-group-item p-0 py-1" id="resourceFiltersSort" type="button" data-toggle="dropdown" aria-expanded="false">
            <div class="resource-filters-sort-text">
            {{ getSortSelectedLabel }}
            </div>
            <div class="resource-filters-sort-icon text-white">
                <i class="material-icons">keyboard_arrow_down</i>
            </div>
        </button>
        <ul class="dropdown-menu dropdown-menu-right" aria-labelledby="resourceFiltersSort">
            <button
                class="dropdown-item mb-0 nav-link"
                @click="setSortMethod('modified', 'desc', t('message.sort.lastUpdated'))"
                >
                {{ t('message.sort.lastUpdated') }}
            </button>
            <button
                class="dropdown-item mb-0 nav-link"
                @click="setSortMethod('relevance', 'desc', t('message.sort.relevance'))"
                >
                {{ t('message.sort.relevance') }}
            </button>
            <button 
                class="dropdown-item mb-0 nav-link" 
                @click="setSortMethod(`title.${$route.query.locale}`, 'asc', t('message.sort.nameAZ'))">
                {{ t('message.sort.nameAZ') }}
            </button>
            <button 
                class="dropdown-item mb-0 nav-link" 
                @click="setSortMethod(`title.${$route.query.locale}`, 'desc', t('message.sort.nameZA'))">
                {{ t('message.sort.nameZA') }}
            </button>
            <button 
                class="dropdown-item mb-0 nav-link" 
                @click="setSortMethod('issued', 'desc', t('message.sort.lastCreated'))">
                {{ t('message.sort.lastCreated') }}
            </button>
        </ul>
    </div>
</template>
    
<script lang="ts" setup>
import { computed, nextTick } from 'vue';

import { useRoute, useRouter } from 'vue-router';
import { useResourcesStore } from '../../store/resourcesStore';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const router = useRouter();
const resourcesStore = useResourcesStore();
const { t } = useI18n();

const getSortSelectedLabel = computed(() => {
    return resourcesStore.getters.getSortSelectedLabel;
});

function initSort() {
    let sort = route.query.sort;
    if (sort) {
        sort = sort.split(',')[0].toLowerCase();
        if (sort.includes('title')) {
            if (sort.includes('desc')) {
                setSortMethod(`title.${route.query.locale}`, 'desc', t('message.sort.nameZA'));
            } else {
                setSortMethod(`title.${route.query.locale}`, 'asc', t('message.sort.nameAZ'));
            }
        } else {
            if (sort === 'relevance+desc') {
                setSortMethod('relevance', 'desc', t('message.sort.relevance'));
            }
            if (sort === 'modified+desc') {
                setSortMethod('modified', 'desc', t('message.sort.lastUpdated'));
            }
            if (sort === 'issued+desc') {
                setSortMethod('issued', 'desc', t('message.sort.lastCreated'));
            }
        }
    } else {
        storeSort(`relevance+desc, modified+desc, title.${route.query.locale}+asc`, t('message.sort.relevance'));
    }
};

function setSortMethod(method: string, order: string, label: string) {
    if (method === 'relevance') setSort(`${method}+${order}, modified+desc, title.${route.query.locale}+asc`, label);
    if (method === 'modified') setSort(`${method}+${order}, relevance+desc, title.${route.query.locale}+asc`, label);
    if (method === `title.${route.query.locale}`) setSort(`${method}+${order}, relevance+desc, modified+desc`, label);
    if (method === 'issued') setSort(`${method}+${order}, relevance+desc, title.${route.query.locale}+asc`, label);
};


function setSort(sort: string, label: string) {
    let oldQuery = route.query;

    if (!!oldQuery.sort) delete oldQuery.sort;

    storeSort(sort, label);

    router.replace({ query: Object.assign({}, oldQuery, { sort }) })
            .catch(error => { console.error(error); });
};

function storeSort(sort: string, label: string) {
    resourcesStore.mutations.setSort(sort);
    resourcesStore.mutations.setSortSelectedLabel(label);
}

nextTick(() => {
    initSort();
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