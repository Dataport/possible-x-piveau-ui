<template>
    <div name="distribution-stepper-list">
        <FormKit type="list" name="distributionList">
            <section v-for="i in distributionList" :key="i">
                <DistributionStepper :name="`Distribution ${i + 1}`" :index=i :schema="schema" :values=values />
            </section>

        </FormKit>

        <button class="btn btn-secondary" @click="pushDistribution">Add Distribution</button>
        <button class="btn btn-secondary" @click="popDistribution">Remove Distribution</button>
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
            nameOfDistribution: ""
        }
    },
    created() {
        this.pushDistribution();

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