<script setup>
import { ref, reactive, watch, computed, onBeforeMount, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getTranslationFor } from "../../utils/helpers";
import { mapActions } from 'vuex';

const props = defineProps({
  context: Object
})
const savetoLocal = mapActions('dpiStore', [
  'saveFormValues',
  'saveLocalstorageValues',
])
const store = useStore();

// ToDo need to make the list editable - maybe add a cache List
let listOfValues = computed(() => {
  return props.context.value;
})

let localStorageProperty;
let selection;
let voc = props.context.attrs.voc;
let matches;
let inputText = ref({});

const loadMatches = async () => {
  matches = [{ name: '--- Type in the name of the fitting property for a live search of the vocabulary ---', resource: 'invalid' }]
  await store.dispatch('dpiStore/requestAutocompleteSuggestions', { voc: voc, text: "" }).then((response) => {
    const results = response.data.result.results.map((r) => ({
      name: getTranslationFor(r.pref_label, 'en', []) + " (" + r.id + ")",
      resource: r.resource,
    }));
    matches = results;
  });
}
onBeforeMount(() => {
  loadMatches();

})
onMounted(async () => {
findPropertyToUpdate();
  inputText.value = ""
  // console.log('Context: ', props.context);
});

watch(inputText, async () => {
  getAutocompleteSuggestions();
}
)
function findPropertyToUpdate(item){
  let pathToLocalStorage = JSON.parse(localStorage.getItem('dpi_datasets'));
if (item = ""){ 

  console.log(pathToLocalStorage);

}
else{}
}
// Catches the OutsideClick for the input fields
function onClickOutside(e) {
  let element = document.getElementsByClassName("autocompleteResultList")
  if (!e.target.classList.contains('choosableItemsAC') && !e.target.classList.contains('autocompleteInputfield')) {
    for (let index = 0; index < element.length; index++) {
      if (!element[index].classList.contains('inactiveResultList')) {
        try {
          element[index].classList.toggle('inactiveResultList');
        } catch (error) {
        }
      }
    }
  }
  else {
    for (let i = 0; i < element.length; i++) {
      if (!element[i].classList.contains("inactiveResultList")) {
        element[i].classList.toggle("inactiveResultList");
      }
    }
    e.target.nextElementSibling.classList.toggle('inactiveResultList')
  }

}

// Need to append the classes to the formkit-outer element
props.context.classes.outer += ' autocompleteInput ' + props.context.attrs.identifier

//need to append the right label to the field ###############    TODO     ################
// props.context.label = props.context.attrs.identifier

// // Register the outside click to close the list of suggested values
window.addEventListener("click", onClickOutside);

// // Todo need to remove the eventlistener after adding it
// // setTimeout(() => {
// //   window.removeEventListener("click", onClickOutside);
// // }, 100);

// node.props.selection = {};
// node.props.isMulti = node.context.context.attrs.multiple;

const setValue = async (e) => {

  if (e.resource === "invalid") return
  // when its a multi input
  if (props.context.attrs.multiple) {
    // check for doubled values
    if (listOfValues.value.length != 0) {
      let filteredProperty = { name: e.name, resource: e.resource };
      // console.log(listOfValues.value, 'before');
      let filteredList = listOfValues.value.filter((element) => element.name != e.name);
      filteredList.push(filteredProperty)
      listOfValues.value = filteredList;
      // console.log(filteredList, 'after');
      await props.context.node.input(listOfValues.value);
    }
    else {
      listOfValues.value.push({ name: e.name, resource: e.resource })
      selection = listOfValues.value
      await props.context.node.input(selection);
    }
  }
  else if (e === "erase") { await props.context.node.input({}); }
  else {
    selection = { name: e.name, resource: e.resource };
    await props.context.node.input(selection);
  }
  inputText.value = e.name
}

const getAutocompleteSuggestions = async () => {
  let text = inputText.value;
  // this.clearAutocompleteSuggestions();

  await store.dispatch('dpiStore/requestAutocompleteSuggestions', { voc: voc, text: text }).then((response) => {
    const results = response.data.result.results.map((r) => ({
      name: getTranslationFor(r.pref_label, 'en', []) + " (" + r.id + ")",
      resource: r.resource,
    }));
    matches = results;
  });
}

function removeProperty(e) {
  props.context.value = {}
  setValue('erase');
  // savetoLocal.saveFormValues({ property: property, page: page, distid: id, values: formValues })

}
function removeMultipleProperty(e) {
  // Get Index in the array where all values of the Span are stored and cut it out of the list of Values
  listOfValues.value.splice(listOfValues.value.findIndex((element) => element.name == e.name), 1)
  selection = listOfValues.value;
  props.context.node.input(selection);
}

function toggleList(e) {
  inputText.value = "";
  e.target.nextElementSibling.classList.toggle('inactiveResultList');
}
</script>

<template>
  <h4>{{ props.context.attrs.identifier }}</h4>
  <div class="formkitCmpWrap">
    <div class="formkit-outer ">
      <div class="d-flex formkit-inner" v-if="!props.context.attrs.multiple && props.context.value.name">
        <a class="autocompleteInputSingleValue ">{{ props.context.value.name }}</a>
        <div class="removeX" @click="removeProperty"></div>
      </div>
      <div v-else>
        <input class="autocompleteInputfield formkit-inner mb-2" placeholder="Search for fitting properties"
          v-model="inputText" type="text" @click="toggleList">
        <ul class="autocompleteResultList inactiveResultList">
          <li v-for="match in matches" :key="match" @click="setValue(match)"
            class="p-2 border-b border-gray-200 data-[selected=true]:bg-blue-100 choosableItemsAC">{{ match.name }}</li>
        </ul>
        <div class="d-flex flex-wrap">
          <div class="activeResultsAutocompleteWrapper" v-for="item in props.context.value" :key="item">
            <span>{{ item.name }}</span>
            <div class="removeX" @click="removeMultipleProperty(item)"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>