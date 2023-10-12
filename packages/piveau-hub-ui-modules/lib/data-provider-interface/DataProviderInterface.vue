<template>
  <div class="d-flex flex-column bg-transparent container-fluid justify-content-between dpi" :key="property">
    <!-- TOP -->
    <div id="stepperAnchor" class="stickyStepper">
      <div class="SSfirstRow">
        <h1 class="small-headline ml-1 my-0">{{ mode }}</h1>
        <Navigation @clearStorage="clearStorageAndValues" :nextStep="nextStep" class="w-100 stickyNav"></Navigation>

      </div>

      <!-- if current form is distribution form the main stepper for datasets should be shown also-->
      <StepProgress id="stepper" v-if="property !== 'distributions'" :line-thickness="1" :steps="stepNames"
        :current-step="getCurrentStep" active-color="#001d85" :active-thickness="20" :passive-thickness="20">
      </StepProgress>

      <StepProgress id="subStepper" v-if="property === 'distributions'" :line-thickness="1" :steps="datasetStepNames"
        :current-step="3" active-color="#001d85" :active-thickness="20" :passive-thickness="20">
      </StepProgress>
    </div>
    <!-- CONTENT -->
    <router-view @goToNext="goToNext" :isDistributionOverview="isDistributionOverview" ref="view" :key="$route.query.edit">
      <div id="subStepperBox">
        <div id="blur" class="position-absolute w-100 h-100"></div>
        <StepProgress id="stepper" v-if="showDatasetStepper" :steps="stepNames" :current-step="getCurrentStep"
          active-color="#343434" :line-thickness="1" :active-thickness="20" :passive-thickness="20">
        </StepProgress>
      </div>
    </router-view>
    <!-- BOTTOM -->
    <!-- <div>
      <Navigation @clearStorage="clearStorageAndValues"></Navigation>
    </div> -->
  </div>
</template>

<script>
/* eslint-disable no-nested-ternary, no-lonely-if, no-param-reassign */
import { mapActions, mapGetters } from 'vuex';
import Navigation from './components/Navigation';
import StepProgress from 'vue-step-progress';
import 'vue-step-progress/dist/main.css';

