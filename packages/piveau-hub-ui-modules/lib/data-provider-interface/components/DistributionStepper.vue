
<template>
  <div name="distribution-stepper">
    <h3 v-if="name">{{ name }}</h3>
    <div class="disInputInteractionButtons">
      <div v-for="step, index in distributionSteps" :key="step">
        <span v-on:click="distributionSteps[index] = !distributionSteps[index]">Step {{ index + 1 }}</span>
      </div>
    </div>
    <FormKit type="group">
      <div v-for="step, index in distributionSteps" :key="step">
        <div v-show="distributionSteps[index]">
          <FormKitSchema :schema="schema[index]" />
        </div>
      </div>
    </FormKit>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    name: {
      type: String,
      default: '',
    },
    schema: {
      required: true,
      type: Object,
    }
  }, 
  data() {
    return {
      distributionSteps: [
        false,
        false,
        false,
        false
      ],
    }
  },
});
</script>

<style></style>