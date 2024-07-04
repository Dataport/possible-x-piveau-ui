<template>
  <div class="form-container ">
    <div ref="fkInputContainer" class="inputContainer" v-if="isInput">
      <div class="formContainer formkit position-relative">

        <details>{{ formValues }}</details>
        <FormKit type="form" v-model="formValues" :actions="false" :plugins="[stepPlugin]" id="dpiForm"
          @change="saveFormValues({ property: property, page: page, distid: id, values: formValues })"
          @click="saveFormValues({ property: property, page: page, distid: id, values: formValues })" @submit.prevent=""
          class="d-flex">

          <div class="d-flex">
            <ul class="steps">
              <li v-for="(step, stepName, index) in steps" :key="step" class="step"
                :data-step-active="activeStep === stepName" :data-step-valid="step.valid && step.errorCount === 0"
                :class="{ activeItem: activeStep === stepName, inactiveStep: stepName != activeStep, 'has-errors': checkStepValidity(stepName) }"
                @click="activeStep = stepName; update(); scrollToTop()">

                <div class="stepBubbleWrap">
                  <div class="circle stepCircle">{{ index + 1 }}</div>
                  <span v-if="checkStepValidity(stepName)" class="step--errors"
                    v-text="step.errorCount + step.blockingCount" />{{ camel2title(stepName) }}
                </div>
                <div v-if="index != Object.keys(steps).length" class="seperatorHorizontalStepper"></div>
              </li>
              <li class="step inactiveStep" v-if="activeStep === 'Overview'">
                <div class="circle stepCircle"></div>
              </li>

            </ul>

            <div class="d-flex flex-column w-100">
              <div v-for="(stepName, index) in getNavSteps($env.content.dataProviderInterface.specification)[property]"
                :key="index">
                <InputPageStep :name="stepName">
                  <div v-if="stepName !== 'Distributions' && stepName !== 'Overview'" class="w-100">
                    <h1 style="min-width:100%">{{ stepName }} fields</h1>
                    <!-- <p class="infoTextDPISteps">This text can and schould be altered to describe the following
                      properties in a short way. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
                      kasd gubergren, no sea
                      takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
                      elitr, sed diam nonumy
                      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos
                      et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus
                      est Lorem ipsum dolor sit amet.</p> -->
                  </div>
                  <!-- <PropertyChooser></PropertyChooser> -->
                  <FormKitSchema v-if="stepName !== 'Distributions'" :schema="getSchema(property)[stepName]"
                    :library="library" />
                  <DistributionInputPage v-if="stepName === 'Distributions'" :schema="getSchema('distributions')"
                    :values="formValues" />
                  <p class="p-1" v-if="stepName === 'Mandatory'"> <b>*</b> mandatory</p>
                </InputPageStep>
              </div>
            </div>
          </div>

          <Navigation :steps="steps" :nextStep="nextStep" :previousStep="previousStep" :goToNextStep="goToNextStep"
            :goToPreviousStep="goToPreviousStep"></Navigation>

        </FormKit>

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-alert,arrow-parens,no-param-reassign,no-lonely-if */
import { defineComponent, markRaw } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import $ from 'jquery';
import PropertyChooser from './PropertyChooser.vue'
import { has, isNil, isEmpty } from 'lodash';
import DistributionInputPage from './DistributionInputPage.vue';
import OverviewPage from './OverviewPage.vue';
import InputPageStep from '../components/InputPageStep.vue';
import Navigation from '../components/Navigation.vue';
import { useDpiStepper } from '../composables/useDpiStepper';
import { useWindowScroll } from '@vueuse/core'


