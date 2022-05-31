<template>
  <div>
    <div id="nav" class="d-flex justify-content-between">
      <div class="left-form-nav">
        <!-- PREVIOUS STEP -->
        <FormulateInput type="button" :label="$t('message.dataupload.preview')" @click="previous()" :disabled="!isPreviousPage" class="prev-btn mr-2"></FormulateInput>

        <!-- CLEAR FORM -->
        <FormulateInput type="button" :label="$t('message.dataupload.clear')" @click="handleClear" class="clear-btn"></FormulateInput> 
      </div>
      <div class="right-form-nav">
        <!-- ADD ANOTHER DISTRIBUTION -->
        <FormulateInput type="button" :label="$t('message.dataupload.newDistribution')" @click="newSubrouting()" v-if="showNewSubrouting" class="dist-btn mr-2"></FormulateInput>
        <!-- SKIP ADDING DISTRIBUTIONS -->
        <FormulateInput type="button" :label="$t('message.dataupload.skipDistribution')" @click="skipSubrouting()" v-if="showSkipSubrouting" class="dist-btn mr-2"></FormulateInput>


        <!-- PUBLISH NEW DATASET -->
        <FormulateInput type="button" @click="submit('createdataset')" v-if="isOverviewPage && !getIsEditMode && !getIsDraft" class="mr-2"><span v-if="uploading.createdataset" class="loading-spinner"></span>{{$t('message.dataupload.publishdataset')}}</FormulateInput>
        <!-- SAVE NEW DATASET AS DRAFT -->
        <FormulateInput type="button" @click="submit('createdraft')" v-if="(isMandatoryFilledOut || isOverviewPage) && !getIsEditMode && !getIsDraft" class="mr-2"><span v-if="uploading.createdraft" class="loading-spinner"></span>{{$t('message.dataupload.saveasdraft')}}</FormulateInput>

        <!-- PUBLISH EDITED DATASET -->
        <FormulateInput type="button" @click="submit('createdataset')" v-if="isOverviewPage && getIsEditMode && !getIsDraft" class="mr-2"><span v-if="uploading.createdataset" class="loading-spinner"></span>{{$t('message.dataupload.savedataset')}}</FormulateInput>

        <!-- SAVE EDITED DRAFT  -->
        <FormulateInput type="button" @click="submit('createdraft')" v-if="(isMandatoryFilledOut || isOverviewPage) && getIsEditMode && getIsDraft" class="mr-2"><span v-if="uploading.createdraft" class="loading-spinner"></span>{{$t('message.dataupload.savedraft')}}</FormulateInput>
        <!-- PUBLISH EDITED DRAFT  -->
        <FormulateInput type="button" @click="submit('publishdraft')" v-if="isOverviewPage && getIsEditMode && getIsDraft" class="mr-2"><span v-if="uploading.publishdraft" class="loading-spinner"></span>{{$t('message.dataupload.publishdraft')}}</FormulateInput> 
      
      
        <!-- NEXT STEP -->
        <label for="submit-form" v-if="!isOverviewPage & currentSubroutingStep < distributionOverviewIndex" class="submit-label">{{$t('message.dataupload.next')}}</label>
        <FormulateInput type="button" :label="$t('message.dataupload.next')" v-if="!isOverviewPage & currentSubroutingStep === distributionOverviewIndex" @click="next()" />
      </div>
    </div>

    <app-confirmation-dialog id="modal" :confirm="modal.confirm" @confirm="modal.callback">
      {{ modal.message }}
    </app-confirmation-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import $ from 'jquery';
