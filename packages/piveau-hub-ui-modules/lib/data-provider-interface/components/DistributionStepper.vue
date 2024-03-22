<template>
  <FormKit type="form" :actions="false" :plugins="[stepPlugin]">
    <div name="distribution-stepper" class="singleDistributions">
      <div class="disSectionHead d-flex align-items-center">
        <h3 @click="isActive = !isActive; editDistribution()">{{ getName }}</h3>
        <div class="interactionDis">
          <a @click="isActive = !isActive; editDistribution()">Edit</a>
          <a @click="deleteDistribution(index)">Delete</a>
        </div>
      </div>

      <div class="disInfoWrapper" v-if="!isCollapsed">
        <ul class="steps">
          <li v-for="(step, stepName, index) in steps" :key="index" class="step"
            :data-step-active="activeStep === stepName" :data-step-valid="step.valid && step.errorCount === 0" :class="{
              activeItem: activeStep === stepName, inactiveStep: stepName != activeStep, 'has-errors': checkStepValidity(stepName)
            }" @click="activeStep = stepName">
            <div class="stepBubbleWrap">
              <div class="circle stepCircle">{{ index + 1 }}</div>
              <span v-if="checkStepValidity(stepName)" class="step--errors" />
              <!-- v-text="step.errorCount + step.blockingCount" /> -->
              {{ camel2title(stepName) }}
            </div>
            <div v-if="index + 1 != Object.keys(getNavSteps.distributions).length" class="seperatorHorizontalStepper">
            </div>
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
              <FormKitSchema :schema="schema[stepName]" :library="library" />
              <p v-if="stepName === 'Mandatory'" class="p-1"> <b>*</b> mandatory</p>
            </InputPageStep>
          </div>
        </div>
      </div>

      <!-- <Navigation :steps="distSteps" :nextStep="distNextStep" :previousStep="distPreviousStep"
              :goToNextStep="distGoToNextStep" :goToPreviousStep="distGoToPreviousStep"></Navigation> -->
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
  </FormKit>
</template>

<script>
import { defineComponent, markRaw, nextTick } from 'vue';
import { mapGetters } from 'vuex';
import { useDpiStepper } from '../composables/useDpiStepper';
import InputPageStep from '../components/InputPageStep.vue';
import SelectControlledGroup from './SelectControlledGroup.vue';


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
    },
    context: {
      type: Object,
    },
    deleteDistribution: {
      type: Function,
    }
  },
  components: {
    InputPageStep,
  },
  data() {
    return {
      isCollapsed: false,
      camel2title: (str) =>
        str
          .replace(/([A-Z])/g, (match) => ` ${match}`)
          .replace(/^./, (match) => match.toUpperCase())
          .trim(),
      isActive: false
    }
  }, 
  methods: {
    handleClick(i) {
      this.distributionSteps.filter(e => e.show = false)
      this.distributionSteps[i].show = !this.distributionSteps[i].show;
    },
    editDistribution() {
      this.isCollapsed = !this.isCollapsed;
    }
  }, 
  computed: {
    ...mapGetters('dpiStore', [
      'getNavSteps'
    ]),
    getName() {
      return this.name 
        || values['Distributions']['distributionList'][this.name - 1]['Mandatory']['dcat:accessURL'][0]['@id'];
    },
    listElementShow() {
      return this.distributionSteps.filter(e => e.show);
    }
  },
  created() {},
  setup() {
    const {
      steps,
      activeStep,
      visitedSteps,
      previousStep,
      nextStep,
      stepPlugin,
      goToNextStep,
      goToPreviousStep,
    } = useDpiStepper();

    const checkStepValidity = (stepName) => {
      return (steps[stepName].errorCount > 0 || steps[stepName].blockingCount > 0) && visitedSteps.value.includes(stepName)
    }

    const library = markRaw({
      SelectControlledGroup,
    })

    return {
      steps,
      visitedSteps,
      activeStep,
      previousStep,
      nextStep,
      stepPlugin,
      checkStepValidity,
      goToNextStep,
      goToPreviousStep,

      library,
    }
  }
});
</script>

<style></style>