export default defineComponent({
  props: {
    property: {
      required: true,
      type: String,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      heightActiveSec: "10vh",
      formValues: {},
      offsetTopStepper: "60px",
      info: {},
      catalogues: [],
      byte: true,
      // steps:{},
      camel2title: (str) =>
        str
          .replace(/([A-Z])/g, (match) => ` ${match}`)
          .replace(/^./, (match) => match.toUpperCase())
          .trim(),
    };
  },
  components: {
    InputPageStep,
    DistributionInputPage,
    PropertyChooser,
    Navigation
  },
  computed: {
    ...mapGetters('auth', [
      'getIsEditMode',
      'getUserCatalogIds',
    ]),
    ...mapGetters('dpiStore', [
      'getSchema',
      'getNavSteps',
      'getDeleteDistributionInline',
    ]),
    getTitleStep() {
      return Object.keys(this.formValues).filter(key => has(this.formValues[key], 'dct:title'))[0];
    },
    createIDFromTitle() {

      const title = this.formValues[this.getTitleStep]['dct:title'][0]['@value'];

      if (title != undefined) {
        return title
          .toLowerCase()
          .replace(/ /g, '-');
      }
      else return;
    },
    getFirstTitleFromForm() {
      const allValues = this.formValues[this.getTitleStep];

      return has(allValues, 'dct:title')
        && allValues['dct:title'].length > 0
        && has(allValues['dct:title'][0], '@value')
        && !isNil(allValues['dct:title'][0], '@value')
        ? allValues['dct:title'][0]['@value']
        : '';
    },
    isInput() {
      return this.$route.params.page !== 'overview' && this.$route.params.page !== 'distoverview';
    },
  },
  methods: {
    ...mapActions('auth', [
      'setIsEditMode',
      'setIsDraft',
    ]),
    ...mapActions('dpiStore', [
      'createSchema',
      'translateSchema',
      'saveFormValues',
      'saveLocalstorageValues',
      'addCatalogOptions',
      'clearAll',
    ]),
    update() {
      this.$forceUpdate();
    },
    clearForm() {
      this.$formkit.reset('dpi')
    },
    scrollToTop() {
      window.scrollTo(0, 0);
    },
    initInputPage() {

      // adding validation of modified and issued based on edit mode
      // no validation in edit mode

      // get step name where issued and modified are included
      const initialSchema = this.getSchema(this.property);
      const stepWithDates = Object.keys(initialSchema).find(
        key => initialSchema[key].map(el => el.name).includes('dct:issued') || initialSchema[key].map(el => el.name).includes('dct:modified')
      );

      if (localStorage.getItem('dpi_editmode') === 'true') {
        initialSchema[stepWithDates].forEach((el) => {
          if (el['identifier'] === 'issued' || el['identifier'] === 'modified') {
            el['children'][1]['props']['else']['validation'] = ''
            el['children'][1]['props']['else']['validation-visibility'] = ''

            el['children'][1]['props']['then']['validation'] = ''
            el['children'][1]['props']['then']['validation-visibility'] = ''
            el['children'][1]['props']['then']['validation'] = ''
            el['children'][1]['props']['then']['validation-visibility'] = ''

            // console.log(el)
          }
        }
        );
      }

      if (localStorage.getItem('dpi_editmode') === 'false') {
        this.setIsDraft(false)
        this.setIsEditMode(false)
      }

      this.saveLocalstorageValues(this.property); // saves values from localStorage to vuex store
      const existingValues = this.$store.getters['dpiStore/getRawValues']({ property: this.property });

      // only overwrite empty object if there are values
      if (!isEmpty(existingValues)) this.formValues = existingValues;

      this.$nextTick(() => {
        $('[data-toggle="tooltip"]').tooltip({
          container: 'body',
        });
      });
    },
    createDatasetID() {
      const valueObject = this.formValues[this.getTitleStep];
      if (!has(valueObject, 'datasetID') || isNil(valueObject['datasetID'])) {
        // console.log('in if');
        this.formValues[this.getTitleStep].datasetID = this.createIDFromTitle;
      }
      else {

        if (this.createIDFromTitle.startsWith(valueObject.datasetID) || valueObject.datasetID.startsWith(this.createIDFromTitle)) {
          // console.log('in else');
          this.formValues[this.getTitleStep].datasetID = this.createIDFromTitle;
        }
      }
    },
    generateandTranslateSchema(property) {
      for (let index = 0; index < this.getNavSteps(this.$env.content.dataProviderInterface.specification)[property].length; index++) {
        this.createSchema({ property: property, page: this.getNavSteps(this.$env.content.dataProviderInterface.specification)[property][index], specification: this.$env.content.dataProviderInterface.specification });
        this.translateSchema({ property: property, page: this.getNavSteps(this.$env.content.dataProviderInterface.specification)[property][index] });
      }
    }
  },
  created() {


    // Needs to be reworked
    if (this.$route.query.edit === 'false') {
      this.clearAll();
      // localStorage.clear();
    }

    // create schema for datasets or catalogues
    this.generateandTranslateSchema(this.property);

    // for datasets also create schema for distributions
    if (this.property === 'datasets') {
      this.generateandTranslateSchema('distributions');
    }
  },
  mounted() {
    this.initInputPage();
  },
  watch: {
    activeStep: {
      handler() {
        this.scrollToTop();
      },
    },
    getFirstTitleFromForm: {
      handler() {
        if (localStorage.getItem('dpi_editmode') === 'false') {
          this.setIsDraft(false)
          this.setIsEditMode(false)
        }
        // only create id from title if the user is not editing an existing dataset with an existing datasetID
        if (!this.getIsEditMode) {
          this.createDatasetID();
        }
      },
    },
    // the schema is a computed value which gets computed only once so on language change this value must be re-computed
    '$i18n.locale': {
      handler() {
        this.generateandTranslateSchema(this.property);
        if (this.property === 'datasets') this.generateandTranslateSchema('distributions');
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    // Always clear storage when entering DPI
    next(vm => {
      if (from.name && !from.name.startsWith('DataProviderInterface')) {
        vm.clearAll();
      }
    });
  },
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





    const scrollToTop = () => {
      let { x, y } = useWindowScroll({ behavior: 'smooth' })
      y.value = 0

    }

    const checkStepValidity = (stepName) => {
      return (steps[stepName].errorCount > 0 || steps[stepName].blockingCount > 0) && visitedSteps.value.includes(stepName)
    }

    const library = markRaw({ OverviewPage })

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
      scrollToTop,
      library,
    }
  }
});
</script>

