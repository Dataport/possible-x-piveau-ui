<template>
  <div class="d-flex flex-column bg-transparent container-fluid justify-content-between mt-n5" :key="property">
    <!-- TOP -->
    <div>
      <h1 class="small-headline">{{ mode }}</h1>
      <Navigation
        :isOverviewPage="isOverviewPage"
        :steps="steps"
        :currentStep="currentStep"
        :currentSubroutingStep="currentSubroutingStep"
        @previous="previous"
        @next="next"
        @newSubrouting="newSubrouting"
        @clearStorage="clearStorage">
      </Navigation>
      <StepProgress
        id="stepper"
        :line-thickness="1"
        :steps="stepNames"
        :current-step="currentStep"
        active-color="#001d85"
        :active-thickness="20"
        :passive-thickness="20">
      </StepProgress>
    </div>
    <!-- CONTENT -->
    <router-view @error="jumpToFirstPage" :currentSubroutingStep="currentSubroutingStep" ref="view">
      <div id="subStepperBox">
        <StepProgress
          id="subStepper"
          v-if="showSubroutingStepper"
          :steps="subroutingStepNames"
          :current-step="currentSubroutingStep"
          active-color="#343434"
          :line-thickness="1"
          :active-thickness="20"
          :passive-thickness="20">
        </StepProgress>
      </div>
    </router-view>
    <!-- BOTTOM -->
    <div>
      <Navigation
        v-if="!isOverviewPage && !isDistributionsOverviewPage"
        :steps="steps" :currentStep="currentStep"
        :currentSubroutingStep="currentSubroutingStep"
        @previous="previous"
        @next="next"
        @newSubrouting="newSubrouting"
        @clearStorage="clearStorage">
      </Navigation>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-nested-ternary, no-lonely-if, no-param-reassign */
import { mapGetters } from 'vuex';
import StepProgress from 'vue-step-progress';
import 'vue-step-progress/dist/main.css';
import { has } from 'lodash';
import Navigation from './components/Navigation';

