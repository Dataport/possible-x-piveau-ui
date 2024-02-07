
<template>
  <div class="form-container ">
    <slot></slot>
    <details>{{ formValues }}</details>
    <div class="inputContainer" v-if="isInput">
      <div class="formContainer formkit position-relative">

        <FormKit type="form" v-model.lazy="formValues" :actions="false" @submit="handleSubmit" :plugins="[stepPlugin]"
          @change="saveFormValues({ property: property, page: page, distid: id, values: formValues })" class="d-flex">

          <div class="d-flex">
            <ul class="steps">
              <li v-for="(stepName, index) in getNavSteps[property]" :key="index" 
                class="step" :data-step-active="activeStep === stepName" 
                :class="{ 
                  activeItem: activeStep === stepName, 
                  inactiveStep: stepName != activeStep,
                  'has-errors': checkStepValidity(stepName),
                }" 
                @click="activeStep = stepName">


                <div class="stepBubbleWrap">
                  <div class="circle stepCircle">{{ index + 1 }}</div>
                  <span v-if="checkStepValidity(stepName)" class="step--errors"/>
                    <!-- v-text="step.errorCount + step.blockingCount" /> -->
                  {{ camel2title(stepName) }}
                </div>
                <div v-if="index + 1 != Object.keys(steps).length" class="seperatorHorizontalStepper"></div>
                <div v-if="activeStep === 'overview'" class="seperatorHorizontalStepper"></div>
              </li>

              <li class="step inactiveStep" v-if="activeStep === 'overview'">
                <div class="circle stepCircle"></div>

              </li>

            </ul>

            <div class="d-flex flex-column w-100">
              <div v-for="(stepName, index) in getNavSteps[property]" :key="index">
                <InputPageStep :name="stepName">
                  <!-- <PropertyChooser></PropertyChooser> -->
                  <FormKitSchema v-if="stepName !== 'distributions'" :schema="datasetSchema[stepName]"/>
                  <DistributionInputPage v-else :schema="distributionSchema" :values="formValues"/>
                  <p class="p-1"> <b>*</b> mandatory</p>
                </InputPageStep>
              </div>
            </div>
          </div>

        </FormKit>

      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-alert,arrow-parens,no-param-reassign,no-lonely-if */
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import $ from 'jquery';
import PropertyChooser from './PropertyChooser.vue'
import {
  has,
  isNil,
  isArray,
} from 'lodash';
import DistributionInputPage from './DistributionInputPage.vue';
import InputPageStep from '../components/InputPageStep.vue';
import { useDpiStepper } from '../composables/useDpiStepper';

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
      datasetSchema: {},
      distributionSchema: {},
      formValues: {},
      offsetTopStepper: "60px",
      info: {},
      catalogues: [],
      byte: true,
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
    getFirstTitleFromForm() {
      return has(this.formValues, 'dct:title')
        && this.formValues['dct:title'].length > 0
        && has(this.formValues['dct:title'][0], '@value')
        && !isNil(this.formValues['dct:title'][0], '@value')
        ? this.formValues['dct:title'][0]['@value']
        : '';
    },
    createIDFromTitle() {
      const title = this.getFirstTitleFromForm;
      if (title != undefined) {
        return title
          .toLowerCase()
          .replace(/ /g, '-');
      }
      else return;
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
    // handleStep(stepName) {
    //   this.step = stepName;

    //   if (stepName === "mandatory") {
    //     this.offsetTopStepper = "60px";
    //   }
    //   if (stepName === "advised") {

    //     this.offsetTopStepper = "150px";
    //   }
    //   if (stepName === "recommended") {

    //     this.offsetTopStepper = "240px";
    //   }
    //   if (stepName === "distribution") {

    //   }
    //   if (stepName === "overview") {
    //     this.offsetTopStepper = "60px";
    //   }
    // },
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
    async initCatalogues() {
      await axios
        .get(this.$env.api.baseUrl + 'search?filter=catalogue&limit=100')
        .then(response => (this.info = response))
      this.info.data.result.results.forEach((e) => {
        console.log(this.info, this.catalogues);
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
            console.log(this.getUserCatalogIds[i]);
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
      return `${this.$env.content.dataProviderInterface.basePath}/${this.property}?locale=${this.$i18n.locale}`;
    },
    jumpToFirstPage() {
      this.$router.push(this.getFirstPath()).catch(() => { });
    },
    checkPathAllowed(to, from) {
      let allowedPaths = [
        `${this.$env.content.dataProviderInterface.basePath}/datasets/`,
        `${this.$env.content.dataProviderInterface.basePath}/catalogues/`,
      ];
      return allowedPaths.filter(el => to.path.startsWith(el)).length > 0;
    },
    createDatasetID() {
      if ((this.property === 'datasets' || this.property === 'catalogues') && this.page === this.getNavSteps[this.property][0]) {
        // Create Dataset ID from title if not existing
        if (has(this.formValues, 'dct:title')
          && !isNil(this.formValues['dct:title']
            && this.formValues['dct:title'].length > 0)
          && has(this.formValues['dct:title'][0], '@value')
          && !isNil(this.formValues['dct:title'][0], '@value')
          && (!has(this.formValues, 'datasetID')
            || (has(this.formValues, 'datasetID') && this.createIDFromTitle.startsWith(this.formValues.datasetID))
            || (has(this.formValues, 'datasetID') && this.formValues.datasetID.startsWith(this.createIDFromTitle)))) {
          this.formValues.datasetID = this.createIDFromTitle;
        }

        if (has(this.formValues, 'dct:title')
          && isArray(this.formValues['dct:title'])
          && !isNil(this.formValues['dct:title']
            && this.formValues['dct:title'].length > 0)
          && has(this.formValues['dct:title'][0], '@value')
          && isNil(this.formValues['dct:title'][0], '@value')
          && has(this.formValues, 'datasetID')) this.formValues.datasetID = '';
      }
    },
  },
  created() {

    if (this.$route.query.edit === false) {
      this.clear();
    }

    // create schema for datasets or catalogues
    for (let index = 0; index < this.getNavSteps[this.property].length; index++) {
      this.createSchema({ property: this.property, page: this.getNavSteps[this.property][index] });
      this.translateSchema({ property: this.property });
      this.datasetSchema[this.getNavSteps[this.property][index]] = this.getSchema;
    }

    // for datasets also create schema for distributions
    if (this.property === 'datasets') {
      for (let index = 0; index < this.getNavSteps['distributions'].length; index++) {
        this.createSchema({property: 'distributions', page: this.getNavSteps['distributions'][index] });
        this.translateSchema({property: 'distributions'});
        this.distributionSchema[this.getNavSteps['distributions'][index]] = this.getSchema;
      }
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
