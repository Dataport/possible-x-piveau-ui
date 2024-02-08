<template>
  <div class="form-container ">
    <slot></slot>
    <details>{{ formValues }}</details>
    <div class="inputContainer" v-if="isInput">
      <div class="formContainer formkit position-relative">
        <!-- TestPage for Custom Inputs -->
        <!-- <CustomInputs></CustomInputs> -->

        <FormKit type="form" v-model.lazy="formValues" :actions="false" @submit="handleSubmit" :plugins="[stepPlugin]"
          @change="saveFormValues({ property: property, page: page, distid: id, values: formValues })" class="d-flex">
          <div class="d-flex">
            <ul class="steps">
              <li v-for="(step, stepName, index) in steps" :key="step" class="step"
                :data-step-valid="step.valid && step.errorCount === 0" :data-step-active="activeStep === stepName" :class="{
                  activeItem: activeStep === stepName,
                  inactiveStep: stepName != activeStep,
                  'has-errors': checkStepValidity(stepName),
                }" @click="activeStep = stepName; handleStep(stepName)">
                <div class="stepBubbleWrap">
                  <div class="circle stepCircle">{{ index + 1 }}</div>
                  <span v-if="checkStepValidity(stepName)" class="step--errors"
                    v-text="step.errorCount + step.blockingCount" />
                  {{ camel2title(stepName) }}
                </div>
                <div v-if="index + 1 != Object.keys(steps).length" class="seperatorHorizontalStepper"></div>
                <div v-if="activeStep === 'overview'" class="seperatorHorizontalStepper"></div>
              </li>
              <li class="step inactiveStep" v-if="activeStep === 'overview'">
                <div class="circle stepCircle"></div>

              </li>
            </ul>
            <!-- <FormKitSummary /> -->
            <div class="d-flex flex-column w-100">
              <InputPageStep name="mandatory">
                <FormKitSchema :schema="datasetSchema[0]" />
              </InputPageStep>
              <InputPageStep name="advised">
                <FormKitSchema :schema="datasetSchema[1]" />
              </InputPageStep>
              <InputPageStep name="recommended">
                <FormKitSchema :schema="datasetSchema[2]" />
              </InputPageStep>
              <InputPageStep name="distribution">
                <!-- Auslagern -->
                <DistributionInputPage :schema=distributionSchema :values=formValues></DistributionInputPage>
              </InputPageStep>
              <InputPageStep name="overview">
                <!-- <DatasetOverview :values=formValues></DatasetOverview> -->
              </InputPageStep>
              <p class="p-1"> <b>*</b> mandatory</p>
              <div class="d-flex w-100 justify-content-between">
                <FormKit type="button" @click="goToPreviousStep">
                  <div class="d-flex flex-column align-items-start">
                    <small>{{ camel2title(previousStep) }}</small>
                    <span>{{ $t('message.dataupload.preview') }}</span>
                  </div>
                </FormKit>
                <FormKit type="button" @click="goToNextStep">
                  <div class="d-flex flex-column align-items-end">
                    <small>{{ camel2title(nextStep) }}</small>
                    <span>{{ $t('message.dataupload.next') }}</span>
                  </div>
                </FormKit>
                <FormKit type="button" @click="clearForm">Clear Form</FormKit>
                <FormKit type="submit" id="submit-form"></FormKit>
              </div>
            </div>
          </div>



        </FormKit>

      </div>
    </div>
    <!-- <div v-if="isDistributionOverview">
      <DistributionOverview :distributionOverviewPage="isDistributionOverview"></DistributionOverview>
    </div> -->
  </div>
</template>

<script>
/* eslint-disable no-alert,arrow-parens,no-param-reassign,no-lonely-if */
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import $ from 'jquery';
import {
  has,
  isNil,
  isArray,
} from 'lodash';
import { FormKitSummary } from '@formkit/vue';
import DistributionInputPage from './DistributionInputPage.vue';
import CustomInputs from './CustomInputs.vue';
import InputPageStep from '../components/InputPageStep.vue';
import { useDpiStepper } from '../composables/useDpiStepper';
import DatasetOverviewSchema from '../views/OverviewPage/DatasetOverviewSchema.vue'
import DatasetOverview from '../views/OverviewPage/DatasetOverview'
import axios from 'axios'

