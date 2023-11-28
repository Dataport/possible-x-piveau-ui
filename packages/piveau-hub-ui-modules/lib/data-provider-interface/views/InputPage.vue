<template>
  <div class="form-container">
    <slot></slot>

    <div class="inputContainer" v-if="isInput">
      <div class="formContainer formkit"> 
        <FormKitSchema name="form" ref="dpiForm" v-model.lazy="formValues" :schema="getSchema" @failed-validation="showValidationFields"
          @submit="handleSubmit"
          @change="saveFormValues({ property: property, page: page, distid: id, values: formValues }); setMandatoryStatus({ property: property, id: id })"
          @repeatableRemoved="saveFormValues({ property: property, page: page, distid: id, values: formValues }); setMandatoryStatus({ property: property, id: id })">
          
          <FormKit type="submit" id="submit-form" class="display-none"></FormKit>
        </FormKitSchema>
        <FormKit type="hidden" class="display-none"></FormKit>
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

    <app-confirmation-dialog id="validationModal" :confirm="validationModal.confirm" @confirm="validationModal.callback">
      {{ validationModal.message }}
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
        message: 'Mandatory Properties missing - make sure to fill out every field marked with an *',
        callback: $('#modal').modal('hide'),
      },
      validationModal: {
        conform: '',
        message: 'The given values for some input fields are incorrect!',
        callback: $('#modal').modal('hide'),
      },
      info: {},
      catalogues: []
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
      'getMandatoryStatus',
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
      'setMandatoryStatus',
      'setDeleteDistributionInline',
    ]),
    initInputPage() {
      if (this.page !== 'overview' && this.page !== 'distoverview') {
        this.addCatalogOptions({ property: this.property, catalogs: this.getUserCatalogIds });
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
    // async initCatalogues() {
    //   await axios
    //     .get('https://piveau-hub-search-data-europa-eu.apps.osc.fokus.fraunhofer.de/search?filter=catalogue&limit=100')
    //     .then(response => (this.info = response))
    //   this.info.data.result.results.forEach((e) => {
    //     this.catalogues.push({ title: Object.values(e.title)[0], id: e.id })
    //   });
    //   this.findcatalogues()
    //   // need to forceupdate to display the filtered catalogues
    //   this.$forceUpdate();
    // },
    // findcatalogues() {
    //   for (let i = 0; i < Object.keys(this.getUserCatalogIds).length; i++) {
    //     for (let a = 0; a < Object.keys(this.catalogues).length; a++) {
    //       if (this.getUserCatalogIds[i] === this.catalogues[a].id) {
    //         this.getUserCatalogIds[i] = this.catalogues[a].title;
    //         break
    //       }
    //     }
    //   }
    // },
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
      console.log('CALL CREATE SCHEMA');
      this.createSchema({ property: this.property, page: this.page });
      this.translateSchema({ property: this.property });
    }
  },
  mounted() {
    this.initInputPage();
    // this.initCatalogues();
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
    }
  },
  beforeRouteEnter(to, from, next) {
    // Always clear storage when entering DPI
    next(vm => {
      if (from.name && !from.name.startsWith('DataProviderInterface')) {
        vm.clear();
        vm.jumpToFirstPage();
      }
      if (!from.name && !vm.getMandatoryStatus({ property: vm.property, id: vm.id })) {
        vm.jumpToFirstPage();
        $('#mandatoryModal').modal({ show: true });
      }
      let a = { "step1": { "dct:title": [{ "@value": "DcatDE GeschichTE", "@language": "en" }], "datasetID": "a-test", "hidden_datasetIDFormHidden": "a-test", "dct:description": [{ "@value": "Geo'DAE is the national database of external automated defibrillators (DAEs), listed in France.\n\nBarely 1 in 10 citizens survive a cardiac arrest because they have not benefited at the right time of a person’s intervention.\n\nThe national public health plan plans to train 80 % of the population in first aid actions and to improve access to external automated defibrillators on the national territory, by promoting their geolocation and maintenance.\n\nThe creation of a national database, provision of the law of 28 June 2018 on cardiac defibrillator, is part of this ambition. All AED operators must now report their defibrillator data and characteristics in the national database.\n\nThe reporting portal is available at the following link: https://geodae.atlasante.fr/apropos\n\nIf you have any questions, please contact us at: contact@geodae.sante.gouv.fr.\n\nThis sheet presents the extraction of the public data reported by the operators, as provided for in the Decree of 29 October 2019 on the operation of the national database of external automated defibrillators, published in the OJ of 13 November 2019.\n\nThe public or limited dissemination rules are specified in Annexes 1, 2 and 3 to this Order. Only open access data is disseminated in open data.", "@language": "en" }], "dcat:catalog": "dpi", "dcat:theme": ["http://publications.europa.eu/resource/authority/data-theme/ENER", "http://publications.europa.eu/resource/authority/data-theme/AGRI", "http://publications.europa.eu/resource/authority/data-theme/ENVI", "http://publications.europa.eu/resource/authority/data-theme/EDUC", "http://publications.europa.eu/resource/authority/data-theme/GOVE", "http://publications.europa.eu/resource/authority/data-theme/JUST", "http://publications.europa.eu/resource/authority/data-theme/OP_DATPRO"], "dct:issued": "2023-02-01T03:03:00", "dct:modified": "2023-02-07" }, "step2": { "dcatde:politicalGeocodingLevelURI": ["http://dcat-ap.de/def/politicalGeocoding/Level/international"], "dcatde:politicalGeocodingURI": ["http://dcat-ap.de/def/politicalGeocoding/municipalityKey/01053121"], "dcat:keyword": [{ "@value": "asdsd", "@language": "de" }], "dct:subject": ["http://eurovoc.europa.eu/2753", "http://eurovoc.europa.eu/3011", "http://eurovoc.europa.eu/688", "http://eurovoc.europa.eu/3577", "http://eurovoc.europa.eu/1085", "http://eurovoc.europa.eu/4488", "http://eurovoc.europa.eu/1460", "http://eurovoc.europa.eu/5042", "http://eurovoc.europa.eu/1074", "http://eurovoc.europa.eu/5334", "http://eurovoc.europa.eu/940"], "dct:spatial": "http://publications.europa.eu/resource/authority/country/BGR", "dct:creator": [{ "rdf:type": "foaf:Person", "foaf:name": "dfgdfgd", "foaf:mbox": "test@tes.de", "foaf:homepage": "https://jena-wissensallmende.apps.osc.fokus.fraunhofer.de/" }] }, "step3": {} }
    });
  },
  beforeRouteUpdate(to, from, next) {
    // Checks if next route within the DPI is a route which does not require mandatory checking
    if (to.query.clear !== 'true' && !this.checkPathAllowed(to, from) && !this.getMandatoryStatus({ property: this.property, id: this.id })) {
      // for singular distribution: when deleteing from inline the mandatory check would return false leading to the display of the mandatory-modal
      // since the distribution is already deleted the mandatory check would alwaysreturn false so by determining if an inline delete happens 
      // (by checking getDeleteDistributionInline) we skip the display of the modal and grant redirect 
      if (this.property === 'distributions' && this.getDeleteDistributionInline) {
        this.setDeleteDistributionInline(false)
        next();
      }
      else $('#mandatoryModal').modal({ show: true });
    } else {
      // if there are multiple distributions, the mandatory checker might return true so we don't have to skip the modal display
      // but we have to set the deleteDistributionInline value to false again
      this.setDeleteDistributionInline(false)
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
