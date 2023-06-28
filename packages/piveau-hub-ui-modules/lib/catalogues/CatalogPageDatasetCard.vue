<template>
    <div class="cp-dataset-card pink d-flex flex-column justify-content-between">
        <div class="cp-dataset-card-image">
        <img :src="getImageUrl()" alt="">
        </div>
        <div class="cp-dataset-card-text">
          <span class="cp-dataset-card-header">{{ datasetTitle }}</span><br>
          <span class="cp-dataset-card-subheader">{{ datasetCatalog }}</span><br><br>

          <p v-if="datasetDescription" class="cp-dataset-card-subtitle">
            {{ descriptionMaxLength ? truncatedDescription : datasetDescription }}
          </p>
          <span v-else>
            <p class="cp-dataset-card-subtitle text-muted font-italic m-0" data-cy="dataset-description">
              {{ $t("message.catalogsAndDatasets.noDescriptionAvailable") }}
            </p>
          </span>
        </div>
        <div class="cp-dataset-card-icon" role="button">
          <app-link :to="to">
            <img src="../assets/icon/icon-nextcircled.svg" alt="Zum Datensatz">
          </app-link>
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
          getImageUrl() {
            return new URL(`../assets/img/${this.cardIcon}`, import.meta.url)
          },
      },
    }
</script>

<style lang="scss" scoped>
  .cp-dataset-card {
    padding: 25px;
    margin: 10px;
    height: 480px;
    width: 300px;
    border-radius: 12px;
  }
  .cp-dataset-card-image {
    margin-bottom: 70px;
  }
  .cp-dataset-card.blue {
    background-color: #E4F5FF;
  }
  .cp-dataset-card.yellow {
    background-color: #FFF9D0;
  }
  .cp-dataset-card.pink {
    background-color: #F0EDED;
  }

  .cp-dataset-card-text {
    /* margin-top: 60px; */
  }

  .cp-dataset-card-header {
    font-family: 'Noto Sans Bold';
    font-size: 24px;
    line-height: 125%;
  }

  .cp-dataset-card-subheader {
    font-family: 'Noto Sans Italic';
    font-size: 13px;
    line-height: 150%;
  }

  .cp-dataset-card-subtitle {
    font-size: 16px;
  }

  .cp-dataset-card-icon {
    align-self: flex-end;
  
  }
  .cp-dataset-card-icon img {
    width: 150%;
    filter: invert(15%) sepia(70%) saturate(2488%) hue-rotate(188deg) brightness(95%) contrast(102%);
  }
</style>