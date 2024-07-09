<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getNode } from '@formkit/core'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
import { getCurrentInstance } from "vue";
import {
    has,
    isNil,
} from 'lodash-es';

const props = defineProps({
    context: Object
})

const userCats = computed(() => store.getters['auth/getUserCatalogIds']);
let showList = ref()
// let selection = ref()
const store = useStore();
const dropdownList = ref(null)
const isEditMode = ref();
isEditMode.value = computed(() => store.getters['auth/getIsEditMode']);
let filteredCatalogs = ref([])
let env = getCurrentInstance().appContext.app.config.globalProperties.$env;

onClickOutside(dropdownList, event => showList.value = false)

const setvalue = async (e) => {
    // selection.value = e
    props.context.node.input(e.id)
    showList.value = !showList.value;
    getNode('dcat:catalog').value = e.name
}
let filterCatList = async () => {
    let cache;
    await axios
        .get(env.api.baseUrl + 'search?filter=catalogue')
        .then(response => (cache = response))
        .catch((err) => {
            reject(err);
        });

    cache.data.result.results.forEach((e) => {
        if (has(e, 'title') && !isNil(e.title) && has(e, 'id') && !isNil(e.id)) filteredCatalogs.value.push({ title: Object.values(e.title)[0], id: e.id })
    });

    filteredCatalogs.value = filteredCatalogs.value
        .filter(item => userCats.value.includes(item.id))
        .map(item => ({ id: item.id, name: item.title }));
}
onMounted(async () => {
    filterCatList()
});
</script>
<template>

    <div class="formkitProperty">
        <h4>{{ props.context.label }}</h4>
        <div class="formkitCmpWrap">
            <div class="formkit-outer">
                <div class="d-flex align-items-center justify-content-center formkit-inner mb-2">
                    <div class="infoI">
                        <div class="tooltipFormkit">{{ props.context.attrs.info }}</div>
                    </div>
                    <input v-if="isEditMode.value" class="autocompleteInputfield" type="text" readonly
                        :placeholder="getNode('dcat:catalog').value">
                    <input v-else class="autocompleteInputfield" v-model="getNode('dcat:catalog').value"
                        :placeholder="props.context.attrs.placeholder" type="text" @click="showList = !showList">
                </div>
                <ul ref="dropdownList" v-show="showList" class="autocompleteResultList selectListFK">
                    <li v-for="match in filteredCatalogs" :key="match" @click="setvalue(match)"
                        class="p-2 border-b border-gray-200 data-[selected=true]:bg-blue-100 choosableItemsAC">{{
                            match.name }}
                    </li>
                    <li v-if="filteredCatalogs.length === 0" v-for="idMatch in userCats" :key="idMatch" @click="setvalue(idMatch)"
                        class="p-2 border-b border-gray-200 data-[selected=true]:bg-blue-100 choosableItemsAC">{{
                            idMatch }}
                    </li>
                </ul>
            </div>

        </div>
    </div>

</template>
<style>
.selectListFK {
    max-height: 20rem;
    overflow: overlay;
    overflow-x: hidden; 
}
</style>