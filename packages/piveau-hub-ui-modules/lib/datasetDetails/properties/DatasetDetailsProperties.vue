<template>
  <div class="mt-5 dsd-properties">
    <div class="col-12 mb-2 p-0 dsd-properties-list">
      <dataset-details-feature-header
        :title="$t('message.datasetDetails.additionalInfo')"
        :arrowDown="!infoVisible"
        tag="additional-information-toggle"
        :onClick="toggleInfo"
      />
      <div class="position-relative dsd-item additional-information"
           data-cy="additional-information"
           v-show="infoVisible">
        <table class="table table-borderless table-responsive" ref="dsdProperties" role="tablist" id="myTab">
            <dataset-details-property v-for='(name, index) in fieldsArray'
              :name="name"
              :translate="fieldSchema[name]?.translate"
              :type="fieldSchema[name]?.type"
              :fields="fieldSchema[name]?.fields"
              :track="fieldSchema[name]?.track"
              :itemstyles="fieldSchema[name]?.itemstyles"
              :preTransform="fieldSchema[name]?.preTransform"
              :transform="fieldSchema[name]?.transform"
              :key="index"/>
        </table>
        <div class="additional-information-overlay" ref="overlay" v-show="showMoreVisible && !expanded"></div>
      </div>
    </div>
    <pv-show-more
      v-if="showMoreVisible"
      :label="expanded? $t('message.metadata.showLess') : $t('message.metadata.showMore')"
      :upArrow="expanded"
      :action="toggleExpanded"
      class="row text-primary"
    />
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import DatasetDetailsProperty from "./DatasetDetailsProperty";
import {dcatDeFields, dcatFields, dcatSchema, dcatDeSchema} from "./specification.ts";

export default {
  name: "DatasetDetailsProperties",
  components: {
    DatasetDetailsProperty
  },
  data() {
    return {
      infoVisible: true,
      initialHeight: 0,
      restrictedHeight: 100,
      expanded: false,
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getDatasetDescriptionHeight'
    ]),
    fieldSchema() {
      return Object.assign(dcatSchema(this.$i18n.t), dcatDeSchema())
    },
    fields() {
      let properties = this.$env.content?.datasetDetails?.properties;
      if (!properties || properties === "") {
        properties = dcatFields;
        if (this.$env.content.dataProviderInterface.specification === 'dcatapde') {
          properties += "," + dcatDeFields;
        }
      }
      return properties;
    },
    fieldsArray() {
      return this.fields.split(',').map(item => item.trim());
    },
    showMoreVisible() {
      return this.initialHeight > this.restrictedHeight;
    }
  },
  methods: {
    toggleInfo() {
      this.infoVisible = !this.infoVisible;
    },
    toggleExpanded() {
      this.expanded = ! this.expanded;
      this.adaptHeight();
    },
    adaptHeight() {
      this.$refs.dsdProperties.style['flex'] = this.expanded ? "0 0 100%": `0 0 ${this.restrictedHeight}px`;
      this.$refs.dsdProperties.style['max-height'] = this.expanded ? "100%": `${this.restrictedHeight}px`;
      // this.$refs.dsdProperties.style['overflow-y'] = this.expanded ? "auto": "hidden";
    }
  },
  mounted() {
    this.initialHeight = this.$refs.dsdProperties.clientHeight;
    this.$refs.overlay.style.bottom = (this.$refs.dsdProperties.offsetHeight - this.$refs.dsdProperties.clientHeight) + "px";
    if (this.getDatasetDescriptionHeight >= this.initialHeight) {
      this.restrictedHeight = this.getDatasetDescriptionHeight;
      this.toggleExpanded()
    } else if ((this.getDatasetDescriptionHeight >= this.restrictedHeight) && (this.getDatasetDescriptionHeight <= this.initialHeight)) {
      this.restrictedHeight = this.getDatasetDescriptionHeight
    }
    this.adaptHeight();
  }
}
</script>

<style scoped lang="scss">
.arrow {
  cursor: pointer;
}

.additional-information-overlay {
  width: 100%;
  height: 100px;
  position: absolute;
  left: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 0, white 100%);
  pointer-events: none;
}
table {
  background: #F5F5F5;
}

</style>
