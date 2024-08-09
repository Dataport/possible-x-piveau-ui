<template>
  <div class="formkitProperty">
    <h4>{{ props.context.attrs.identifier }}</h4>
    <div v-if="props.context.attrs.identifier === 'licence'" class="d-flex infoLicense">
      <svg xmlns="http://www.w3.org/2000/svg" width="5%" height="5%" fill="currentColor"
        class="bi bi-info-circle mx-3 mb-3 " viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path
          d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
      </svg>
      <p>Please be aware of the Commission Decision adopting Creative
        Commons as an open licence under the European Commission’s reuse policy:
        <br><br>
        Creative Commons Attribution 4.0 International Public License (CC BY 4.0) is adopted as an
        open licence for the Commission’s reuse policy under Article 6 of Decision 2011/833/EU.
        <br><br>
        Without prejudice to the preceding article, raw data, metadata or other documents of
        comparable nature may alternatively be distributed under the provisions of the Creative
        Commons Universal Public Domain Dedication deed (CC0 1.0).
      </p>
    </div>

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
              :validation="key" class="w-100"></FormKit>
          </div>
        </div>
        <div v-if="selectedItem === 'vocabulary' || Object.keys(props.context.value).length > 0
          && props.context.value.name && selectedItem != 'manually'" class="conditionalVocabulary">
          <AutocompleteInput :context="props.context"></AutocompleteInput>
        </div>


      </div>

    </div>
  </div>

</template>
<script setup>
import { ref } from 'vue';
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

</script>
<style>
.conditionalManual {
  .formkit-outer {
    width: 100%;
  }
}
.infoLicense{
  padding: 1rem;
  background-color: rgb(171, 225, 165)
}
</style>