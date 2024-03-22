<template>
  <h1>Distributions</h1>
  <hr>
  <div name="distribution-stepper-list" class="distributionsListClass">
    <FormKit type="list" name="distributionList">
      <section v-for="(dist, index) in distributionList" :key="index">
        <DistributionStepper :name="dist" :index="index" :schema="schema" :values="values" :deleteDistribution="deleteDistribution"></DistributionStepper>
      </section>
    </FormKit>

    <button class="btn btn-secondary" @click="addDistribution">{{ $t('message.dataupload.newDistribution') }}</button>
    <button class="btn btn-secondary" @click="deleteAllDistributions">{{ $t('message.dataupload.deletemodal.deleteDistribution') }}</button>
  </div>
</template>

<script>
import { defineComponent, nextTick } from 'vue';
import DistributionStepper from '../components/DistributionStepper.vue';

export default defineComponent({
  props: {
    schema: {
      required: true,
      type: Object,
    },
    values: {
      required: true,
    }
  },
  components: {
    DistributionStepper,
  },
  data() {
    return {
      distributionList: [],
      existingDistributions: 0
    }
  },
  created() {
    // LOCAL STORAGE
    // try {
    //   this.existingDistributions = JSON.parse(localStorage.getItem('dpi_datasets'))['Distributions']['distributionList'].length
    // } catch (error) {

    // }
    // for (let index = 0; index < this.existingDistributions; index++) {
    //   this.distributionList.push(index)
    // }
  },
  methods: {
    addDistribution() {
      console.log('ADD')
      this.distributionList.push(`Distribution ${this.existingDistributions + 1}`);
      this.existingDistributions++;
    },
    deleteDistribution(index) {
      console.log('DELETE ' + index)
      this.distributionList.splice(index, 1);
    },
    deleteAllDistributions() {
      console.log('DELETE ALL')
      this.distributionList = [];
      this.existingDistributions = 0;
    },
  },
});
</script>

<style></style>