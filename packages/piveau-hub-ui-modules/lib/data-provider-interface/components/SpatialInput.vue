<script setup>

// ################ ToDo Need to make sure, that the values get saved when the property gets clicked

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
let hasValue = false;

watch(inputText, async () => {
    getAutocompleteSuggestions();
})
watch(voc, async () => {
    voc.value = voc.value.toLowerCase();
})
watch(manURL, async () => {
//    ToDo needs a better way - maybe if the input looses its focus?
    setTimeout(() => {
        props.context.node.input({ 'name': manURL, 'resource': manURL })
    }, 10000);
 
})
onMounted(async () => {
    matches = [{ name: '--- Type in anything for a live search of the vocabulary ---', resource: 'invalid' }]
    //     window.addEventListener("click", function(){
    // console.log('HelloWorld');
    // });
});
function removeProperty(e) {
//   props.context.value = {}
  props.context.node.input({})
 }
const getAutocompleteSuggestions = async () => {

    try {
        let text = inputText.value;
        await store.dispatch('dpiStore/requestAutocompleteSuggestions', { voc: voc.value, text: text }).then((response) => {
            const results = response.data.result.results.map((r) => ({
                name: getTranslationFor(r.pref_label, 'en', []) + " (" + r.id + ")",
                resource: r.resource,
            }));
            matches = results;
        });
    } catch (error) {
    }
}

</script>
<template>
    <div class="d-flex flex-column w-100 spatialWrap">
        <div class="d-flex formkit-inner mx-3 mb-3" v-if="!props.context.attrs.multiple && props.context.value.name">
            <!-- <label class="formkit-label" for="autocompleteInputSingleValue">{{ props.context.attrs.identifier }}</label> -->
            <div class="infoI">
                <div class="tooltipFormkit">{{ props.context.attrs.info }}</div>
            </div>
            <a class="autocompleteInputSingleValue ">{{ props.context.value.name }}</a>
            <div class="removeX" @click="removeProperty"></div>
        </div>
        <div v-else>
            <div class=" w-100 d-flex">
                <div class="d-flex position-relative m-3 w-50">
                    <label class="w-100"> Choose the the way you want to provide the spatial info <input id="I1" type="text"
                            class="selectInputField formkit-inner" placeholder="Select input method"
                            @click="activeInput(); showTable = !showTable;">
                    </label>
                    <ul v-show="showTable" class="spatialListUpload">
                        <li @click="showTable = !showTable; man = true; if (vocSearch) { vocSearch = false; };"
                            class="p-2 border-b border-gray-200 choosableItemsAC">
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
                        <input id="I2" type="text" class="selectInputField formkit-inner"
                            placeholder="Search the vocabulary" @click="activeInput(); showVocTable = !showVocTable;">
                    </label>
                    <ul v-if="showVocTable" class="spatialListUpload">
                        <li v-for="el in listOfVoc" :key="el" class="p-2 border-b border-gray-200 choosableItemsAC"
                            @click=" closeAll(); el.active = !el.active; showVocTable = !showVocTable; inputText = ''; voc = el.item">
                            {{ el.item }}</li>
                    </ul>
                </div>
            </div>
            <div class="m-3" v-if="vocSearch">

                <div v-for="el in listOfVoc" :key="el" class="position-relative">
                    <label class="w-100" v-if="el.active"> Search the vocabulary <input id="I3" type="text"
                            v-model="inputText" class="selectInputField formkit-inner" :placeholder="el.item"
                            @click="activeInput(); showVocEntries = !showVocEntries;">
                    </label>
                    <ul v-if="showVocEntries && el.active" class="spatialListUpload">
                        <li v-for="el in matches" :key="el" class="p-2 border-b border-gray-200 choosableItemsAC"
                            @click="props.context.node.input(el); inputText = el.name; showVocEntries = false">
                            {{ el.name }}</li>
                    </ul>
                </div>

            </div>

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
            showVocEntries: false,
        }
    },
    methods: {

        closeAll() {
            this.listOfVoc.forEach(element => {
                element.active = false;
            });
        },
        activeInput(e) {
            if (this.showTable || this.showVocTable || this.showVocEntries) {
                this.showTable = this.showVocTable = this.showVocEntries = false
            }
        },
        onClose(e) {
            console.log(e);
            this.showPopup = false
        },
        addEvent(e) {
            document.addEventListener("click", this.onClickOutside());
        },
        onClickOutside() {
            console.log('Hallo');
        }
    }
}
</script>
<style lang="scss" scoped>
.spatialWrap label {
    font-family: var(--fk-font-family-label);
    font-size: var(--fk-font-size-label);
    font-weight: var(--fk-font-weight-label);
    line-height: var(--fk-line-height-label);
}

.spatialWrap {
    .spatialListUpload {
        width: 100%;
    }
}
</style>
