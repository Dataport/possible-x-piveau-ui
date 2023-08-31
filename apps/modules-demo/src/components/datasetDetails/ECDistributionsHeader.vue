<template>
  <div class="dsd-item d-flex flex-column">
    <div class="row justify-content-between">
      <h2 :title="$t('message.tooltip.datasetDetails.distribution')"
          class="mb-lg-4"
          data-toggle="tooltip"
          data-placement="top"
          data-cy="dataset-distributions"
          :style="{ fontSize: embed ? '1.5rem' : '' }"
      >
        {{ $t('message.metadata.distributions') }} ({{ getDistributions ? getDistributions.length.toLocaleString('fi') : 0 }})
      </h2>
      <div v-if="showPublisher">
        <property-value
          :property="$t('message.metadata.publisher')"
          :tooltip="$t('message.tooltip.datasetDetails.publisher')"
          :value="getPublisherName"
          class="publisher"
      />
      </div>
    </div>
    <div class="d-none d-md-flex distributions-list-top"
       :style="{ fontSize: embed ? '1rem' : '' }"
    >
      <div id="description"><div><span>Link to the data</span></div></div>
      <div id="format"><div><span>Format</span></div></div>
      <div id="added" class="d-none d-md-block"><div><span>{{ $t('message.metadata.updated') }}</span></div></div>
      <div id="actions"><div><span>Actions</span></div></div>
    </div>
  </div>
</template>

<script>
import { has, isNil } from 'lodash-es';
import { mapGetters } from "vuex";
import { PropertyValue } from "@piveau/piveau-hub-ui-modules";

export default {
  name: "ECDistributionsHeader",
  props: [
    'showPublisher', 'embed'
  ],
  components: {
    PropertyValue
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getDistributions',
       'getPublisher'
    ]),
    getPublisherName() {
      if (has(this.getPublisher, 'name') && !isNil(this.getPublisher.name)) {
        return this.getPublisher.name;
      } else {
        return "";
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.distributions-list-top {
  background-color: #f2f4f8;
  > div {
    font-weight: bold;
    > div {
      padding: 1rem;
      > span {
        white-space: nowrap;
      }
    }
  }
}

#description {
  flex: 12 0;
}

#format {
  flex: 2 0;
  display: flex;
  justify-content: flex-start;

}

#added {
  flex: 0 0 160px;
  > div {
    padding-left: 0;
    padding-right: 0;
    display: flex;
    justify-content: center;
  }
}

#actions {
  flex: 0 0 200px;
}
div#format div{
    padding-left: 0;
}
.publisher {
  font-size: 18px;
}
@media (min-width: 992px) { // lg
  #actions {
    flex: 0 0 350px;
    padding-left: 0.5rem !important;
  }
}

</style>
