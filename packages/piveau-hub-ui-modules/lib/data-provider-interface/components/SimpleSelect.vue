<script setup>
import { ref, reactive, watch, computed, onBeforeMount, onMounted, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { getTranslationFor } from "../../utils/helpers";
import { getCurrentInstance } from "vue";
import { getNode } from '@formkit/core'


const props = defineProps({
    context: Object
})

const userCats = computed(() => store.getters['auth/getUserCatalogIds']);
let showList = ref()
let selection = ref()
const store = useStore();

const setvalue = async (e) => {
    selection.value = e
    props.context.node.input(e)
    showList.value = !showList.value;
    getNode('dcat:catalog').value = e
}
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
                    <input class="autocompleteInputfield"
                        v-model="getNode('dcat:catalog').value" :placeholder="props.context.attrs.placeholder"
                        type="text" @click="showList = !showList">
                </div>
                <ul v-show="showList" class="autocompleteResultList selectListFK">
                    <li v-for="match in userCats" :key="match" @click="setvalue(match)"
                        class="p-2 border-b border-gray-200 data-[selected=true]:bg-blue-100 choosableItemsAC">{{
                            match }}
                    </li>
                </ul>
            </div>

        </div>
    </div>

</template>
<style>
.selectListFK {
    max-height: 20rem;
    overflow: scroll;
}</style>