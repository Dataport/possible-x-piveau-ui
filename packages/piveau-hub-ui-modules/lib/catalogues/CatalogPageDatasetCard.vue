<template>
    <div class="cp-dataset-card d-flex flex-column">
      <div class="cp-dataset-card-caption">
        <em>Empfehlung vom Datenbereitsteller</em>
      </div>
      <div class="cp-dataset-card-container d-flex flex-column justify-content-between">
          <div class="cp-dataset-card-text">
            <span class="cp-dataset-card-header">{{ datasetTitle }}</span><br>
  
            <p v-if="datasetDescription" class="cp-dataset-card-description">
              {{ descriptionMaxLength ? truncatedDescription : datasetDescription }}
            </p>
            <span v-else class="cp-dataset-card-description text-muted font-italic m-0" data-cy="dataset-description">
                {{ $t("message.catalogsAndDatasets.noDescriptionAvailable") }}
            </span>
          </div>
          <div class="cp-dataset-card-icon" role="button">
            <app-link :to="to">
              <img src="../assets/icon/icon-nextcircled.svg" alt="Zum Datensatz">
            </app-link>
          </div>

        </div>
    </div>
</template>

<script>
import AppLink from "../widgets/AppLink";
  import { getTranslationFor, truncate } from '../utils/helpers';
    export default {
        name: "DatasetCard",
        components: {
            AppLink,
        },
        props: {
        /**
         * The dataset details to display.
         */
        datasetTitle: String,
        datasetDescription: String,
        datasetCatalog: String,

        /**
         * The route to navigate to when clicking on the dataset.
         */
        to: {
          type: String,
          required: true,
        },

        /**
         * Specified the maximum length of the description before it is cut off.
         */
        descriptionMaxLength: {
          type: Number,
          default: 200,
        },

        cardIcon: String
      },
      computed: {
        truncatedDescription() {
          return this.descriptionMaxLength && truncate(this.datasetDescription, this.descriptionMaxLength);
        },
      },
      methods: {
          getTranslationFor,
      },
    }
</script>

<style lang="scss">
  .cp-dataset-card {
    padding: 25px;
    margin: 10px;
    height: 500px;
    width: 300px;
    border-radius: 12px;
    background-color: #F0EDED;
  }
  .cp-dataset-card-caption {
    font-size: 13px;
  }

  .cp-dataset-card-container {
    height: calc(100% - 20px);
  }
  .cp-dataset-card-text {
    margin-top: 80px;
    overflow: auto;
    margin-bottom: 15px;
  }

  .cp-dataset-card-header {
    font-size: 24px;
    line-height: 125%;
  }

  .cp-dataset-card-description {
    font-size: 16px;
    margin-top: 10px;
  }

  .cp-dataset-card-icon {
    text-align: end;
  }
  .cp-dataset-card-icon img {
    width: 25px;
    // filter: invert(15%) sepia(70%) saturate(2488%) hue-rotate(188deg) brightness(95%) contrast(102%);
  }
</style>