export default {
  name: 'DataProviderInterface',
  components: {
    StepProgress: StepProgress.default || StepProgress,
    Navigation,
  },
  props: ['name'],
  metaInfo() {
    return {
      title: `${this.$t('message.metadata.upload')} | ${this.$t('message.header.navigation.data.datasets')}`,
      meta: [
        { name: 'description', vmid: 'description', content: `${this.$t('message.datasets.meta.description')}` },
        { name: 'keywords', vmid: 'keywords', content: `${this.$env.metadata.keywords} ${this.$t('message.datasets.meta.description')}}` },
        { name: 'robots', content: 'noindex, follow' },
      ],
    };
  },
  data() {
    return {
      property: this.$route.params.property,
      page: this.$route.params.page,
      id: this.$route.params.id,
      nextStep: null,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getIsEditMode',
    ]),
    ...mapGetters('dpiStore', [
      'getNavSteps',
    ]),
    steps() {
      return this.getNavSteps;
    },
    mode() {
      return this.property === 'catalogues'
        ? this.getIsEditMode
          ? this.$t('message.dataupload.menu.editCatalogue')
          : this.$t('message.dataupload.createNewCatalogue')
        : this.property === 'datasets'
          ? this.getIsEditMode
            ? this.$t('message.dataupload.menu.editDataset')
            : this.$t('message.dataupload.createNewDataset')
          : 'Edit Distribution';
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
    getCurrentStep() {
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
      'saveLocalstorageValues',
    ]),
    ...mapActions('auth', [
      'populateDraftAndEdit',
    ]),
    goToNext() {
      this.next = this.getCurrentStep();
    },
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
        this.$router.go();
      }
    },
    getClearPath() {
      // Create path to first page with clear query param
      let firstStep;
      let path;

      if (this.property === 'distributions') {
        firstStep = this.getNavSteps.datasets[0];
        path = `${this.$env.content.dataProviderInterface.basePath}/datasets/${firstStep}?locale=${this.$i18n.locale}&clear=true`;
      } else {
        firstStep = this.getNavSteps[this.property][0];
        path = `${this.$env.content.dataProviderInterface.basePath}/${this.property}/${firstStep}?locale=${this.$i18n.locale}&clear=true`;
      }
      return path;
    },
    jumpToFirstPage() {
      this.$router.push(this.getClearPath()).catch(() => { });
    },
    addStepperLinks() {
      // Direct stepper access - hacky solution
      document.querySelectorAll('#stepper .step-progress__step-label').forEach((s, i) => {

        if (this.getNavSteps[this.property][i] === 'overview') {
          // only datasets and catalogues have an overview page
          s.onclick = () => this.$router.push(`${this.$env.content.dataProviderInterface.basePath}/${this.property}/overview?locale=${this.$i18n.locale}`).catch(() => { });
        } else if (this.getNavSteps[this.property][i] === 'distoverview') {
          // only datasets and distributions have a distoverview page
          if (this.property === 'datasets') {
            s.onclick = () => this.$router.push(`${this.$env.content.dataProviderInterface.basePath}/datasets/distoverview?locale=${this.$i18n.locale}`).catch(() => { });
          } else if (this.property === 'distributions') {
            // distribution overview page should have distribution index for back navigation to distirbutions
            s.onclick = () => this.$router.push(`${this.$env.content.dataProviderInterface.basePath}/${this.property}/distoverview/${this.id}?locale=${this.$i18n.locale}`).catch(() => { });
          }
        } else {
          if (this.property === 'distributions') {
            // id of distribution needed within navigation
            s.onclick = () => this.$router.push(`${this.$env.content.dataProviderInterface.basePath}/${this.property}/${this.getNavSteps[this.property][i]}/${this.id}?locale=${this.$i18n.locale}`).catch(() => { });
          } else {
            s.onclick = () => this.$router.push(`${this.$env.content.dataProviderInterface.basePath}/${this.property}/${this.getNavSteps[this.property][i]}?locale=${this.$i18n.locale}`).catch(() => { });
          }
        }
      });
      // stepper links for dataset stepper when distribution form is currently on display
      document.querySelectorAll('#subStepper .step-progress__step-label').forEach((s, i) => {
        s.onclick = () => this.$router.push(`${this.$env.content.dataProviderInterface.basePath}/datasets/${this.getNavSteps['datasets'][i]}?locale=${this.$i18n.locale}`).catch(() => { });
      });
    },
    handleScroll() {
      try {
        if (document.getElementById("stepperAnchor").offsetTop >= 35) {
          document.getElementById("stepperAnchor").classList.add("border-bottom-lightgray");
        }
        else {
          document.getElementById("stepperAnchor").classList.remove("border-bottom-lightgray");
        }
      } catch (error) {
      }
    }

  },
  created() {
    window.addEventListener('scroll', this.handleScroll);
    this.populateDraftAndEdit();
  },
  mounted() {
    this.addStepperLinks();
    this.saveLocalstorageValues(this.property);
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style lang="scss">
.border-bottom-lightgray {
  border-bottom: 1px solid lightgray;
}

#blur {
  left: 0;
  top: 0;
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.1);
}

.stickyStepper {
  position: sticky;
  top: 0;
  background: #ffffff;
  z-index: 10;
}

.stickyStepper .SSfirstRow {
  margin: 1vh 0;
  display: flex;
  align-items: center;
}

.stickyStepper .stickyNav {
  border-left: 1px solid black;
  margin-left: 1vh;
  padding-left: 1vh;
}

#stepper {
  width: 100% !important;
}

#input {
  padding: 10px;
}

.small-headline {
  font-size: 1.5rem;
  min-width: max-content;
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
    justify-content: space-between;
    padding: 15px;
  }
}

