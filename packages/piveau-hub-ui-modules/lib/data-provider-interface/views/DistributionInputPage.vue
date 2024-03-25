<template>
  <h1>Distributions</h1>
  <hr>
  <div name="distribution-stepper-list" class="distributionsListClass">

    <FormKit type="list" name="distributionList">
      <section v-for="(dist, index) in distributionList" :key="index">
        <DistributionStepper 
          :name="dist" 
          :index="index" 
          :schema="schema" 
          :values="values" 
          :distributionIsCollapsed="collapsedDistributions[index]" 
          :collapseDistributions="collapseDistributions" 
          :deleteDistribution="deleteDistribution" 
          :distributionList="distributionList"
          ></DistributionStepper>
      </section>
    </FormKit>

    <button class="btn btn-secondary" @click="addDistribution">{{ $t('message.dataupload.newDistribution') }}</button>
    <button class="btn btn-secondary" @click="deleteAllDistributions">Delete all Distributions</button>
    <!-- <button class="btn btn-secondary" @click="deleteAllDistributions">{{ $t('message.dataupload.deletemodal.deleteAllDistributions') }}</button> -->

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
      collapsedDistributions: [],
      existingDistributions: 0,
    }
  },
  created() {
    // TODO: Load from LOCAL STORAGE
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
      this.distributionList.push(`Distribution ${this.existingDistributions + 1}`);
      this.collapseAllDistributions();
      this.collapsedDistributions.push(false);
      this.existingDistributions++;
    },
    deleteDistribution(index) {
      this.distributionList.splice(index, 1);
      this.collapsedDistributions.splice(index, 1);
      this.collapseAllDistributions();
    },
    deleteAllDistributions() {
      this.distributionList = [];
      this.collapsedDistributions = [];
      this.existingDistributions = 0;
    },
    collapseDistributions(index) {
      this.collapseAllDistributions();
      this.collapsedDistributions[index] = false;
    },
    collapseAllDistributions() {
      this.collapsedDistributions = this.collapsedDistributions.map(cd => true);
    },
  },
});
</script>

<style></style>