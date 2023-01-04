<template>
  <div class="form-container">
    <slot></slot>
    <div class="inputContainer" v-if="isInput">
      <div class="formContainer formulate">
        <FormulateForm name="form" v-model.lazy="formValues" :schema="getSchema" @failed-validation="showValidationFields" @submit="handleSubmit"
        @change="saveFormValues({ property: property, page: page, distid: id, values: formValues })"
        @repeatableRemoved="saveFormValues({ property: property, page: page, distid: id, values: formValues })">
          <FormulateInput type="submit" id="submit-form" class="display-none"></FormulateInput>
        </FormulateForm>
        <FormulateInput type="hidden" class="display-none"></FormulateInput>
      </div>
    </div>
    <div v-if="isDistributionOverview">
      <DistributionOverview :distributionOverviewPage="isDistributionOverview"></DistributionOverview>
    </div>
    <ValidationModal :failedFields="failedFields"></ValidationModal>
    <!-- not the prettiest way but calling it within navigation component seems quiet complicated -->
    <app-confirmation-dialog id="mandatoryModal" :confirm="mandatoryModal.confirm" @confirm="mandatoryModal.callback">
      {{ mandatoryModal.message }}
    </app-confirmation-dialog>
  </div>
</template>

<script>
/* eslint-disable no-alert,arrow-parens,no-param-reassign,no-lonely-if */
import { mapActions, mapGetters } from 'vuex';
import $ from 'jquery';
import {
  has,
  isNil,
  isArray,
} from 'lodash';
import ValidationModal from '../components/ValidationModal.vue';
import DistributionOverview from './DistributionOverview.vue';

export default {
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
      formValues: {},
      failedFields: [],
      mandatoryModal: {
        confirm: '',
        message: 'Mandatory Properties missing',
        callback: $('#modal').modal('hide'),
      }
    };
  },
  components: {
    ValidationModal,
    DistributionOverview,
  },
  computed: {
    ...mapGetters('auth', [
      'getIsEditMode',
      'getUserCatalogIds',
    ]),
    ...mapGetters('dpiStore', [
      'getSchema',
      'mandatoryFieldsFilled',
      'getNavSteps',
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
      return title
        .toLowerCase()
        .replace(/ /g, '-');
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
    initInputPage() {
      if (this.page !== 'overview' && this.page !== 'distoverview') {
        this.addCatalogOptions({property: this.property, catalogs: this.getUserCatalogIds});
        this.saveLocalstorageValues(this.property); // saves values from localStorage to vuex store
        this.formValues = this.$store.getters['dpiStore/getRawValues']({property: this.property, page: this.page, id: this.id});
        
        this.$nextTick(() => {
          $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
          });
        });
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
    showValidationFields(fields) {
      const fieldNames = Object.keys(fields);
      const translatedFields = [];
      for (let index = 0; index < fieldNames.length; index += 1) {
        const fieldLabel = fields[fieldNames[index]].label;
        if (fields[fieldNames[index]].id !== 'datasetIDFormHidden') translatedFields.push(fieldLabel);
      }
      this.failedFields = translatedFields;
      $('#validationModal').modal({ show: true });
    },
    handleSubmit() {
      this.$root.$emit('go-to-next');
    },
    getFirstPath() {
      let firstStep;
      let path;

      if (this.property === 'distributions') {
        firstStep = this.getNavSteps.datasets[0];
        path = `${this.$env.upload.basePath}/datasets/${firstStep}?locale=${this.$i18n.locale}`;
      } else {
        firstStep = this.getNavSteps[this.property][0];
        path = `${this.$env.upload.basePath}/${this.property}/${firstStep}?locale=${this.$i18n.locale}`;
      }
      return path;
    },
    jumpToFirstPage() {
      this.$router.push(this.getFirstPath()).catch(() => {});
    },
    checkPathAllowed(to, from) {
      let allowedPaths = [
        `${this.$env.upload.basePath}/datasets/${this.getNavSteps.datasets[0]}`,
        `${this.$env.upload.basePath}/catalogues/${this.getNavSteps.catalogues[0]}`,
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
    // form content (schema) created based on defined page properties included in inputconfigMin
    if (this.page !== 'overview' && this.page !== 'distoverview') {
      this.createSchema({ property: this.property, page: this.page });
      this.translateSchema({ property: this.property });
    }
  },
  mounted() {
    this.initInputPage();
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
        this.addCatalogOptions({property: this.property, catalogs: this.getUserCatalogIds});
      },
    },
    // the schema is a computed value which gets computed only once so on language change this value must be re-computed
    '$i18n.locale': {
      handler() {
        this.createSchema({ property: this.property, page: this.page });
        this.translateSchema({ property: this.property });
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    // Always clear storage when entering DPI
    next(vm => {
      if (from.name !== null && !from.name.startsWith('DataProviderInterface')) {
        vm.clear();
        vm.jumpToFirstPage();
      }
      if (from.name === null && !vm.mandatoryFieldsFilled({property: vm.property, id: vm.id})) {
        vm.jumpToFirstPage();
        $('#mandatoryModal').modal({ show: true });
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    // Checks if next route within the DPI is a route which does not require mandatory checking
    if (to.query.clear !== 'true' && !this.checkPathAllowed(to, from) && !this.mandatoryFieldsFilled({property: this.property, id: this.id})) {
      $('#mandatoryModal').modal({ show: true });
    } else {
      next();
    }
  },
};
</script>
<style lang="scss">
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
  .formulate-input-group-repeatable {
    display: grid;
    grid-template-columns: 70% 28%;
    grid-template-rows: auto auto;
    grid-gap: 10px;
    background-color: transparent;
  }
}

.grid1r2c {
  .formulate-input-group-repeatable {
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
