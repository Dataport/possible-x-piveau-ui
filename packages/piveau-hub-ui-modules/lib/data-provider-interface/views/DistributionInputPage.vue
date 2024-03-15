<template>
  <h1>Distributions</h1>
  <hr>
  <div name="distribution-stepper-list" class="distributionsListClass">
    <FormKit type="list" name="distributionList">
      <section v-for="i in distributionList" :key="i">
        <DistributionStepper :name="`${i + 1}`" :index=i :schema="schema" :values="values" />
      </section>
    </FormKit>

    <button class="btn btn-secondary" @click="pushDistribution">{{ $t('message.dataupload.newDistribution') }}</button>
    <button class="btn btn-secondary" @click="popDistribution">{{
        $t('message.dataupload.deletemodal.deleteDistribution')
      }}</button>
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
      latestNonce: 0,
      distributionList: [],
      nameOfDistribution: "",
      presentDistributions: 0
    }
  },
  created() {
    try {
      this.presentDistributions = JSON.parse(localStorage.getItem('dpi_datasets'))['Distributions']['distributionList'].length
    } catch (error) {

    }
    for (let index = 0; index < this.presentDistributions; index++) {
      this.distributionList.push(index)
    }
  },
  async mounted() {
    try {
      for (let arrInd = 0; arrInd < document.getElementsByClassName('disInfoWrapper').length; arrInd++) {
        document.getElementsByClassName('disInfoWrapper')[arrInd].classList.toggle('d-none');
      }
      document.getElementsByClassName('disInfoWrapper')[0].classList.toggle('d-none');
    } catch (error) {
    }

    await nextTick()
    

  },
  methods: {
    closeAllDis() {
      for (let arrInd = 0; arrInd < document.getElementsByClassName('disInfoWrapper').length; arrInd++) {
        if (!document.getElementsByClassName('disInfoWrapper')[arrInd].classList.contains('d-none')) {
          document.getElementsByClassName('disInfoWrapper')[arrInd].classList.toggle('d-none');

        }
      }
    },
    pushDistribution() {
      this.distributionList.push(this.latestNonce);
      this.latestNonce++;
      this.closeAllDis();
      try { document.getElementsByClassName('disInfoWrapper')[this.latestNonce].classList.toggle('d-none') }
      catch (error) { }

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