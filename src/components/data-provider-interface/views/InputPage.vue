<template>
    <div class="form-container">
      <slot></slot>
      <div class="inputContainer" v-if="isInput">
        <div class="formContainer formulate">
          <FormulateForm name="form" v-model.lazy="formValues" :schema="schema" @failed-validation="showValidationFields" @change="saveChange" @submit="handleSubmit">
            <FormulateInput type="submit" id="submit-form" class="display-none"></FormulateInput>
          </FormulateForm>
          <FormulateInput type="hidden" class="display-none"></FormulateInput>
        </div>
        <InfoBox class="infoContainer"></InfoBox>
      </div>
      <div v-if="isDistributionsPage">
        <DistributionOverview :distributionOverviewPage="distributionOverviewPage"></DistributionOverview>
      </div>
      <ValidationModal :failedFields="failedFields"></ValidationModal>
    </div>
</template>

<script>
/* eslint-disable no-alert,arrow-parens,no-param-reassign,no-lonely-if */
import { mapActions, mapGetters } from 'vuex';

import $ from 'jquery';
import {
  has,
  isEmpty,
  isNil,
  isArray,
} from 'lodash';
import inputconfigMin from '../../../../config/inputconfigMin';
import dcatapProperties from '../../../utils/converter/dcatapProperties';
import { retrieveDataFromSource } from '../../../utils/adapter';
import ValidationModal from '../components/ValidationModal.vue';
import DistributionOverview from '../components/DistributionOverview.vue';
import InfoBox from '../components/InfoBox.vue';

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
    currentSubroutingStep: {
      type: Number,
    },
    id: {
      type: String,
    },
    createNewDataset: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      schema: [],
      formValues: {},
      failedFields: [],
      inputProperty: this.$env.upload.input[this.property],
    };
  },
  components: {
    ValidationModal,
    DistributionOverview,
    InfoBox,
  },
  computed: {
    ...mapGetters('auth', [
      'getIsEditMode',
      'getUserCatalogIds',
    ]),
    getFirstTitleFromForm() {
      return has(this.formValues, 'dct:title')
        && isArray(this.formValues['dct:title'])
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
    routeValueName() {
      return `inputValues_${this.property}_${this.page}${(this.page === this.inputProperty.subroutingStep ? `_${this.id}` : '')}`;
    },
    distributionOverviewPage() {
      const currentPageDetails = this.$env.upload.input[this.property].steps.filter(dataset => dataset.path === this.page)[0];
      if (currentPageDetails.subrouting && this.currentSubroutingStep === currentPageDetails.children.length - 1) return true;
      return false;
    },
    isInput() {
      return this.currentSubroutingStep < 3;
    },
    isDistributionsPage() {
      return has(this.inputProperty, 'subroutingStep') && this.page === this.inputProperty.subroutingStep;
    },
    getDistributions() {
      return has(this.formValues, 'distribution')
        ? this.formValues.distribution
        : this.getDistributionsFromLocalStorage;
    },
  },
  methods: {
    ...mapActions('auth', ['setIsEditMode', 'setIsDraft']),
    clearStorage() {
      this.formValues = {};
      this.failedFields = [];
      this.resetDistributions();
      this.clearLocalStorage();
    },
    clearLocalStorage() {
      const localKeys = Object.keys(localStorage);
      for (let keyIndex = 0; keyIndex < localKeys.length; keyIndex += 1) {
        const key = localKeys[keyIndex];
        if (key.startsWith('inputValues') || key.startsWith('dpi_additional')) {
          localStorage.removeItem(key);
        }
      }
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
    saveChange() {
      if (has(this.formValues, 'datasetID') || has(this.formValues, 'dcat:Catalog')) {
        let additionalData;

        if (Object.keys(localStorage).includes('dpi_additional_data')) {
          additionalData = JSON.parse(localStorage.getItem('dpi_additional_data'));
        }

        if (isNil(additionalData)) {
          additionalData = {
            datasets: '',
            distributions: '',
            catalogues: '',
          };
        }

        additionalData.datasets = has(this.formValues, 'datasetID') ? this.formValues.datasetID : additionalData.datasets;
        additionalData.catalogues = has(this.formValues, 'dcat:Catalog') ? this.formValues['dcat:Catalog'] : additionalData.catalogues;
        localStorage.setItem('dpi_additional_data', JSON.stringify(additionalData));
      }

      const distributionRouteValueName = this.getDistributionRouteValueName();

      localStorage.setItem(distributionRouteValueName, JSON.stringify(this.formValues));
    },
    handleSubmit() {
      this.$root.$emit('go-to-next');
    },
    getDistributionRouteValueName() {
      if (this.page === this.inputProperty.subroutingStep) {
        const currentDist = JSON.parse(localStorage.getItem('currentDistribution'));
        return `${this.routeValueName}_${currentDist}`;
      }
      return this.routeValueName;
    },
    extractAndTranslate() {
      this.schema = this.extractPageContent(inputconfigMin, this.property, this.page, this.id);
      this.translate(this.schema, this.property, this.page, this.$i18n.locale, this.$t, this.$i18n);
    },
    translateProperty(propertyValues, property, page) {
      const translatableValues = ['label', 'info', 'help', 'placeholder', 'add-label'];
      const propertyName = propertyValues.identifier;
      for (let valueIndex = 0; valueIndex < translatableValues.length; valueIndex += 1) {
        const propertyTranslatableValue = translatableValues[valueIndex];
        const translation = this.$t(`message.dataupload.${property}.${page}.${propertyName}.${propertyTranslatableValue}`);
        if (!has(propertyValues, propertyTranslatableValue) && translation !== undefined) propertyValues[propertyTranslatableValue] = translation;
      }
    },
    translate(schema, property, page) {
      const translatedSchema = schema;

      for (let objectIndex = 0; objectIndex < translatedSchema.length; objectIndex += 1) {
        const propertyValues = translatedSchema[objectIndex];

        if (has(propertyValues, 'children')) {
          // group attributes should be translated too
          this.translateProperty(propertyValues, property, page);
          // translated nested properties
          this.translate(propertyValues.children, property, page);
        } else if (has(propertyValues, 'data')) {
          // group attributes should be translated too
          this.translateProperty(propertyValues, property, page);
          // translate nested data
          const dataKeys = Object.keys(propertyValues.data);
          for (let keyIndex = 0; keyIndex < dataKeys.length; keyIndex += 1) {
            const currentKey = dataKeys[keyIndex];
            this.translate(propertyValues.data[currentKey], property, page);
          }
        } else {
          this.translateProperty(propertyValues, property, page);
        }
      }
    },
    async addOptions(propertyValues, options) {
      const values = propertyValues;
      if (has(values, 'children')) {
        // group form containing atomic forms or even nested group forms
        for (let childrenIndex = 0; childrenIndex < values.children.length; childrenIndex += 1) {
          this.addOptions(values.children[childrenIndex], options);
        }
      } else if (has(values, 'data')) {
        // conditional form with provided data-attribute
        const conditionalDataKeys = Object.keys(values.data);
        for (let conditionalIndex = 0; conditionalIndex < conditionalDataKeys.length; conditionalIndex += 1) {
          const conditionalFormConfigArray = values.data[conditionalDataKeys[conditionalIndex]];
          for (let conditionalSubIndex = 0; conditionalSubIndex < conditionalFormConfigArray.length; conditionalSubIndex += 1) {
            this.addOptions(conditionalFormConfigArray[conditionalSubIndex], options);
          }
        }
      } else {
        // atomic form configuration
        const langaugeInformation = this.$env.upload.languages;
        if (has(options.source, values.identifier) && isEmpty(values.options)) {
          const vocabularyConfigKey = options.source[values.identifier];
          values.options = await retrieveDataFromSource(this.$env.upload.input[vocabularyConfigKey], langaugeInformation);
        } else {
          // why eslint? there is no lonely if statement allowed within an else-block
        }
      }
    },
    getPropertyValues(propertyName, options, property, page) {
      let propertyValues = {};

      if (Object.keys(dcatapProperties[property]).includes(propertyName)) {
        // TYPE included in Dist AND Dataset with different vocabulary
        if (propertyName === 'type' && page === this.inputProperty.subroutingStep) {
          propertyValues = dcatapProperties.distribution[propertyName];
        } else {
          propertyValues = dcatapProperties[property][propertyName];
        }
        if (!isEmpty(options)) {
          this.addOptions(propertyValues, options);
        }
      } else if (page === this.inputProperty.subroutingStep && Object.keys(dcatapProperties.distribution).includes(propertyName)) {
        propertyValues = dcatapProperties.distribution[propertyName];
        if (!isEmpty(options)) {
          this.addOptions(propertyValues, options);
        }
      } else {
        throw new Error(`There is no property '${propertyName}' in '${property}' within the DCAT-AP specification!'`);
      }
      // Append unique class name to each property for more robust integration tests
      const uniqueClassName = `__dpi-${property}-${propertyName}`;
      propertyValues.class = propertyValues.class
        ? `${propertyValues.class} ${uniqueClassName}`
        : uniqueClassName;

      return propertyValues;
    },
    extractAllPropertyValues(config, property, page) {
      const schema = [];
      const keys = Object.keys(config);
      for (let index = 0; index < keys.length; index += 1) {
        schema.push(this.getPropertyValues(keys[index], config[keys[index]], property, page));
      }
      return schema;
    },
    extractPageContent(config, property, page, distributionPage) {
      const keys = config[property][page];
      let schema = [];

      if (page === this.inputProperty.subroutingStep) {
        schema = this.extractAllPropertyValues(config[property][page][distributionPage], property, page);
      } else {
        schema = this.extractAllPropertyValues(keys, property, page);
      }

      return schema;
    },
    overrideAdditionalData() {
      if (Object.keys(localStorage).includes('dpi_additional_data')) {
        const additionalData = JSON.parse(localStorage.getItem('dpi_additional_data'));
        if (!isNil(additionalData) && additionalData.datasets !== '' && additionalData.catalogues !== '' && this.page === 'step1') {
          this.formValues.datasetID = additionalData.datasets;
          this.formValues['dcat:Catalog'] = additionalData.catalogues;
        }
      }
    },
    addDatasetCatalogueOptions() {
      if (this.page === 'step1') {
        this.schema.forEach(el => {
          if (el.name === 'dcat:Catalog') {
            this.getUserCatalogIds.forEach(cat => {
              el.options[cat] = cat;
            });
          }
        });
      }
    },
    resetDistributions() {
      localStorage.setItem('currentDistribution', JSON.stringify(1));
      localStorage.setItem('numberOfDistributions', JSON.stringify(1));
    },
    setDatasetID() {
      const additionalData = JSON.parse(localStorage.getItem('dpi_additional_data'));
      if (!isNil(additionalData)) this.formValues.datasetID = additionalData.datasets;
    },
    createDatasetID() {
      if (this.property === 'datasets' && this.page === 'step1') {
        // Create Dataset ID from title if not existing
        if (has(this.formValues, 'dct:title')
        && isArray(this.formValues['dct:title'])
        && !isNil(this.formValues['dct:title']
        && this.formValues['dct:title'].length > 0)
        && has(this.formValues['dct:title'][0], '@value')
        && !isNil(this.formValues['dct:title'][0], '@value')
        && (!has(this.formValues, 'datasetID')
        || (has(this.formValues, 'datasetID') && this.createIDFromTitle.startsWith(this.formValues.datasetID))
        || (has(this.formValues, 'datasetID') && this.formValues.datasetID.startsWith(this.createIDFromTitle)))) {
          const additionalData = JSON.parse(localStorage.getItem('dpi_additional_data'));
          if (!isNil(additionalData)) additionalData.datasets = this.createIDFromTitle;
          this.formValues.datasetID = this.createIDFromTitle;
          localStorage.setItem('dpi_additional_data', JSON.stringify(additionalData));
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
  beforeMount() {
    const distributionRouteValueName = this.getDistributionRouteValueName();
    if (localStorage.getItem(distributionRouteValueName)) this.formValues = JSON.parse(localStorage.getItem(distributionRouteValueName));
  },
  created() {
    if (this.createNewDataset) {
      this.clearStorage();
      this.setIsEditMode(false);
    }
    this.extractAndTranslate();
    this.overrideAdditionalData();
    this.$nextTick(() => {
      if (this.property === 'datasets') this.addDatasetCatalogueOptions();
      if (!localStorage.getItem('currentDistribution')) this.resetDistributions();
    });
  },
  watch: {
    getFirstTitleFromForm: {
      handler() {
        if (this.getIsEditMode) this.setDatasetID();
        else this.createDatasetID();
      },
    },
  },
  beforeRouteEnter(to, from, next) {
    // Always clear storage when entering DPI
    next(vm => {
      if (from.name !== null && !from.name.startsWith('DataProviderInterface')) {
        vm.resetDistributions();
        vm.clearLocalStorage();
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    // Always save form values to local storage before going to next step of DPI
    this.saveChange();
    next();
  },
  beforeRouteLeave(to, from, next) {
    // Always save form values to local storage before leaving DPI
    this.saveChange();
    next();
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
  width: 70%;
}

.infoContainer {
  top: 20px;
  width: 35%;
  padding: 10px;
  margin: 0 10px 0 10px;
  background-color: transparent;
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
