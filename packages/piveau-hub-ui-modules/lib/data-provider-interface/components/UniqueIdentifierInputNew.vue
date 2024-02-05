<script setup>
import { ref, watch } from 'vue'
import { computed } from "vue";
import { useStore } from 'vuex'
import { getNode } from '@formkit/core'
import { onMounted } from 'vue'


const store = useStore()
const getIsEditMode = computed(() => store.getters['auth/getIsEditMode'])
const getTitle = document.getElementById("input_3")
const props = defineProps({
  context: Object,
  titleValue: String
})
let initialValue = ref({})
initialValue = computed(() => props.context.value)

watch(initialValue, async (newValue, oldValue) => {
  console.log(props.context);
  console.log(newValue, oldValue);
})

/**
 * Handle input, advancing or retreating focus.
 */
function handleInput(index, e) {

  console.log(getTitle);
  initialValue = index.target.value;
  props.context.node.input(index.target.value)
}
function checkUniqueID(uniqueID) {
  this.draftIDs = this.getUserDrafts.map(element => element['id']);

  return new Promise(() => {
    if (isNil(uniqueID) || uniqueID === '' || uniqueID === undefined) this.isUniqueID = true;
    else if (this.draftIDs.includes(uniqueID)) this.isUniqueID = false;
    else {
      const request = `${this.$env.api.hubUrl}${this.$route.params.property}/${uniqueID}?useNormalizedId=true`;
      axios.head(request)
        .then(() => {
          this.isUniqueID = false;
        })
        .catch((e) => {
          if (e.response) console.log(e);
          this.isUniqueID = true;
        });
    }
  });
}

function handleFocus(e) {
  e.target.select()
}
function setValue() {
  return node.props.value
}
onMounted(() => {

});
</script>

<template>
  <h4>ID</h4>
  <input v-if="!getIsEditMode" class="formkit-inner formkit-input" style="width:65%" type="text"
    @input="handleInput($event)" :value="initialValue" @focus="handleFocus">
  <input v-else type="text" name="" id="">
</template>

<style></style>
