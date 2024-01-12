<script setup>

</script>
<template>
  <div name="distribution-stepper">
    <h3 v-if="name">{{ name }}</h3>
    <h5>{{ getDisName() }}</h5>
    <div class="disInputInteractionButtons">
      <div v-for="step, index in distributionSteps" :key="step">
        <span v-on:click="handleClick(index)"> {{ step.name }}</span>
      </div>
    </div>
    <FormKit type="group">
      <div v-for="step, index in distributionSteps" :key="step">
        <div v-show="step['show']">
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
    index: {
      required: true
    },
    schema: {
      required: true,
      type: Object,
    },
    values: {
      type: Object,
    }

  },
  data() {
    return {
      distributionSteps: [
        { "name": "Mandatory", "show": false },
        { "name": "Advised", "show": false },
        { "name": "Recommended", "show": false },
        { "name": "Additional", "show": false }],
    }
  }, methods: {
    handleClick(i) {
      this.distributionSteps.filter(e => e.show = false)
      this.distributionSteps[i].show = !this.distributionSteps[i].show;
    },
    getDisName() {
      return this.values['distribution']['distributionList'][this.index]
    }
  }, computed: {
    listElementShow() {
      return this.distributionSteps.filter(e => e.show);
    }
  }
});
</script>

<style></style>