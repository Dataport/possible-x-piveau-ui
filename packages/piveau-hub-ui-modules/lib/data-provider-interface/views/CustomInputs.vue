<script setup>
import { ref } from 'vue';
import { createInput } from '@formkit/vue';
import UniqueIdentifierInput from '../components/UniqueIdentifierInput.vue';

const values = ref({});
const id = createInput(UniqueIdentifierInput, {});
</script>

<template>
  <FormKit type="form" v-model="values" :actions="false" #default="{ value }">
    <FormKit type="text" id="title" name="title" label="Dataset Title" placeholder="Enter Dataset Title"></FormKit>
    <FormKit :type="id" id="datasetID" name="datasetID" label="Dataset ID"></FormKit>
    <pre>{{ value }}</pre>
  </FormKit>
</template>

<style>
.formkit-inner {
  display: block;
}
</style>