
<script setup>
import { ref, computed } from 'vue';
import AutocompleteInput from './AutocompleteInput.vue';
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  context: Object,
})
let selectModeVal = ref()
let selectedItem = ref(false)
let showSelect = ref(false)
const I1 = ref(null)

const openSelect = (e) => {
  showSelect.value = !showSelect.value
}
const selectMode = (e) => {
  selectModeVal.value = e.target.innerHTML
  if (e.target.innerHTML === 'manually') {
    selectedItem.value = "manually"
  }
  else selectedItem.value = "vocabulary"
  props.context.node.reset()
}
onClickOutside(I1, event => showSelect.value = false)

// determine which property is already there

</script>
<template>
  <h4>{{ props.context.attrs.identifier }}</h4>
  <div class="formkitCmpWrap simpleConditional">
    <div class="m-3">
      <div class="conditionalSelectDiv">
        <input ref="I1" type="text" class="conditionalSelect formkit-input formkit-inner" @click="openSelect($event)"
          placeholder="Choose input method" v-model="selectModeVal">
        <div v-if="showSelect">
          <ul class="selectListConditional">
            <li v-for="el, index in props.context.attrs.selection" class="p-2 border-b border-gray-200 "
              @click="selectMode($event)">{{ el }}</li>
          </ul>
        </div>
      </div>
      <div class="conditionalManual">
        <div class="d-flex" v-if="selectedItem === 'manually' ||
          Object.keys(props.context.value).length > 0 && props.context.value['foaf:name']
          && selectedItem != 'vocabulary'">
          <FormKit v-for="el, key in props.context.attrs.options" :type="key" :placeholder="key" :name="el"
            :validation="key"></FormKit>
        </div>

      </div>
      <div v-if="selectedItem === 'vocabulary' || Object.keys(props.context.value).length > 0
        && props.context.value['name'] && selectedItem != 'manually'" class="conditionalVocabulary">
        <AutocompleteInput :context="props.context"></AutocompleteInput>
      </div>

    </div>

  </div>
</template>