<style lang="scss">


:root {
  --gray: #ccccd7;
  --gray-l: #eeeef4;
}

.formkit-form {
  max-width: 500px;
  flex-shrink: 0;
  margin-top: 1em;
  margin-bottom: 1em;
  background: #fff;
  color: #000;
  border: 1px solid var(--gray);
  border-radius: 0.5em;
  box-shadow: 0.25em 0.25em 1em 0 rgba(0, 0, 0, 0.1);
}

#app .source-content {
  padding: 2em;
  background: transparent;
}

.steps {
  list-style-type: none;
  margin: 0;
  display: flex;
  padding-left: 0;
  background: var(--gray-l);
  border-radius: 0.4em 0.4em 0 0;
  overflow: hidden;
  border-bottom: 1px solid var(--gray);
}

.step {
  font-size: 14px;
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: var(--gray-l);
  border-right: 1px solid var(--gray);
  color: gray;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;
}

.step:last-child {
  box-shadow: 0.1em -0.1 0.1em 0 rgba(0, 0, 0, 0.33)
}

.step:hover {
  cursor: pointer;
}

[data-step-active="true"] {
  color: black;
  background: white !important;
  border-bottom: none;
  position: relative;
}

.step--errors,
[data-step-valid="true"]:after {
  content: 'âœ“';
  background-color: #54A085;
  position: absolute;
  top: 4px;
  right: 4px;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  z-index: 10;
  display: flex;
  font-size: 10px;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  color: white;
}

.step--errors {
  background-color: #ff4949;
  color: #fff;
  z-index: 100;
}

.step-nav {
  display: flex;
  margin-top: 2em;
  margin-bottom: 1em;
  justify-content: space-between;
}

.form-body {
  padding: 2em;
}

.next {
  margin-left: auto;
}

.formkit-outer[data-type="submit"] .formkit-wrapper {
  padding: 0 2em 1em 2em;
  display: flex;
}

.formkit-outer[data-type="submit"] .formkit-input {
  margin-left: auto;
  margin-right: 0;
}

details {
  border: 1px solid var(--gray);
  background: var(--gray-l);
  border-radius: .15em;
  padding: 1em;
}

.formkit-form>.formkit-messages {
  padding: 0 2em 0em 2em;
}

.formkit-form>.formkit-messages:last-child {
  padding: 0 2em 2em 2em;
}

[data-errors="true"] .formkit-label {
  color: #ff4949;
}

.formkit-wrapper {
  max-width: 100%;
}

button:hover,
summary {
  cursor: pointer
}


@media (max-width: 438px) {
  h1 {
    font-size: 1.15em;
  }

  #app .source-content {
    padding: 0.5em;
  }

  .steps {
    flex-direction: column;
  }

  .step {
    border-bottom: 1px solid var(--gray);
    border-right: none;
  }

  .step:last-child {
    border-bottom: none;
  }

  .form-body {
    padding: 1em;
  }

  .formkit-outer[data-type="submit"] .formkit-wrapper {
    padding: 0 1em 1em 1em;
    display: flex;
  }

  .formkit-form>.formkit-messages {
    padding: 0 1em 0em 1em;
  }

  .formkit-form>.formkit-messages:last-child {
    padding: 0 1em 1em 1em;
  }
}

.activeItem {
  flex-grow: 1;

  .seperatorHorizontalStepper {
    height: 100%;
  }
}

select {

  line-height: unset !important;
}

.form-container {
  padding-top: 20px;
  margin-top: 30px;
  border: solid 1px #d5d5d5;
  border-radius: 3px;
  margin-bottom: 20px;
}

.inputContainer {
  display: flex;
}

.formContainer {
  width: 100% !important;
}

.distributionPage0 {
  display: block;
}

.distributionPage1 {
  display: none;
}

.distributionPage2 {
  display: none;
}

.grid2r2c {
  .formkit-input-group-repeatable {
    display: grid;
    grid-template-columns: 70% 28%;
    grid-template-rows: auto auto;
    grid-gap: 10px;
    background-color: transparent;
  }
}

.grid1r2c {
  .formkit-input-group-repeatable {
    display: grid;
    grid-template-columns: 70% 28%;
    grid-template-rows: auto;
    grid-gap: 10px;
    background-color: transparent;
  }
}

.row1 {
  grid-row-start: 1;
  grid-row-end: 2;
}

.row2 {
  grid-row-start: 2;
  grid-row-end: 3;
}

.grow3 {
  grid-row-start: 3;
  grid-row-end: 4;
}

.column1 {
  grid-column-start: 1;
  grid-column-end: 2;
}

.column2 {
  grid-column-start: 2;
  grid-column-end: 3;
}

.columnboth {
  grid-column-start: 1;
  grid-column-end: 3;
}

.display-none {
  display: none;
}
</style>
