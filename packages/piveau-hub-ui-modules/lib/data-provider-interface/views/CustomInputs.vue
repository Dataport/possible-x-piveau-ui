<script setup>
import { ref } from 'vue';

// Data Structure
const values = ref({});
</script>

<template>
  <FormKit type="form" v-model="values" :actions="false">
    <FormKit type="text" id="title" name="title" label="Dataset Title" placeholder="Enter Dataset Title"></FormKit>
    <FormKit type="id" id="datasetID" name="datasetID" label="Dataset ID"></FormKit>
    <FormKit type="select" id="catalog" name="catalog" label="Catalog" :options="['dpi']"></FormKit>
    <FormKit type="fileupload" id="fileUpload" name="fileUpload" label="File Upload"></FormKit>
    <FormKit type="auto" id="autocomplete" name="autocomplete" label="Autocomplete" voc="file-type"></FormKit>
    <pre>{{ values }}</pre>
  </FormKit>
</template>

<style>
</style>