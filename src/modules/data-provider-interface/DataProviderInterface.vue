<template>
  <div class="d-flex flex-column bg-transparent container-fluid justify-content-between dpi" :key="property">
    <!-- TOP -->
    <div>
      <h1 class="small-headline">{{ mode }}</h1>
      <Navigation @clearStorage="clearStorageAndValues"></Navigation>

      <!-- if current form is distribution form the main stepper for datasets should be shown also-->
      <StepProgress
        id="stepper"
        v-if="property !== 'distributions'"
        :line-thickness="1"
        :steps="stepNames"
        :current-step="getCurrentStep"
        active-color="#001d85"
        :active-thickness="20"
        :passive-thickness="20">
      </StepProgress>

      <StepProgress
        id="subStepper"
        v-if="property === 'distributions'"
        :line-thickness="1"
        :steps="datasetStepNames"
        :current-step="steps.datasets.length"
        active-color="#001d85"
        :active-thickness="20"
        :passive-thickness="20">
      </StepProgress>
    </div>
    <!-- CONTENT -->
    <router-view :isDistributionOverview="isDistributionOverview" ref="view" :key="$route.query.edit">
      <div id="subStepperBox">
        <StepProgress
          id="stepper"
          v-if="showDatasetStepper"
          :steps="stepNames"
          :current-step="getCurrentStep"
          active-color="#343434"
          :line-thickness="1"
          :active-thickness="20"
          :passive-thickness="20">
        </StepProgress>
      </div>
    </router-view>
    <!-- BOTTOM -->
    <div>
      <Navigation @clearStorage="clearStorageAndValues"></Navigation>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-nested-ternary, no-lonely-if, no-param-reassign */
import { mapActions, mapGetters } from 'vuex';
import StepProgress from 'vue-step-progress/dist/vue-step-progress.min.js';
import 'vue-step-progress/dist/main.css';
import Navigation from './components/Navigation';

console.log('stepprogress = ', StepProgress);

export default {
  name: 'DataProviderInterface',
  dependencies: [],
  components: {
    StepProgress: StepProgress.default || StepProgress,
    Navigation,
  },
  props: ['name'],
  metaInfo() {
    return {
      title: `${this.$t('message.metadata.upload')} | ${this.$t('message.header.navigation.data.datasets')}`,
      meta: [
        { name: 'description', vmid: 'description', content: `${this.$t('message.header.navigation.data.datasets')}} - data.europa.eu` },
        { name: 'keywords', vmid: 'keywords', content: `${this.$env.keywords} ${this.$t('message.header.navigation.data.datasets')}}` },
        { name: 'robots', content: 'noindex, follow' },
      ],
    };
  },
  data() {
    return {
      property: this.$route.params.property,
      page: this.$route.params.page,
      id: this.$route.params.id,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getIsEditMode',
    ]),
    ...mapGetters('dpiStore', [
      'getNavSteps',
    ]),
    steps(){
      return this.getNavSteps;
    },
    mode() {
      return this.property === 'catalogues'
        ? this.getIsEditMode
          ? 'Edit Catalogue'
          : 'Create a new Catalogue'
        : this.property === 'datasets'
          ? this.getIsEditMode
            ? 'Edit Dataset'
            : 'Create a new Dataset'
          : '';
    },
    isOverviewPage() {
      return this.$route.name === 'DataProviderInterface-Overview';
    },
    isDistributionOverview() {
      return this.page === 'distoverview';
    },
    stepNames() {
      return this.getTranslatedStepNamesByProperty(this.property);
    },
    getCurrentStep(){
      // for some reason overview is not set as page property so must be read from path
      if (this.$route.path.includes('/overview')) {
        return this.steps[this.property].indexOf('overview');
      } else {
        return this.steps[this.property].indexOf(this.page);
      }
    },
    datasetStepNames() {
      return this.getTranslatedStepNamesByProperty('datasets');
    },
    showDatasetStepper() {
      return this.property === 'distributions';
    },
  },
  methods: {
    ...mapActions('dpiStore', [
      'saveExistingJsonld',
    ]),
    ...mapActions('auth', [
      'populateDraftAndEdit',
    ]),
    getTranslatedStepNamesByProperty(property) {
      const names = this.steps[property].map(s => this.$t(`message.dataupload.${property}.stepper.${s}.name`));
      if (property !== 'distributions') {
        // use correct translation for overview page
        const overviewIndex = names.length - 1;
        names[overviewIndex] = this.$t(`message.dataupload.${property}.stepper.overview`);
      }
      return names;
    },
    clearStorageAndValues() {
      // Clear storage
      // 1. Clear form values
      // 2. Clear store values
      // 3, Clear local storage
      this.$refs.view.clear();

      // Jump to first page and compare path start because of possible query params
      if (!this.getClearPath().startsWith(this.$route.path)) {
        this.jumpToFirstPage();
      } else {
        // Hacky solution which accepts a reload to solve the datasetID and preselected languages bug
        // --> Should be replaced if built-in functionality works
        // this.$formulate.resetValidation('form');
        this.$router.go();
      }
    },
    getClearPath() {
      // Create path to first page with clear query param
      let firstStep;
      let path;

      if (this.property === 'distributions') {
        firstStep = this.getNavSteps.datasets[0];
        path = `${this.$env.upload.basePath}/datasets/${firstStep}?locale=${this.$i18n.locale}&clear=true`;
      } else {
        firstStep = this.getNavSteps[this.property][0];
        path = `${this.$env.upload.basePath}/${this.property}/${firstStep}?locale=${this.$i18n.locale}&clear=true`;
      }
      return path;
    },
    jumpToFirstPage() {
      this.$router.push(this.getClearPath()).catch(() => {});
    },
    addStepperLinks() {
      // Direct stepper access - hacky solution
      document.querySelectorAll('#stepper .step-progress__step-label').forEach((s, i) => {

        if (this.getNavSteps[this.property][i] === 'overview') {
          // only datasets and catalogues have an overview page
          s.onclick = () => this.$router.push(`${this.$env.upload.basePath}/${this.property}/overview?locale=${this.$i18n.locale}`).catch(() => {});
        } else if (this.getNavSteps[this.property][i] === 'distoverview') {
          // only datasets and distributions have a distoverview page
          if (this.property === 'datasets') {
            s.onclick = () => this.$router.push(`${this.$env.upload.basePath}/datasets/distoverview?locale=${this.$i18n.locale}`).catch(() => {});
          } else if (this.property === 'distributions') {
            // distribution overview page should have distribution index for back navigation to distirbutions
            s.onclick = () => this.$router.push(`${this.$env.upload.basePath}/${this.property}/distoverview/${this.id}?locale=${this.$i18n.locale}`).catch(() => {});
          }
        } else {
          if (this.property === 'distributions') {
            // id of distribution needed within navigation
            s.onclick = () => this.$router.push(`${this.$env.upload.basePath}/${this.property}/${this.getNavSteps[this.property][i]}/${this.id}?locale=${this.$i18n.locale}`).catch(() => {});
          } else {
            s.onclick = () => this.$router.push(`${this.$env.upload.basePath}/${this.property}/${this.getNavSteps[this.property][i]}?locale=${this.$i18n.locale}`).catch(() => {});
          }
        }
      });
      // stepper links for dataset stepper when distribution form is currently on display
      document.querySelectorAll('#subStepper .step-progress__step-label').forEach((s, i) => {
        s.onclick = () => this.$router.push(`${this.$env.upload.basePath}/datasets/${this.getNavSteps['datasets'][i]}?locale=${this.$i18n.locale}`).catch(() => {});
      });
    },
  },
  created() {
    this.populateDraftAndEdit();
  },
  mounted() {
    this.addStepperLinks();
    this.saveExistingJsonld(this.property);
  },
};
</script>

