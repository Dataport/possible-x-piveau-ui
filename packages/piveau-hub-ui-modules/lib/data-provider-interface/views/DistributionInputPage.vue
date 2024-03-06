
<template>
  <h1>Distributions</h1>
  <hr>
  <div name="distribution-stepper-list" class="distributionsListClass">
    <FormKit type="list" name="distributionList">
      <section v-for="i in distributionList" :key="i">
        <DistributionStepper :name="`Distribution ${i + 1}`" :index=i :schema="schema" :values="values" />
      </section>
    </FormKit>

    <button class="btn btn-secondary" @click="pushDistribution">{{ $t('message.dataupload.newDistribution') }}</button>
    <button class="btn btn-secondary" @click="popDistribution">{{ $t('message.dataupload.deletemodal.deleteDistribution')
    }}</button>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
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
      latestNonce: 0,
      distributionList: [],
      nameOfDistribution: "",
      presentDistributions: 0
    }
  },
  created() {
    try {
      this.presentDistributions = JSON.parse(localStorage.getItem('dpi_datasets'))['Distributions']['distributionList'].length
    console.log(this.presentDistributions);
    } catch (error) {
      console.log(error);
    }

    for (let index = 0; index < this.presentDistributions; index++) {
      this.distributionList.push(index)
    }

    //  console.log( this.pathToLocalStorage['Distributions']['distributionList'].length);
    // console.log(this.values['Distributions']['distributionList'].length);
  },
  methods: {
    pushDistribution() {
      this.distributionList.push(this.latestNonce);
      this.latestNonce++;
    },
    popDistribution() {
      this.distributionList.pop();
    },
    removeDistributionByIndex(index) {
      this.distributionList.splice(index, 1);
    },
  },
});
</script>

<style></style>