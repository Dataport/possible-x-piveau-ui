<template>
  <div>
    <div id="nav" class="d-flex justify-content-between">
      <div class="left-form-nav">
        <!-- PREVIOUS STEP -->
        <FormulateInput type="button" :label="$t('message.dataupload.preview')" @click="previous()" v-if="showPrevious" class="prev-btn mr-2"></FormulateInput>

        <!-- CLEAR FORM -->
        <FormulateInput type="button" :label="$t('message.dataupload.clear')" @click="handleClear" class="clear-btn"></FormulateInput>
      </div>
      <div class="right-form-nav">

        <!-- PUBLISH NEW CATALOGUE -->
        <FormulateInput type="button" @click="submit('createcatalogue')" v-if="(isOverviewPage || getMandatoryStatus({property: property, id: id})) && !getIsEditMode && !getIsDraft && property === 'catalogues'" class="mr-2"><span v-if="uploading.createcatalogue" class="loading-spinner"></span>{{$t('message.dataupload.publishcatalogue')}}</FormulateInput>
        <!-- PUBLISH EDITED CATALOGUE -->
        <FormulateInput type="button" @click="submit('createcatalogue')" v-if="getIsEditMode && !getIsDraft && property === 'catalogues'" class="mr-2"><span v-if="uploading.createcatalogue" class="loading-spinner"></span>{{$t('message.dataupload.publishcatalogue')}}</FormulateInput>

        <FormulateInput type="button" @click="submit('dataset')" v-if="showCreateNewDataset" class="mr-2">
          <span v-if="uploading.dataset" class="loading-spinner"></span>
          {{ $t('message.dataupload.publishdataset') }}
        </FormulateInput>

        <!-- SAVE NEW DATASET AS DRAFT -->
        <FormulateInput type="button" @click="submit('draft')" v-if="showCreateNewDraft" class="mr-2">
          <span v-if="uploading.draft" class="loading-spinner"></span>
          {{ $t('message.dataupload.saveasdraft') }}
        </FormulateInput>

        <!-- PUBLISH EDITED DATASET -->
        <FormulateInput type="button" @click="submit('dataset')" v-if="showCreateEditedDataset" class="mr-2">
          <span v-if="uploading.dataset" class="loading-spinner"></span>
          {{ $t('message.dataupload.savedataset') }}
        </FormulateInput>

        <!-- SAVE EDITED DRAFT  -->
        <FormulateInput type="button" @click="submit('draft')" v-if="showCreateEditedDraft" class="mr-2">
          <span v-if="uploading.draft" class="loading-spinner"></span>
          {{ $t('message.dataupload.savedraft') }}
        </FormulateInput>

        <!-- NEXT STEP -->
        <!-- label triggers form submit and therefore handles error mesaages if required values are missing -->
        <label for="submit-form" v-if="showNextLabel" class="submit-label">{{ $t('message.dataupload.next') }}</label>
        <FormulateInput type="button" :label="$t('message.dataupload.next')" @click="next()" v-if="showNext"></FormulateInput>
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
export default {
  name: 'Navigation',
  components: {},
  data() {
    return {
      uploading: {
        dataset: false,
        draft: false,
      },
      modal: {
        confirm: '',
        message: '',
        callback: '',
      },
      modals: {
        id: {
          confirm: '',
          message: 'Dataset ID already exists',
          callback: this.closeModal,
        },
        mandatory: {
          confirm: '',
          message: 'Mandatory Properties are missing',
          callback: this.closeModal,
        },
        clear: {
          confirm: 'Clear form',
          message: 'Are your sure you want to clear the form?',
          callback: this.clearStorage,
        },
      },
      property: this.$route.params.property,
      page: this.$route.params.page,
      id: this.$route.params.id,
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getIsEditMode',
      'getIsDraft',
      'getUserData',
    ]),
    ...mapGetters('dpiStore', [
      'getData',
      'getNavSteps',
      'getMandatoryStatus'
    ]),
    iDError() { return this.$route.query.error === 'id' },
    datasetMandatoryError() { return this.$route.query.error === 'mandatoryDataset' },
    distributionMandatoryError() { return this.$route.query.error === 'mandatoryDistribution' },
    catalogMandatoryError() { return this.$route.query.error === 'mandatoryCatalog' },
    showPrevious() {
      return this.isPreviousPage || this.property === 'distributions';
    },
    showCreateNewDataset() {
      return this.isOverviewPage && !this.getIsEditMode && !this.getIsDraft && this.property !== 'catalogues';
    },
    showCreateNewDraft() {
      return (this.getMandatoryStatus({property: this.property, id: this.id}) || this.isOverviewPage) && !this.getIsEditMode && !this.getIsDraft && this.property!=='catalogues';
    },
    showCreateEditedDataset() {
      return this.getIsEditMode && !this.getIsDraft && this.property !== 'catalogues';
    },
    showCreateEditedDraft() {
      return (this.getMandatoryStatus({property: this.property, id: this.id}) || this.isOverviewPage) && this.getIsEditMode && this.getIsDraft && this.property !== 'catalogues';
    },
    showNextLabel() {
      return !(this.isOverviewPage || this.page === 'distoverview');
    },
    showNext() {
      return !this.isOverviewPage && this.page === 'distoverview';
    },
    isPreviousPage() {
      const currentPageIndex = this.getNavSteps[this.property].indexOf(this.page);
      return currentPageIndex > 0;
    },
    isOverviewPage() {
      // overview part of url not given as route parameter
      const path = this.$route.path;
      return path.includes('/overview');
    }
  },
  methods: {
    ...mapActions('auth', [
      'setIsEditMode',
      'setIsDraft',
    ]),
    ...mapActions('snackbar', [
      'showSnackbar',
    ]),
    ...mapActions('dpiStore', [
      'convertToRDF',
      'clearAll',
    ]),
    closeModal() {
      $('#modal').modal('hide');
    },
    handleIDError() {
      this.modal = this.modals.id;
      $('#modal').modal({ show: true });
    },
    handleDatasetMandatoryError() {
      this.modal = this.modals.mandatory;
      $('#modal').modal({ show: true });
    },
    handleDistributionMandatoryError() {
      this.modal = this.modals.mandatory;
      $('#modal').modal({ show: true });
    },
    handleCatalogMandatoryError() {
      this.modal = this.modals.mandatory;
      $('#modal').modal({ show: true });
    },
    handleClear() {
      this.modal = this.modals.clear;
      $('#modal').modal({ show: true });
    },
    clearStorage() {
      this.closeModal();
      this.$emit('clearStorage'); // clear gets called within main DPI component
    },
    previous() {
      let currentPage;
      if (this.isOverviewPage) {
        currentPage = 'overview';
      } else {
        currentPage = this.page;
      }

      const pageIndex = this.getNavSteps[this.property].indexOf(currentPage);
      const nextIndex = pageIndex - 1;

      if (nextIndex > -1) {
          const nextPage = this.getNavSteps[this.property][nextIndex];
          // preserve distribution index
          if (this.id) {
            this.$router.push(`${this.$env.upload.basePath}/${this.property}/${nextPage}/${this.id}?locale=${this.$i18n.locale}`).catch(() => {});
          } else {
            this.$router.push(`${this.$env.upload.basePath}/${this.property}/${nextPage}?locale=${this.$i18n.locale}`).catch(() => {});
          }
      } else if (nextIndex === -1 && this.property === 'distributions') {
        // when on the first page of the distributions form the previous button directs to the first distribution overview page
        this.$router.push(`${this.$env.upload.basePath}/datasets/distoverview?locale=${this.$i18n.locale}`).catch(() => {});
      }
    },
    next() {
      const pageIndex = this.getNavSteps[this.property].indexOf(this.page);
      const numberOfPages = this.getNavSteps[this.property].length;
      const nextIndex = pageIndex + 1;

      if (nextIndex < numberOfPages) {
        const nextPage = this.getNavSteps[this.property][nextIndex];
        if (this.id) {
          // preserve distribution id in path
          this.$router.push(`${this.$env.upload.basePath}/${this.property}/${nextPage}/${this.id}?locale=${this.$i18n.locale}`).catch(() => {});
        } else {
          this.$router.push(`${this.$env.upload.basePath}/${this.property}/${nextPage}?locale=${this.$i18n.locale}`).catch(() => {});
        }
      } else if (nextIndex === numberOfPages) {
        if (this.property === 'distributions') {
          // when within distributions the next button lead to datasets overview page
          this.$router.push(`${this.$env.upload.basePath}/datasets/overview?locale=${this.$i18n.locale}`).catch(() => {});
        }
      }
    },
    async submit(mode) {
      this.uploading[mode] = true;
      this.$Progress.start();

      // adapt submit property for case of distributions
      let submitProperty;
      if (this.property === 'distributions') {
        submitProperty = 'datasets';
      } else {
        submitProperty = this.property;
      }
      
      const RDFdata = await this.convertToRDF(submitProperty).then((response) => {return response;});
            
      const rtpToken = this.getUserData.rtpToken;

      if (!this.getMandatoryStatus({ property: this.property, id: this.id })) {
        this.$Progress.fail();
        this.showSnackbar({ message: 'Mandatory Properties missing', variant: 'error' });
        return;
      }

      const datasetId = this.getData(submitProperty)['datasetID'];
      const title = this.getData(submitProperty)['dct:title'];
      const description = this.getData(submitProperty)['dct:description'];
      const catalogName = this.getData(submitProperty)['dct:catalog'] ? this.getData(submitProperty)['dct:catalog'] : '';

      let uploadUrl;
      let actionName;
      let actionParams = {
        id: datasetId,
        catalog: catalogName,
        body: RDFdata,
        title,
        description,
      };

      if (mode === 'dataset') {
        uploadUrl = `${this.$env.api.hubUrl}datasets?id=${datasetId}&catalogue=${catalogName}`;
        actionParams = { data: RDFdata, token: rtpToken, url: uploadUrl };
        actionName = 'auth/createDataset';
      } else if (mode === 'draft') {
        uploadUrl = `${this.$env.api.hubUrl}drafts/datasets/${datasetId}?catalogue=${catalogName}`;
        actionName = 'auth/createUserDraft';
      } else if (mode === 'createcatalogue') {
        uploadUrl = `${this.$env.api.hubUrl}catalogues/${datasetId}`;
        actionParams = { data: RDFdata, token: rtpToken, url: uploadUrl, id: datasetId };
        actionName = 'auth/createCatalogue';
      }

      try {
        // Dispatch the right action depending on the mode
        await this.$store.dispatch(actionName, actionParams);
        await new Promise(resolve => setTimeout(resolve, 250));

        this.$Progress.finish();
        this.uploading = false;

        if (mode === 'createcatalogue') this.createCatalogue(datasetId);
        if (mode === 'dataset') this.createDataset(datasetId);
        if (mode === 'draft') this.createDraft();

        // store needs to be reset (especially the mandatoryStatus)
        this.clearAll();

      } catch (err) {
        this.uploading[mode] = false;
        this.$Progress.fail();
        this.showSnackbar({ message: 'Network Error', variant: 'error' });
      }
    },
    createDataset(datasetId) {
      this.clearAll();
      this.showSnackbar({ message: 'Dataset published successfully', variant: 'success' });
      this.$router.push({ name: 'DatasetDetailsDataset', params: { ds_id: datasetId }, query: { locale: this.$route.query.locale }}).catch(() => {});
    },
    createDraft() {
      this.clearAll();
      this.showSnackbar({ message: 'Draft saved successfully', variant: 'success' });
      this.$router.push({ name: 'DataProviderInterface-Draft', query: { locale: this.$route.query.locale }}).catch(() => {});
    },
    createCatalogue(datasetId) {
      this.clearAll();
      this.showSnackbar({ message: 'Catalogue saved successfully', variant: 'success' });
      this.$router.push({ name: 'CatalogueDetails', query: { showcatalogdetails: true, locale: this.$route.query.locale }, params: {ctlg_id: datasetId}}).catch(() => {});
    }
  },
  mounted() {
    this.$root.$on('go-to-next', () => this.next());

    // Show error if ID was already taken in meantime
    if (this.iDError) this.handleIDError();
    if (this.datasetMandatoryError) this.handleDatasetMandatoryError();
    if (this.distributionMandatoryError) this.handleDistributionMandatoryError();
    if (this.catalogMandatoryError) this.handleCatalogMandatoryError();
  },
};
</script>

<style lang="scss">
  // @import '../../../styles/bootstrap_theme';
  // @import '../../../styles/utils/css-animations';

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