export default {
  name: 'DataProviderInterface',
  dependencies: [],
  components: {
    StepProgress,
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
      input: this.$env.upload.input,
      currentStep: 0,
      currentSubroutingStep: 0,
    };
  },
  computed: {
    ...mapGetters('auth', ['getIsEditMode']),
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
    isDistributionsOverviewPage() {
      return this.currentSubroutingStep >= 3;
    },
    steps() {
      return has(this.input, this.property) && has(this.input[this.property], 'steps')
        ? this.input[this.property].steps
        : [];
    },
    stepsAndOverview() {
      return this.steps.concat({
        path: 'overview',
        subrouting: false,
      });
    },
    stepNames() {
      return this.steps.map(s => this.$t(`message.dataupload.${this.property}.stepper.${s.path}.name`)).concat(this.$t(`message.dataupload.${this.property}.stepper.overview`));
    },
    subroutingStepNames() {
      return this.steps[this.currentStep].children.map(s => this.$t(`message.dataupload.${this.property}.stepper.${this.steps[this.currentStep].path}.children.${s}.name`));
    },
    showSubroutingStepper() {
      return !this.isOverviewPage && this.steps[this.currentStep] && this.steps[this.currentStep].subrouting && this.steps[this.currentStep].children;
    },
  },
  methods: {
    clearStorage() {
      // Reset steps
      this.currentStep = 0;
      this.currentSubroutingStep = 0;

      // Clear storage
      localStorage.setItem('currentDistribution', JSON.stringify(1));
      localStorage.setItem('numberOfDistributions', JSON.stringify(1));
      const localKeys = Object.keys(localStorage);
      for (let keyIndex = 0; keyIndex < localKeys.length; keyIndex += 1) {
        const key = localKeys[keyIndex];
        if (key.startsWith('inputValues') || key.startsWith('dpi_additional')) {
          localStorage.removeItem(key);
        }
      }

      // Jump to first page
      if (this.getFirstPath() !== this.$route.fullPath) this.$router.push(this.getFirstPath());
      else {
        // TODO: Make Vue Formulate Reset functions work
        // this.$formulate.reset('form');
        // this.$formulate.resetValidation('form');
        // this.$refs.view.clearStorage();
        // document.getElementById('datasetIDForm').value = ''; // TODO: Clear the datasetID
        this.$router.go(); // Hacky solution which accepts a reload to solve the datasetID and preselected languages bug
      }
    },
    newSubrouting() {
      const currentDistribution = JSON.parse(localStorage.getItem('currentDistribution'));
      const numberOfDistributions = JSON.parse(localStorage.getItem('numberOfDistributions'));
      localStorage.setItem('currentDistribution', JSON.stringify(currentDistribution + 1));
      localStorage.setItem('numberOfDistributions', JSON.stringify(numberOfDistributions + 1));

      this.currentSubroutingStep = 0;
      const firstDistRoute = this.steps[this.currentStep].children[this.currentSubroutingStep];
      this.$router.push(`${this.$env.upload.basePath}/${this.$route.params.property}/${this.steps[this.currentStep].path}/${firstDistRoute}?locale=${this.$i18n.locale}`);

      window.scrollTo(0, 0);
    },
    previous(previousStep, subrouting) {
      if (!subrouting) {
        this.currentStep = previousStep === -1
          ? 0
          : previousStep;
        if (this.steps[previousStep].subrouting) {
          this.$router.push(this.getPreviousPath(this.currentStep, 0));
        } else {
          this.$router.push(this.getPreviousPath(this.currentStep));
        }
      } else if (previousStep === -1) {
        this.currentStep = this.currentStep > 0
          ? this.currentStep - 1
          : 0;
        this.currentSubroutingStep = 0;
        this.$router.push(this.getPreviousPath(this.currentStep, undefined)).catch(error => { console.log(error); });
      } else {
        this.currentSubroutingStep = previousStep;
        this.$router.push(this.getPreviousPath(this.currentStep, this.currentSubroutingStep)).catch(error => { console.log(error); });
      }

      window.scrollTo(0, 0);
    },
    getPreviousPath(previousStep, previousSubroutingStep) {
      let path;
      if (previousSubroutingStep !== undefined) {
        path = `${this.$env.upload.basePath}/${this.property}/${this.steps[previousStep].path}/${this.steps[previousStep].children[previousSubroutingStep]}?locale=${this.$i18n.locale}`;
      } else {
        path = `${this.$env.upload.basePath}/${this.property}/${this.steps[previousStep].path}?locale=${this.$i18n.locale}`;
      }
      return path;
    },
    next(nextStep, subrouting) {
      if (subrouting) {
        if (nextStep === this.steps[this.currentStep].children.length) {
          this.$router.push(`${this.$env.upload.basePath}/${this.property}/overview?locale=${this.$i18n.locale}`);
        } else {
          this.currentSubroutingStep = nextStep;
          this.$router.push(this.getNextPath(this.currentStep, this.currentSubroutingStep)).catch(error => { console.log(error); });
        }
      } else {
        if (nextStep === this.steps.length) {
          this.$router.push(`${this.$env.upload.basePath}/${this.property}/overview?locale=${this.$i18n.locale}`);
        } else {
          this.currentStep = nextStep;
          if (this.currentStep === -1) {
            this.$router.push(this.getNextPath(this.currentStep, undefined)).catch(error => { console.log(error); });
          } else if (this.steps[this.currentStep].subrouting) {
            this.$router.push(this.getNextPath(this.currentStep, 0)).catch(error => { console.log(error); });
          } else {
            this.$router.push(this.getNextPath(this.currentStep, undefined)).catch(error => { console.log(error); });
          }
        }
      }

      window.scrollTo(0, 0);
    },
    getNextPath(nextStep, nextSubroutingStep) {
      if (nextStep === -1) return `/datasets?locale=${this.$i18n.locale}`;
      if (nextSubroutingStep !== undefined) return `${this.$env.upload.basePath}/${this.property}/${this.steps[nextStep].path}/${this.steps[nextStep].children[nextSubroutingStep]}?locale=${this.$i18n.locale}`;
      if (nextStep === this.steps.length) return `${this.$env.upload.basePath}/${this.property}/overview?locale=${this.$i18n.locale}`;
      return `${this.$env.upload.basePath}/${this.property}/${this.steps[nextStep].path}?locale=${this.$i18n.locale}`;
    },
    getFirstPath() {
      return this.steps[0]
        ? `${this.$env.upload.basePath}/${this.property}/${this.steps[0].path}?locale=${this.$i18n.locale}`
        : '';
    },
    jumpToFirstPage() {
      this.$router.push(this.getFirstPath);
    },
    setCurrentStep() {
      // Set current step and sub step if page was reloaded
      this.currentStep = this.isOverviewPage
        ? this.steps.length
        : this.steps.map(s => s.path).findIndex(p => p === this.page);
      this.currentSubroutingStep = this.isOverviewPage
        ? 0
        : (this.steps[this.currentStep].subrouting
          ? this.steps[this.currentStep].children.findIndex(p => p === this.id)
          : 0);
    },
    addStepperLinks() {
      // Direct stepper access - hacky solution
      document.querySelectorAll('#stepper .step-progress__step-label').forEach((s, i) => {
        s.onclick = () => this.$router.push(`${this.$env.upload.basePath}/${this.property}/${this.stepsAndOverview[i].path}${i === 2 ? `/${this.steps[i].children[0]}` : ''}?locale=${this.$i18n.locale}`);
      });
      document.querySelectorAll('#subStepper .step-progress__step-label').forEach((s, i) => {
        s.onclick = () => this.$router.push(`${this.$env.upload.basePath}/${this.property}/${this.steps[2].path}/${this.steps[2].children[i]}?locale=${this.$i18n.locale}`);
      });
    },
  },
  created() {
    this.setCurrentStep();
  },
  mounted() {
    this.addStepperLinks();
    this.$root.$on('newSubrouting', () => this.newSubrouting());
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
</style>