import { mapGetters, mapActions } from 'vuex';
import { has, isNil, isArray } from 'lodash';
import { convertToJsonld } from '../../../utils/converter/convertToJsonld';
export default {
  name: 'Navigation',
  components: {},
  data() {
    return {
      uploading: {
        createdataset: false,
        createdraft: false,
        publishdraft: false,
      },
      modal: {
        confirm: '',
        message: '',
        callback: '',
      },
      modals: {
        mandatoryProps: {
          confirm: '',
          message: 'Mandatory Properties missing',
          callback: this.closeModal,
        },
        id: {
          confirm: '',
          message: 'Dataset ID already exists',
          callback: this.closeModal,
        },
        clear: {
          confirm: 'Clear form',
          message: 'Are your sure you want to clear the form?',
          callback: this.clearStorage,
        },
      },
    };
  },
  props: {
    isOverviewPage: Boolean,
    steps: {
      type: Array,
      default: [],
    },
    currentStep: Number,
    currentSubroutingStep: Number,
  },
  methods: {
    ...mapActions('auth', ['setIsEditMode', 'setIsDraft']),
    closeModal() {
      $('#modal').modal('hide');
    },
    handleMandatoryPropsError() {
      this.modal = this.modals.mandatoryProps;
      $('#modal').modal({ show: true });
    },
    handleIDError() {
      this.modal = this.modals.id;
      $('#modal').modal({ show: true });
    },
    handleClear() {
      this.modal = this.modals.clear;
      $('#modal').modal({ show: true });
    },
    clearStorage() {
      this.setIsEditMode(false);
      this.setIsDraft(false);
      this.closeModal();
      this.$emit('clearStorage');
    },
    skipSubrouting() {
      const next = this.getNextStep;
      this.$emit('next', next.nextStep + 1, false);
    },
    newSubrouting() {
      this.$emit('newSubrouting');
    },
    previous() {
      const previous = this.getPreviousStep;
      this.$emit('previous', previous.previousStep, previous.subrouting);
    },
    next() {
      const next = this.getNextStep;
      this.$emit('next', next.nextStep, next.subrouting);
    },
    async submit(mode) {
      this.uploading[mode] = true;
      this.$Progress.start();

      const jsonld = await convertToJsonld(this.$route.params.property);
      const rtpToken = this.$store.getters['auth/getUserData'].rtpToken;
      const additionalData = JSON.parse(localStorage.getItem('dpi_additional_data'));
      const datasetId = additionalData.datasets;
      const catalogName = additionalData.catalogues;
      let uploadUrl;
      let actionName;
      let actionParams = {
        id: datasetId,
        catalog: catalogName,
        body: jsonld,
        // TODO: populate title and description
        title: {},
        description: {},
      };

      if (mode === 'createdataset') {
        uploadUrl = `${this.$env.api.hubUrl}datasets/${datasetId}?catalogue=${catalogName}`;
        actionParams = { data: jsonld, token: rtpToken, url: uploadUrl };
        actionName = 'auth/createDataset';
      } else if (mode === 'createdraft') {
        uploadUrl = `${this.$env.api.hubUrl}drafts/datasets/${datasetId}?catalogue=${catalogName}`;
        actionName = 'auth/createUserDraft';
      } else if (mode === 'publishdraft') {
        uploadUrl = `${this.$env.api.hubUrl}drafts/datasets/publish/${datasetId}?catalogue=${catalogName}`;
        actionName = 'auth/publishUserDraft';
      }

      try {
        // Dispatch the right action depending on the mode
        await this.$store.dispatch(actionName, actionParams);
        await new Promise(resolve => setTimeout(resolve, 250));

        this.$Progress.finish();
        this.uploading = false;

        if (mode === 'createdataset' || mode === 'publishdraft') this.createDataset(datasetId);
        if (mode === 'createdraft') this.createDraft();
      } catch (err) {
        this.uploading[mode] = false;
        this.$Progress.fail();
        this.$store.dispatch('snackbar/showSnackbar', { message: 'Network Error', variant: 'error' });
      }
    },
    createDataset(datasetId) {
      this.clearStorage();
      this.setIsEditMode(false);
      this.setIsDraft(false);
      this.$store.dispatch('snackbar/showSnackbar', { message: 'Dataset published successfully', variant: 'success' });
      this.$router.push({ name: 'DatasetDetailsDataset', params: { ds_id: datasetId } });
    },
    createDraft() {
      this.$store.dispatch('snackbar/showSnackbar', { message: 'Draft saved successfully', variant: 'success' });
      this.$router.push({ name: 'DataProviderInterface-Draft' });
    },
  },
  computed: {
    ...mapGetters('auth', ['getIsEditMode', 'getIsDraft']),
    isMandatoryFilledOut() {
      const step1 = JSON.parse(localStorage.getItem('inputValues_datasets_step1'));
      return has(step1, 'datasetID') && !isNil(step1.datasetID)
          && has(step1, 'dct:title') && isArray(step1['dct:title']) && step1['dct:title'].map(a => !isNil(a['@language']) && !isNil(a['@value'])).reduce((a, b) => b)
          && has(step1, 'dct:description') && isArray(step1['dct:description']) && step1['dct:description'].map(a => !isNil(a['@language']) && !isNil(a['@value'])).reduce((a, b) => b)
          && has(step1, 'dcat:Catalog') && !isNil(step1['dcat:Catalog']);
    },
    mandatoryPropsError() {
      return this.$route.query.error === 'mandatory';
    },
    iDError() {
      return this.$route.query.error === 'id';
    },
    distributionOverviewIndex() {
      return has(this.$env.upload.input[this.$route.params.property], 'subroutingStep')
        ? this.steps.filter(dataset => dataset.path === this.$env.upload.input[this.$route.params.property].subroutingStep).map(dataset => dataset.children)[0].length - 1
        : 0;
    },
    showSkipSubrouting() {
      return !this.isOverviewPage && this.steps[this.currentStep] && this.steps[this.currentStep + 1] && this.steps[this.currentStep + 1].subrouting;
    },
    showNewSubrouting() {
      return !this.isOverviewPage && this.steps[this.currentStep] && this.steps[this.currentStep].subrouting && this.steps[this.currentStep].children.length === this.currentSubroutingStep + 1;
    },
    getPreviousStep() {
      let previousStep = -1;
      let subrouting = false;

      if (this.steps[this.currentStep] && this.steps[this.currentStep].subrouting) {
        previousStep = this.currentSubroutingStep > 0
          ? this.currentSubroutingStep - 1
          : -1;
        subrouting = true;
      } else {
        previousStep = this.getPreviousPage;
      }
      return {
        previousStep,
        subrouting,
      };
    },
    getPreviousPage() {
      return this.isPreviousPage
        ? this.currentStep - 1
        : -1;
    },
    isPreviousPage() {
      return this.currentStep > 0;
    },
    getNextStep() {
      let nextStep = -1;
      let subrouting = false;

      if (this.steps[this.currentStep] && this.steps[this.currentStep].subrouting) {
        if (this.currentSubroutingStep + 1 < this.steps[this.currentStep].children.length) {
          nextStep = this.currentSubroutingStep + 1;
          subrouting = true;
        } else {
          nextStep = this.currentSubroutingStep + 1;
          subrouting = true;
        }
      } else {
        nextStep = this.getNextPage;
      }

      return {
        nextStep,
        subrouting,
      };
    },
    getNextPage() {
      return this.currentStep + 1 > this.stepLength
        ? -1
        : this.currentStep + 1;
    },
    stepLength() {
      return this.steps
        ? this.steps.length
        : 0;
    },
  },
  mounted() {
    this.$root.$on('go-to-next', () => this.next());

    // Show error if mandatory props not set
    if (this.mandatoryPropsError) this.handleMandatoryPropsError();

    // Show error if ID was already taken in meantime
    if (this.iDError) this.handleIDError();
  },
};
</script>

