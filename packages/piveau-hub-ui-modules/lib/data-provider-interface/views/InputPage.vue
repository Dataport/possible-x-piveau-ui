

<template>
  <div class="form-container ">

    <details>{{ formValues }}</details>
    <div ref="fkInputContainer" class="inputContainer" v-if="isInput">
      <div class="formContainer formkit position-relative">

        <FormKit type="form" v-model="formValues" :actions="false" :plugins="[stepPlugin]" id="dpiForm"
          @change="saveFormValues({ property: property, page: page, distid: id, values: formValues })" @submit.prevent=""
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
              <div v-for="(stepName, index) in getNavSteps[property]" :key="index">
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
import axios from 'axios';
import { useWindowScroll } from '@vueuse/core'
import { ref } from 'vue';

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
      formValues:{},
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

      this.addCatalogOptions({ property: this.property, catalogs: this.getUserCatalogIds });
      this.saveLocalstorageValues(this.property); // saves values from localStorage to vuex store
      const existingValues = this.$store.getters['dpiStore/getRawValues']({ property: this.property, id: this.id });
      // console.log(existingValues.Mandatory);
      // only overwrite empty object if there are values (otherwise the language preselection is gone -- Needed to add "Mandatory", otherwise the condition would be true everytime)

      if (!isEmpty(existingValues)) this.formValues = existingValues;

      console.log('#####', this.formValues);

      this.$nextTick(() => {
        $('[data-toggle="tooltip"]').tooltip({
          container: 'body',
        });
      });
    },
    createDatasetID() {
      const valueObject = this.formValues[this.getTitleStep];

      // Create Dataset ID from title if not existing
      if (has(valueObject, 'dct:title') && !isNil(valueObject['dct:title'] && valueObject['dct:title'].length > 0)
        && has(valueObject['dct:title'][0], '@value') && !isNil(valueObject['dct:title'][0]['@value'])) {

        if (!has(valueObject, 'datasetID') || isNil(valueObject['datasetID'])) {
          this.formValues[this.getTitleStep].datasetID = this.createIDFromTitle;
        }
        else {
          if (this.createIDFromTitle.startsWith(valueObject.datasetID) || valueObject.datasetID.startsWith(this.createIDFromTitle)) {
            this.formValues[this.getTitleStep].datasetID = this.createIDFromTitle;
          }
        }
      }
    },
    async initCatalogues() {
      await axios
        .get(this.$env.api.baseUrl + 'search?filter=catalogue&limit=100')
        .then(response => (this.info = response))
      this.info.data.result.results.forEach((e) => {
        try {
          this.catalogues.push({ title: Object.values(e.title)[0], id: e.id })
        } catch (error) {
        }
      });
      this.findcatalogues()
      // need to forceupdate to display the filtered catalogues
      this.$forceUpdate();
    },
    findcatalogues() {
      for (let i = 0; i < Object.keys(this.getUserCatalogIds).length; i++) {
        for (let a = 0; a < Object.keys(this.catalogues).length; a++) {
          if (this.getUserCatalogIds[i] === this.catalogues[a].id) {
            this.getUserCatalogIds[i] = this.catalogues[a].title;
            break
          }
        }
      }
    },
    generateandTranslateSchema(property) {
      for (let index = 0; index < this.getNavSteps[property].length; index++) {
        this.createSchema({ property: property, page: this.getNavSteps[property][index] });
        this.translateSchema({ property: property, page: this.getNavSteps[property][index] });
      }
    }
  },
  created() {

    // Needs to be reworked
    // if (this.$route.query.edit === 'false') {
    //   this.clearAll();
    // }

    // create schema for datasets or catalogues
    this.generateandTranslateSchema(this.property);

    // for datasets also create schema for distributions
    if (this.property === 'datasets') {
      this.generateandTranslateSchema('distributions');
    }
  },
  mounted() {
    this.initInputPage();
    this.initCatalogues();
  },
  watch: {
    activeStep: {
      handler() {
        this.scrollToTop();
      },
    },
    getFirstTitleFromForm: {
      handler() {
        // only create id from title if the user is not editing an existing dataset with an existing datasetID
        if (!this.getIsEditMode) this.createDatasetID();
      },
    },
    getUserCatalogIds: {
      handler() {
        this.addCatalogOptions({ property: this.property, catalogs: this.getUserCatalogIds });
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
@import 'https://cdn.formk.it/web-assets/multistep-form.css';

.activeSection {
  // margin-top: v-bind(offsetTopStepper)
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