export default defineComponent({
  props: {
    property: {
      required: true,
      type: String,
    },
    page: {
      required: true,
      type: String,
    },
    id: {
      type: String,
    },
    isDistributionOverview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      stepNames: ['mandatory', 'advised', 'recommended', 'distribution', 'overview'],
      heightActiveSec: "10vh",
      datasetSchema: [],
      distributionSchema: [],
      formValues: {},
      failedFields: [],
      offsetTopStepper: "60px",
      info: {},
      catalogues: [],
      camel2title: (str) =>
        str
          .replace(/([A-Z])/g, (match) => ` ${match}`)
          .replace(/^./, (match) => match.toUpperCase())
          .trim(),
    };
  },
  components: {

    FormKitSummary,
    CustomInputs,
    InputPageStep,
    DistributionInputPage,
    DatasetOverviewSchema,
    DatasetOverview
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
      'setDeleteDistributionInline',
    ]),
    clearForm() {
      this.$formkit.reset('dpi')
    },
    handleStep(stepName) {
      this.step = stepName;

      if (stepName === "mandatory") {


        this.offsetTopStepper = "60px";
      }
      if (stepName === "advised") {

        this.offsetTopStepper = "150px";
      }
      if (stepName === "recommended") {

        this.offsetTopStepper = "240px";
      }
      if (stepName === "distribution") {

      }
      if (stepName === "overview") {
        this.offsetTopStepper = "60px";
      }
    },
    initInputPage() {
      if (this.page !== 'overview' && this.page !== 'distoverview') {
        this.addCatalogOptions({ property: this.property, catalogs: this.getUserCatalogIds });
        console.log(this.property);
        this.saveLocalstorageValues(this.property); // saves values from localStorage to vuex store
        const existingValues = this.$store.getters['dpiStore/getRawValues']({ property: this.property, page: this.page, id: this.id });
        // only overwrite empty object if there are values (otherwise the language preselection is gone)

        if (existingValues) {
          this.formValues = existingValues;
        }

        this.$nextTick(() => {
          $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
          });
        });
      }
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
    clear() {
      this.clearValues();
      this.clearAll();
      this.setIsEditMode(false);
    },
    clearValues() {
      this.formValues = {};
      this.failedFields = [];
    },
    handleSubmit() {
      this.$emit('go-to-next');
    },
    getFirstPath() {
      let firstStep;
      let path;

      if (this.property === 'distributions') {
        firstStep = this.getNavSteps.datasets[0];
        path = `${this.$env.content.dataProviderInterface.basePath}/datasets/${firstStep}?locale=${this.$i18n.locale}`;
      } else {
        firstStep = this.getNavSteps[this.property][0];
        path = `${this.$env.content.dataProviderInterface.basePath}/${this.property}/${firstStep}?locale=${this.$i18n.locale}`;
      }
      return path;
    },
    jumpToFirstPage() {
      this.$router.push(this.getFirstPath()).catch(() => { });
    },
    checkPathAllowed(to, from) {
      let allowedPaths = [
        `${this.$env.content.dataProviderInterface.basePath}/datasets/${this.getNavSteps.datasets[0]}`,
        `${this.$env.content.dataProviderInterface.basePath}/catalogues/${this.getNavSteps.catalogues[0]}`,
      ];
      return allowedPaths.filter(el => to.path.startsWith(el)).length > 0;
    },
  },
  created() {

    if (this.$route.query.edit === false) {
      this.clear();
    }
    // form content (schema) created based on defined page properties included in inputconfigMin
    // if (this.page !== 'overview' && this.page !== 'distoverview') {
    // this.createSchema({ property: this.property, page: this.page });
    // this.translateSchema({ property: this.property });
    // }
    for (let index = 1; index < this.stepNames.length; index++) {

      let steps = "step" + index;
      if (index === 4) {
        for (let distributionSteps = 1; distributionSteps < 5; distributionSteps++) {
          this.createSchema({ property: "distributions", page: "step" + distributionSteps });
          this.translateSchema({ property: "distributions" });
          this.distributionSchema.push(this.getSchema);
        }
      } else {
        this.createSchema({ property: this.property, page: steps });
      }

      // console.log(this.getSchema);
      this.translateSchema({ property: this.property });
      this.datasetSchema.push(this.getSchema);


      // else return
    }
  },
  mounted() {
    this.initInputPage();
    this.initCatalogues();
  },
  watch: {
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
        this.createSchema({ property: this.property, page: this.page });
        this.translateSchema({ property: this.property });
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    // Always clear storage when entering DPI
    next(vm => {
      if (from.name && !from.name.startsWith('DataProviderInterface')) {
        vm.clear();
        vm.jumpToFirstPage();
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    // Checks if next route within the DPI is a route
    if (to.query.clear !== 'true' && !this.checkPathAllowed(to, from)) {
      // for singular distribution: when deleteing from inline the mandatory check would return false leading to the display of the mandatory-modal
      // since the distribution is already deleted the mandatory check would alwaysreturn false so by determining if an inline delete happens 
      // (by checking getDeleteDistributionInline) we skip the display of the modal and grant redirect 
      if (this.property === 'distributions' && this.getDeleteDistributionInline) {
        this.setDeleteDistributionInline(false)
        next();
      }
    } else {
      // if there are multiple distributions, the mandatory checker might return true so we don't have to skip the modal display
      // but we have to set the deleteDistributionInline value to false again
      this.setDeleteDistributionInline(false)
      next();
    }
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

    const checkStepValidity = (stepName) => {
      return (steps[stepName].errorCount > 0 || steps[stepName].blockingCount > 0) && visitedSteps.value.includes(stepName)
    }

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