.besides {
  .formkit-input-group-repeatable {
    display: flex;
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
  position: sticky;
  top: 154px;
  z-index: 10;
  width: 100%;
  padding: 0 10%;

  .step-progress__bar {
    border-top: none !important;
  }

  .step-progress__step--active {
    .step-progress__step-label {
      background-color: lightsteelblue !important;
    }

  }
}

.step-progress__step span{
  
    color:white !important;
  
}
// Stepper Customizing -------------

// #stepper,
// #subStepper {
//   .step-progress__step {
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     height: 70%;
//     width: 20%;
//     display: flex;
//     align-items: center;
//     z-index: 1;


//     span {
//       color: grey;
//       font-size: 18px;
//       display: none;
//     }

//     div {
//       padding: 1rem;
//       height: 100%;
//       display: flex;
//       align-items: center;
//       color: white;
//       font-weight: 300;

//     }

//     .step-progress__step-label {

//       background: lightgrey;
//       background-size: 400% 400%;
//       background-position: 100% 0%;
//       transition: all 300ms ease-in-out;
//       border-right: 1px white solid;
//       font-size: 14px;
//       display: flex;
//       align-items: center;
//       justify-content: center;


//     }


//     .step-progress__step-label:hover {
//       background-position: 65% 0%;
//       color: black;

//     }

//   }

//   .step-progress__step--active {

//     z-index: 7 !important;


//     span {
//       color: black;
//     }

//     div {
//       background: white;
//     }

//     .step-progress__step-label {
//       background: rgb(236, 236, 236);
//       background-position: 50% 0%;
//       box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) !important;
//       transform: scale(1.1);
//       z-index: 8;
//       font-size: 16px;
//     }

//   }

//   .step-progress__step--valid {
//     div {
//       color: white;

//     }

//     .step-progress__step-label {
//       background: rgba(0, 235, 0, 0.2);
//       color: lightslategrey;


//     }

//     .step-progress__step-label:hover {
//       color: black;
//     }
//   }

//   .step-progress__step--active .step-progress__step-label {
//     color: rgb(31, 31, 31);
//   }

//   .step-progress__wrapper-after {
//     display: none;
//   }

//   .step-progress__step-icon {
//     display: none !important;
//   }

//   .step-progress__bar {
//     margin: 0;
//     height: 5rem;
//     border-top: 1px solid lightslategray;

//   }

//   .step-progress__step-label {
//     position: unset;
//     transform: unset;
//     flex-grow: 1;
//   }

//   .step-progress__step {}

//   .step-progress__wrapper-before {
//     display: none !important;
//   }

//   #stepper .step-progress__step::after {
//     display: none !important;
//   }
// }
#stepper .step-progress__step{
  border: solid white 20px;
}
#stepper .step-progress__step-icon, #subStepper .step-progress__step-icon {
    font-size: 25px;
}
.step-progress__step-label{
  cursor: pointer;
}
// Input Form Margins & Borders ----

.formkit-input[data-classification=group] [data-is-repeatable] {
  border: none;
  padding: 1em 1em 1em 0em;
}

.formkit-input[data-classification=group] [data-is-repeatable] .formkit-input-group-repeatable {
  border-bottom: none;
}

.formkit-input-element--checkbox {
  margin-right: 5px;
}

.formkit-input-wrapper {
  font-family: "Ubuntu";
}

.formkit-input[data-classification=button] button[data-ghost] {
  font-weight: 400;
}

.formkit-input-error {
  color: #e13737 !important;
  font-weight: 400 !important;
}

// General Formkit Styling ----

.formkit {
  &-input {
    .formkit {
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

  .formkit-input-group-add-more {
    display: flex;
    justify-content: flex-end;

    button {
      border: black;
    }
  }

  .formkit-input {
    &[data-classification="text"] .formkit-input-wrapper {
      display: flex;
      flex-direction: column;
    }

    &[data-classification="select"] .formkit-input-wrapper {
      display: flex;
      flex-direction: column;
    }
  }

  .formkit-input[data-classification="button"] {
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

.formkit-input.besides {
  border-bottom: 1px solid lightgrey !important;
}

.formkit-input-label {
  font-weight: 500 !important;
}

.formkit-input-element {

  &--textarea {
    width: 100%;
  }
}

.formkit-input-element--group {
  display: block !important;
}

.formkit-input.besides>.formkit-input-wrapper>.formkit-input-label {


  text-decoration: underline !important;
}

// #stepper,
// #subStepper {


//   .step-progress__step::after {
//     display: none;
//   }

//   .step-progress__step-label {
//     cursor: pointer;
//   }
// }
</style>
