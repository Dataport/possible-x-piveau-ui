<script setup>

</script>
<template>
  <div name="distribution-stepper">
    <h3 v-if="name">{{ name }}</h3>

    <div class="d-flex">
      <ul class="steps">
        <li v-for="(stepName, index) in getNavSteps['distributions']" :key="index" 
          class="step" :data-step-active="activeStep === stepName" 
          :class="{ 
            activeItem: activeStep === stepName, 
            inactiveStep: stepName != activeStep,
          }" 
          @click="activeStep = stepName">


          <div class="stepBubbleWrap">
            <div class="circle stepCircle">{{ index + 1 }}</div>
            <span v-if="checkStepValidity(stepName)" class="step--errors"/>
              <!-- v-text="step.errorCount + step.blockingCount" /> -->
            {{ camel2title(stepName) }}
          </div>

          <div v-if="index + 1 != Object.keys(getNavSteps.distributions).length" class="seperatorHorizontalStepper"></div>
          <div v-if="activeStep === 'overview'" class="seperatorHorizontalStepper"></div>
        </li>

        <li class="step inactiveStep" v-if="activeStep === 'overview'">
          <div class="circle stepCircle"></div>
        </li>

      </ul>

      <div class="d-flex flex-column w-100">
        <div v-for="(stepName, index) in getNavSteps.distributions" :key="index">
          <InputPageStep :name="stepName">
            <!-- <PropertyChooser></PropertyChooser> -->
            <FormKitSchema :schema="schema[stepName]"/>
            <p class="p-1"> <b>*</b> {{ $t('message.dataupload.info.mandatory') }}</p>
          </InputPageStep>
        </div>
      </div>
    </div>

    <!-- <h5>{{ getDisName() }}</h5> -->
    <!-- <div class="disInputInteractionButtons">
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
    </FormKit> -->
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import { useDpiStepper } from '../composables/useDpiStepper';
import InputPageStep from '../components/InputPageStep.vue';


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
  components: {
    InputPageStep,
  },
  data() {
    return {
      camel2title: (str) =>
        str
          .replace(/([A-Z])/g, (match) => ` ${match}`)
          .replace(/^./, (match) => match.toUpperCase())
          .trim(),
    }
  }, methods: {
    handleClick(i) {
      this.distributionSteps.filter(e => e.show = false)
      this.distributionSteps[i].show = !this.distributionSteps[i].show;
    },
    getDisName() {
      // return this.values['distribution']['distributionList'][this.index]
    }
  }, computed: {
    ...mapGetters('dpiStore', [
      'getNavSteps'
    ]),
    listElementShow() {
      return this.distributionSteps.filter(e => e.show);
    }
  },
  setup() {
    const {
      activeStep,
      visitedSteps,
      previousStep,
      nextStep,
      stepPlugin,
      goToNextStep,
      goToPreviousStep,
    } = useDpiStepper();

    const checkStepValidity = (stepName) => {
      return true
      // return (steps[stepName].errorCount > 0 || steps[stepName].blockingCount > 0) && visitedSteps.value.includes(stepName)
    }

    return {
      visitedSteps,
      activeStep,
      previousStep,
      nextStep,
      stepPlugin,
      checkStepValidity,
      goToNextStep,
      goToPreviousStep,
    }
  }
});
</script>

<style></style>