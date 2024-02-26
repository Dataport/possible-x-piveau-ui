<script setup>
import { ref, reactive, watch, computed, onBeforeMount, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getTranslationFor } from "../../utils/helpers";

const props = defineProps({
  context: Object
})
const store = useStore();

let listOfValues = computed(() => {
  return props.context.value;
})

let selection;
let voc = props.context.attrs.voc;
let matches;
let inputText = ref({});
let cacheList = [];
const loadMatches = async () => {
  matches = [{ name: '--- Type in anything for a live search of the vocabulary ---', resource: 'invalid' }]
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

  inputText.value = ""
  // console.log('Context: ', props.context);
});

watch(inputText, async () => {
  getAutocompleteSuggestions();
}
)
function findPropertyToUpdate() {
  let finalPath = { step: '', prop: props.context.node.name }
  let pathToLocalStorage = JSON.parse(localStorage.getItem('dpi_datasets'));

  for (let index = 0; index < Object.keys(pathToLocalStorage).length; index++) {
    for (let innerIndex = 0; innerIndex < Object.keys(pathToLocalStorage)[index].length; innerIndex++) {
      let ntry = Object.entries((pathToLocalStorage))
      try {
        Object.keys(ntry[index][innerIndex]).filter(e => {
          if (e === props.context.node.name) {
            finalPath.step = ntry[index][0]

            if (typeof selection === 'object') {
              pathToLocalStorage[finalPath.step][finalPath.prop] = selection
            }
            else pathToLocalStorage[finalPath.step][finalPath.prop] = cacheList
            localStorage.setItem('dpi_datasets', JSON.stringify(pathToLocalStorage))
          }
        });
      } catch (error) {
      }
    }
  }

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
    e.target.parentElement.nextElementSibling.classList.toggle('inactiveResultList')
  }

}

// Need to append the classes to the formkit-outer element
props.context.classes.outer += ' autocompleteInput ' + props.context.attrs.identifier




// node.props.selection = {};
// node.props.isMulti = node.context.context.attrs.multiple;

const setValue = async (e) => {
  if (listOfValues.value.length > 0) {
    cacheList = listOfValues.value
  }
  // when its a multi input
  if (props.context.attrs.multiple) {
    // check for doubled values
    if (cacheList.length != 0) {
      let filteredProperty = { name: e.name, resource: e.resource };
      // console.log(cacheList, 'before');
      let filteredList = cacheList.filter((element) => element.name != e.name);
      filteredList.push(filteredProperty)
      cacheList = filteredList;
      // console.log(filteredList, 'after');
      await props.context.node.input(cacheList);
    }
    else {
      cacheList.push({ name: e.name, resource: e.resource })
      selection = cacheList
      await props.context.node.input(selection);
    }

  }
  else if (e.resource === "invalid") return
  else if (e === "erase") { await props.context.node.input({}); }
  else {
    selection = { name: e.name, resource: e.resource };
    await props.context.node.input(selection);
  }
  // inputText.value = e.name
  findPropertyToUpdate();
  window.removeEventListener("click", onClickOutside);
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
function toTitleCase(str) {
  return str.toLowerCase().replace(/(^|\s|-|\')(\w)/g, function (match) {
    return match.toUpperCase();
  });
}

function removeProperty(e) {
  props.context.value = {}
  setValue('erase');
  findPropertyToUpdate();

}
function removeMultipleProperty(e) {
  if (listOfValues.value.length > 0) {
    cacheList = listOfValues.value
  }
  // Get Index in the array where all values of the Span are stored and cut it out of the list of Values
  cacheList.splice(cacheList.findIndex((element) => element.name == e.name), 1)
  selection = cacheList;
  props.context.node.input(selection);
  findPropertyToUpdate();
}
function toggleList(e) {
  inputText.value = "";
  e.target.parentElement.nextElementSibling.classList.toggle('inactiveResultList');
  // // Register the outside click to close the list of suggested values
  window.addEventListener("click", onClickOutside);
}
</script>

<template>
  <h4>{{ props.context.label }}</h4>
  <div class="formkitCmpWrap">
    <div class="formkit-outer ">

      <div class="d-flex formkit-inner" v-if="!props.context.attrs.multiple && props.context.value.name">
        <!-- <label class="formkit-label" for="autocompleteInputSingleValue">{{ props.context.attrs.identifier }}</label> -->
        <div class="infoI">
          <div class="tooltipFormkit">{{ props.context.attrs.info }}</div>
        </div>
        <a class="autocompleteInputSingleValue ">{{ props.context.value.name }}</a>
        <div class="removeX" @click="removeProperty"></div>
      </div>
      <div v-else>
        <!-- <label class="formkit-label" for="autocompleteInputfield">{{ props.context.attrs.identifier }}</label> -->
        <div class="d-flex align-items-center justify-content-center formkit-inner mb-2">
          <div class="infoI">
            <div class="tooltipFormkit">{{ props.context.attrs.info }}</div>
          </div>
          <input class="autocompleteInputfield" :placeholder="props.context.attrs.placeholder" v-model="inputText"
            type="text" @click="toggleList">
        </div>
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
        <div class="formkit-wrapper">
          <div class="formkit-help">{{ props.context.help }}</div>
        </div>
      </div>
    </div>
  </div>
</template>