<style lang="scss">
  @import '../../../styles/bootstrap_theme';
  @import '../../../styles/utils/css-animations';

#nav {
  .clear-btn button {
    background-color: #ffffff;
    border-color: #949494;
    color: rgb(79, 79, 79);
  }
  .dist-btn button {
    background-color: #ffffff;
    border-color: #2b2b2b;
    color: rgb(48, 48, 48);
  }
  .prev-btn button {
    background-color: #767676;
    border-color: #767676;
    color: #fff;
  }

  .submit-label button {
    background-color: #001d85;
    border-color: #001d85;
    color: #fff;
    border-radius: 0.3em;
    font-size: 16px;
    font-family: "Ubuntu";
    padding: 0.75em;
    font-weight: 100;
    display: inline-flex;
    align-items: center;
    margin-bottom: 0px;
    margin-left: auto;
    height: 50px;
  }

  button {
    background-color: #001d85;
    border-color: #001d85;
    color: #fff;
    border-radius: 0.3em;
    font-size: 16px;
    font-family: "Ubuntu";
    padding: 0.75em;
    font-weight: 100;
    display: inline-flex;
    align-items: center;
    margin-bottom: 0px;
    margin-left: auto;
    height: 50px;
    margin-top: 10px;
  }
}

.left-form-nav {
  width: 40%;
  display: flex;
}

.right-form-nav {
  display: flex;
}

.submit-label {
    background-color: #001d85;
    border-color: #001d85;
    color: #fff;
    border-radius: 0.3em;
    font-size: 16px;
    font-family: "Ubuntu";
    padding: 0.75em;
    font-weight: 100;
    display: inline-flex;
    align-items: center;
    margin-bottom: 0px;
    margin-left: auto;
    height: 50px;
    margin-top: 10px;
}

.submit-label:hover {
  cursor: pointer;
}
</style>