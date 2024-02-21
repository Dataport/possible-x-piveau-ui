<script setup>
import { ref, reactive, watch, computed, onBeforeMount, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getTranslationFor } from "../../utils/helpers";
const props = defineProps({
    context: Object
})
let inputText = ref({});
let voc = ref({})
let matches = ref({})
let manURL = ref({})
const store = useStore();

watch(inputText, async () => {
    getAutocompleteSuggestions();
})
watch(voc, async () => {
    voc.value = voc.value.toLowerCase();
})
watch(manURL, async () => {
    props.context.node.input({ 'name': manURL, 'resource': manURL })
})
onMounted(async () => {
   
});

const getAutocompleteSuggestions = async () => {
    let text = inputText.value;

    await store.dispatch('dpiStore/requestAutocompleteSuggestions', { voc: voc.value, text: text }).then((response) => {
        const results = response.data.result.results.map((r) => ({
            name: getTranslationFor(r.pref_label, 'en', []) + " (" + r.id + ")",
            resource: r.resource,
        }));
        matches = results;
    });
}
</script>
<template>
    <div class="d-flex flex-column w-100 spatialWrap">
        <div class=" w-100 d-flex">
            <div class="d-flex position-relative m-3 ">
                <label class="w-100"> Choose the the way you want to provide the spatial info <input type="text"
                        class="selectInputField formkit-inner" placeholder="Select input method"
                        @click="chooseSpatialInput($event)">
                </label>
                <ul v-if="showTable" class="selectListUpload">
                    <li @click="showTable = !showTable; man = true; if (vocSearch) {
                        vocSearch = false;
                    };" class="p-2 border-b border-gray-200 choosableItemsAC">
                        Manually submit information
                    </li>
                    <li @click="showTable = !showTable; vocSearch = true; if (man) {
                        man = false
                    }" class="p-2 border-b border-gray-200 choosableItemsAC">
                        Choose from vocabulary
                    </li>
                </ul>
            </div>
            <div v-if="man" class="d-flex position-relative m-3 w-50">
                <label class="w-100"> Provide spatial URL
                    <input type="URL" class="selectInputField formkit-inner" placeholder="Spatial URL" v-model="manURL">

                </label>

            </div>
            <div v-if="vocSearch" class="d-flex position-relative m-3 w-50">
                <label class="w-100"> Choose type of vocabulary
                    <input type="text" class="selectInputField formkit-inner" placeholder="Search the vocabulary"
                        @click="showVocTable = !showVocTable">
                </label>
                <ul v-if="showVocTable" class="selectListUpload">
                    <li v-for="el in listOfVoc" :key="el" class="p-2 border-b border-gray-200 choosableItemsAC"
                        @click=" closeAll(); el.active = !el.active; showVocTable = !showVocTable; inputText = ''; voc = el.item">
                        {{ el.item }}</li>
                </ul>
            </div>
        </div>
        <div class="m-3" v-if="vocSearch">
            <label class="w-100"> Search the vocabulary
                <div v-for="el in listOfVoc" :key="el" class="position-relative">
                    <input type="text" v-model="inputText" class="selectInputField formkit-inner" v-if="el.active"
                        :placeholder="el.item" @click="showVocEntries = !showVocEntries;">
                    <ul v-if="showVocEntries && el.active" class="selectListUpload">
                        <li v-for="el in matches" :key="el" class="p-2 border-b border-gray-200 choosableItemsAC"
                            @click="props.context.node.input(el); inputText = el.name">
                            {{ el.name }}</li>
                    </ul>
                </div>
            </label>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            listOfVoc: [{ item: 'Country', active: false }, { item: 'Place', active: false }, { item: 'Continent', active: false }],
            showTable: false,
            man: false,
            vocSearch: false,
            showVocTable: false,
            showVocEntries: false
        }
    },
    methods: {
        chooseSpatialInput() {
            this.showTable = !this.showTable
        },
        closeAll() {
            this.listOfVoc.forEach(element => {
                element.active = false;
            });
        }
    }
}
</script>
<style>
.spatialWrap label {
    font-family: var(--fk-font-family-label);
    font-size: var(--fk-font-size-label);
    font-weight: var(--fk-font-weight-label);
    line-height: var(--fk-line-height-label);
}
</style>
