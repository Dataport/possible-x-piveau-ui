<template>
  <div class="renderer-wrapper">
    <component
      :is="loadComponent(selectedResource)"
      :key="selectedResource"
      :selected-resource="selectedResource"
      :resource-details-data="resourceDetailsData"
      :copy-to-clipboard="copyToClipboard"
    />

    <div v-show="popUp" class="pop-up">Copied</div>
    <button @click="showPopup">Display me</button>
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';
import { ref } from 'vue';
import { getCurrentInstance } from 'vue';
import { resolveComponent } from 'vue';

const props = defineProps({
  selectedResource: {
    type: String,
    required: true,
  },
  resourceDetailsData: {
      type:Object,
      required:true
  },
  copyToClipboard:{
    type:Function,
    required:false
  },
  popUp:{
    type:Boolean,
    required:false
  }
});

const loadComponent = (resource) => {
  const componentName = resource.replace(/(^\w|_\w)/g, (match) =>
    match.replace('_', '').toUpperCase()
  );

  return resolveComponent(componentName);
};
</script>

<style scss>
  .pop-up{
      background-color: #e2e2e2;
      padding: .5rem 1rem;
      border-radius: .25rem;
      position: fixed;
      bottom: 5%;
      left: 50%;
    }
</style>