<style lang="scss">
#input {
  padding: 10px;
}

.small-headline {
  font-size: 1.5rem;
}

.property {
  margin: 20px;
  background-color: #ffffff;
  border: solid 0.5px rgb(225, 225, 225);
  margin-top: 30px;
}

.infoBox .material-icons {
  font-size: 20px;
  vertical-align: text-bottom;
  margin-right: 5px;
  margin-bottom: 1px;
}

.infoBox {
  width: 100%;
  height: 30%;
  background-color: #f7f7f7;
  padding: 5%;
  border-radius: 0.25rem;
  margin-top: 20px;

  .input_subpage_nav {
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    padding: 15px;
  }
}

.besides {
  .formulate-input-group-repeatable {
      display:flex;
      flex-direction: row;
      background-color: transparent;
      padding: 0px;
  }
}

.main {
  width: 75%;
  margin: 0 5px 0 5px;
}

.sub {
  width: 20%;
  margin: 0 5px 0 5px;
}

#subStepperBox {
  width: 80%;
  margin: 0 auto;
}

// Stepper Customizing -------------

#stepper, #subStepper {
  .step-progress__step {
    border: solid white 20px;
  }

  .step-progress__step  span {
    color: #fff ;
  }
  .step-progress__step--active  .step-progress__step-label {
    color: rgb(31, 31, 31) ;
  }

  .step-progress__step-icon {
  font-size: 25px;
  }
}

// Input Form Margins & Borders ----

.formulate-input[data-classification=group] [data-is-repeatable] {
  border: none ;
  padding: 1em 1em 1em 0em ;
}

.formulate-input[data-classification=group] [data-is-repeatable] .formulate-input-group-repeatable {
  border-bottom: none;
}

.formulate-input-element--checkbox {
  margin-right: 5px;
}

.formulate-input-wrapper {
  font-family: "Ubuntu";
}

.formulate-input[data-classification=button] button[data-ghost] {
    font-weight: 400;
}

.formulate-input-error {
  color: #e13737 !important;
  font-weight: 400 !important;
}

// General Formulate Styling ----

.formulate {
  &-input {
    .formulate {
      &-input {
        &-element {
          max-width: 100%;
        }
        &-error {
          font-weight: bold;
        }
      }
    }
  }

  .formulate-input-group-add-more {
    display: flex;
    justify-content: flex-end;
    button {
      border: black;
    }
  }

  .formulate-input {
    &[data-classification="text"] .formulate-input-wrapper {
    display: flex;
    flex-direction: column;
    }
    &[data-classification="select"] .formulate-input-wrapper {
    display: flex;
    flex-direction: column;
    }
  }

  .formulate-input[data-classification="button"] {
    button {
      &[data-ghost] {
        color: white;
        background-color: #001d85;
        border-color: #001d85;
        border-radius: 1.875rem;
        &:hover {
          background-color: #196fd2;
          border-color: #196fd2;
        }
      }
    }
  }
}

.formulate-input.besides {
   border-bottom: 1px solid lightgrey !important;
}

.formulate-input-label {
  font-weight: 500 !important;
}

.formulate-input-element {
  display: inline-block !important;
  &--textarea {
    width: 100%;
  }
}

.formulate-input-element--group {
  display: block !important;
}

.formulate-input.besides > .formulate-input-wrapper > .formulate-input-label {
  font-size: 110% !important;
  font-weight: 600 !important;
  text-decoration: underline !important;
}

#stepper, #subStepper {
  .step-progress__step span{
    font-size: 30px;
    font-weight: bold;
  }
  .step-progress__step::after{
    height: 40px;
    width: 40px;
  }

  .step-progress__step-label {
    cursor: pointer;
  }
}
</style>
