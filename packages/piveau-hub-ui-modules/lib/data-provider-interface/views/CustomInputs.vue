<script setup>
import { ref } from 'vue';

// Data Structure
const values = ref({});
</script>

<template>
  <FormKit type="form" v-model="values" :actions="false">
    <FormKit type="text" id="title" name="title" label="Dataset Title" placeholder="Enter Dataset Title"></FormKit>
    <FormKit type="id" id="datasetID" name="datasetID" label="Dataset ID"></FormKit>
    <FormKit type="file" id="fileUpload" name="fileUpload" label="File Upload"></FormKit>
    <FormKit type="auto" id="autocomplete" name="autocomplete" label="Autocomplete"></FormKit>
    <pre>{{ values }}</pre>
  </FormKit>
</template>

<style>
.formkit-inner {
  display: block;
}
</style>