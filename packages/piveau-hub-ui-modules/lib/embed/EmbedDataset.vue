<template>
  <div class="embed-dataset d-flex flex-column overflow-auto">
       <div class="embed-header px-5 py-4 d-flex flex-row justify-content-between">
           <div>
               <img class="logo" src="../assets/img/ec-logo.png" />
           </div>
           <div class="openUrl align-self-end">
               <button @click="openUrl" class="ecl-button ecl-button--secondary mt-3" type="button"><svg class="mr-3" xmlns="http://www.w3.org/2000/svg" width="22" height="21"><path fill="#123F94" d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/></svg>Open Dataset</button>
           </div>
       </div>
       <div class="headline">
           <p class="px-5 py-3 m-0">data.europa.eu  - The official portal for European data</p>
       </div>
       <div class="p-5">
            <dataset-details-header-title 
              titleFontSize="0.75rem"
            />
            <div  class="mb-5">
                <dataset-details-header-catalogue 
                    :disableLink="true"
                    catalogueNameFontSize="1rem"
                />
             </div>
                <dataset-details-dataset
                    :showDatasetDescription="false"
                    :showDatasetProperties="false"
                    :showPublisher="true"
                    :embed="true"
                />   
       </div>
  </div>
</template>

<script>
import DatasetDetailsHeaderTitle from "../datasetDetails/header/DatasetDetailsHeaderTitle"
import DatasetDetailsDataset from "../datasetDetails/DatasetDetailsDataset.vue"
import DatasetDetailsHeaderCatalogue from "../datasetDetails/header/DatasetDetailsHeaderCatalogue.vue"
import { mapGetters } from "vuex";

export default {
  name: 'EmbedDataset',
  created() {},
  components: {
      DatasetDetailsHeaderTitle, DatasetDetailsDataset, DatasetDetailsHeaderCatalogue
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getLanguages',
      'getTitle',
    ]),
  },
  methods: {
      openUrl() {
        const url = window.location.href.split('/embed')[0];
        window.open(url, '_blank');
      }
  }
};
</script>

<style scoped>
.embed-dataset {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white; /* Semi-transparent background */
  display: flex;
  color: black;
  z-index: 99; /* Ensure it's above other content */
}
.logo {
    width: 290px;
    height: 70px;
}
.headline {
    background: #123F94;
    color: white;
    font-size: 24px;
}
.dsd-title-tag {
    display: none!important;
}

@media screen and (max-width: 600px) {
  .embed-header {
      flex-direction: column!important;
      justify-content: flex-start!important;
  }
  .openUrl {
      align-self: auto!important;
  }
}
</style>




