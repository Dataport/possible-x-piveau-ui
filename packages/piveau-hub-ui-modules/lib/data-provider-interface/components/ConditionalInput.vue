<template>
  <div class="formkitProperty">
    <h4 class="formkitHeader">{{ props.context.attrs.identifier.charAt(0).toUpperCase() + props.context.attrs.identifier.slice(1) }}</h4>
    <div v-if="props.context.attrs.identifier === 'licence'" class="d-flex infoLicense py-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="currentColor"
        class="bi bi-info-circle mx-3 mb-3 mt-1 infoboxI " viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path
          d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
      </svg>
      <p class="textInfoI">For European Commission’s datasets, bear in mind that Decision <a
          href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011D0833">2011/833/EU</a> allows for their
        commercial reuse
        without prior authorisation, except for the material subject to the third party intellectual property rights.
        This Decision has been implemented under the <a
          href="https://ec.europa.eu/transparency/documents-register/detail?ref=C(2019)1655&lang=en">Decision C(2019)
          1655 final</a> by which Creative Commons Attribution
        4.0 International Public License (CC BY 4.0) is adopted as an open licence for the Commission’s reuse policy.
        Additionally, raw data, metadata or other documents of comparable nature may alternatively be distributed under
        the provisions of the Creative Commons Universal Public Domain Dedication deed (CC0 1.0).
        <br><br>
        The Council and the European Court of Auditors have approved similar decisions on reuse. It is advisable that
        you check the reuse policy of your organisation before publishing or submitting your dataset.
      </p>
    </div>
    <div v-if="props.context.attrs.identifier === 'rights'" class="d-flex infoLicense py-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" fill="currentColor"
        class="bi bi-info-circle mx-3 mb-3 mt-1 infoboxI" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path
          d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
      </svg>
      <p class="textInfoI">As owner of your dataset, you guarantee that it does not violate the copyright, other intellectual property or
        privacy rights of any third party. In particular, if third party material is included in the dataset, you must
        ensure that all necessary permissions have been obtained and appropriate acknowledgment is given, if necessary.
        <br><br>
        If you need further information regarding copyright issues, please contact us at 
        <a href="mailto:op-copyright@publications.europa.eu">op-copyright@publications.europa.eu</a>
      </p>
    </div>
    <!-- Choice between text and URL -->
    <div class="formkitCmpWrap simpleConditional" v-if="props.context.attrs.identifier === 'rights'">
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
          <div class="d-flex" v-if="selectedItem === 'url' || props.context.node.value['@type'] === 'url'">
            <FormKit type="url" placeholder="Please provide a valid URL" name="rdfs:label" validation="url"
              class="w-100" identifier="rightsUrl" v-model="props.context.value['rdfs:value']"></FormKit>
          </div>
        </div>
        <div v-if="selectedItem === 'text' || props.context.value['@type'] === 'text'">
          <FormKit type="text" placeholder="Please provide a Text" name="rdfs:label" class="w-100"
            identifier="rightsText" v-model="props.context.value['rdfs:value']"></FormKit>
        </div>
      </div>
    </div>

    <!-- Choice between manualinput and vocabulary search -->
    <div class="formkitCmpWrap simpleConditional" v-else>
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

  if (e.target.innerHTML === 'Manually') { selectedItem.value = "manually" }
  if (e.target.innerHTML === 'Vocabulary') { selectedItem.value = "vocabulary" }
  if (e.target.innerHTML === 'URL') { selectedItem.value = "url" }
  if (e.target.innerHTML === 'Text') { selectedItem.value = "text" }

  props.context.node.reset()
  props.context.value = ""
}

onClickOutside(I1, event => showSelect.value = false)

</script>
<style>
.conditionalManual {
  .formkit-outer {
    width: 100%;
  }
}

.infoLicense {
  a {
    color: blue;
  }

  padding: 1rem;
  background-color: rgb(171, 225, 165)
}
.infoboxI{
  width: 5%;
}
.textInfoI{
 width: 95%;
}
</style>