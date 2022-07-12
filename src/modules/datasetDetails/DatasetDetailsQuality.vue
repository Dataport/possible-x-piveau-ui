<template>
  <div class="mt-3">
    <div class="row">
      <div class="col-10 offset-1" v-if="getQualityData.result && getQualityDistributionData.result">
        <h2>{{ $t('message.header.navigation.data.metadataquality') }}</h2>
          <div class="markdown-content">
          <p v-html="$t('message.datasetDetails.intro.metadataQuality', { locale: $route.query.locale })"></p>
        </div>
        <div class="space card-columns" v-if="getQualityData.result">
          <div v-for="(value,name) in getQualityData.result.results[0]" :key="`A-${name}`">
            <div :class="`dimension-card card dimension-${name}`" v-if="name != 'info'">
              <div class="card-header card-title text-center">
                <h3>{{ $t(`message.datasetDetails.quality.${name}`) }}</h3>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(value, key) in value" :key="`B-${key}`">
                  <div class="row key-row">
                    <div class="col" v-for="(value, key) in value" :key="`C-${key}`">
                      <div v-if="key == 'dataset'">
                        <div v-for="(value, key) in value" :key="`D-${key}`">
                          <div
                            v-for="(value, key) in value"
                            class="dataset-space"
                            :key="`E-${key}`"
                          >
                            <i class="material-icons align-text-bottom small-icon has-tooltip"
                              data-toggle="tooltip"
                              data-placement="right"
                              data-html="true"
                              :title="$t(`message.tooltip.quality.${key}`)">
                              info_outline
                            </i>
                            {{ $t('message.header.navigation.data.datasets') }}: {{ $t(`message.datasetDetails.quality.${key}`) }}
                          </div>
                        </div>
                      </div>
                      <div v-else-if="key == 'distributions'">
                        <div v-for="(value, key) in value" :key="`F-${key}`">
                          <div
                            v-for="(value, key) in value"
                            class="dataset-space"
                            :key="`H-${key}`"
                          >
                            <i class="material-icons align-text-bottom small-icon has-tooltip"
                              data-toggle="tooltip"
                              data-placement="right"
                              data-html="true"
                              :title="$t(`message.tooltip.quality.${key}`)">
                              info_outline
                            </i>
                            {{ $t('message.metadata.distributions') }}: {{ $t(`message.datasetDetails.quality.${key}`) }}
                          </div>
                        </div>
                      </div>
                      <span v-else>
                         <i class="material-icons align-text-bottom small-icon has-tooltip"
                            data-toggle="tooltip"
                            data-placement="right"
                            data-html="true"
                            :title="$t(`message.tooltip.quality.${key}`)">
                            info_outline
                          </i>
                        {{ $t(`message.datasetDetails.quality.${key}`) }}
                      </span>
                    </div>
                    <div v-for="(value, key) in value" :key="`I-${key}`" >
                      <div v-if="value.length == 0" class="col-auto text-right">
                        <span class="badge-no">n/a</span>
                      </div>
                      <div v-else-if="key == 'accessUrlStatusCode'" class="col-auto text-right">
                        <div v-for="(value, key) in value" :key="`J-${key}`">
                          <div class="access-space values-container">
                            <div class="row">
                              <div class="col-auto">
                                <span :class="`badge-yes-${name}`">{{value.name}}</span>
                              </div>
                              <div class="col text-right">
                                <span class="access-percentage">{{value.percentage}} %</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-else-if="key == 'downloadUrlStatusCode'" class="col-auto text-right">
                        <div v-for="(value, key) in value" :key="`K-${key}`">
                          <div class="access-space">
                            <div class="row">
                              <div class="col-auto">
                                <span :class="`badge-yes-${name}`">{{value.name}}</span>
                              </div>
                              <div class="col text-right">
                                <span class="access-percentage">{{value.percentage}} %</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        v-else-if="key != 'dataset' && key != 'distributions' && value == false"
                        class="col-auto text-right"
                      >
                        <span class="badge-no">no</span>
                      </div>
                      <div
                        v-else-if="key != 'dataset' && key != 'distributions' && value == true"
                        class="col-auto text-right"
                      >
                        <span :class="`badge-yes-${name}`">yes</span>
                      </div>
                      <div
                        v-if="key != 'dataset' && key != 'distributions' && key != 'accessUrlStatusCode' && value.length == 2"
                        class="col-auto text-right"
                      >{{value[0].percentage}} %</div>
                      <div v-if="key == 'dataset'" class="col-auto text-right dataset-space">
                        <span v-if="getModificationDate.length == 0">
                          <span class="badge-n-a">n/a</span>
                        </span>
                        <span v-else :class="`badge-yes-${name}`">yes</span>
                      </div>

                      <div
                        v-if="key == 'dataset' && value[1].dateIssuedAvailability == false"
                        class="col-auto text-right"
                      >
                        <div class="dataset-space">
                          <span class="badge-no">no</span>
                        </div>
                      </div>
                      <div
                        v-if="key == 'dataset' && value[1].dateIssuedAvailability == true"
                        class="col-auto text-right"
                      >
                        <div class="dataset-space">
                          <span :class="`badge-yes-${name}`">yes</span>
                        </div>
                      </div>
                      <div v-if="key == 'distributions'" class="col-auto text-right dataset-space">
                        <span v-if="Object.keys(value[0].dateModifiedAvailability).length == 0">
                          <span class="badge-n-a">n/a</span>
                        </span>
                        <span v-else>{{value[0].dateModifiedAvailability[0].percentage}} %</span>
                      </div>
                      <div v-if="key == 'distributions'" class="col-auto text-right dataset-space">
                        <span v-if="Object.keys(value[1].dateIssuedAvailability).length == 0">
                          <span class="badge-n-a">n/a</span>
                        </span>
                        <span v-else>{{value[1].dateIssuedAvailability[0].percentage}} %</span>
                      </div>
                    </div>
                  </div>
                  <!-- <div v-for="(value, key) in value" :key="`L-${key}`">
                    <div
                      v-if="key != 'dataset' && key != 'distributions' && key != 'accessUrlStatusCode' && value.length == 2"
                      :class="`progress dimension-${name}`"
                      style="height: 2px;"
                    >
                      <div
                        class="progress-bar quality"
                        role="progressbar"
                        :style="`width:${value[0].percentage}%`"
                      ></div>
                    </div>
                  </div> -->
                </li>
              </ul>
            </div>
          </div>
        </div>
        <h2 class="mt-5">{{ $t('message.datasetDetails.quality.distributionQuality') }}</h2>
        <div class="markdown-content">
          <p v-html="$t('message.datasetDetails.intro.distribution', { locale: $route.query.locale })" />
        </div>
        <div v-if="getQualityDistributionData.result" id="YEAH">
          <div id="accordion" class="space" v-if="showLess">
            <div
              v-for="(value, key) in getQualityDistributionData.result.results.slice(0, 4)"
              class="card"
              :key="`B-${key}`"
            >
              <div class="card-header distribution" id="headingFirst"
                @click="clickHandler(key)"
                data-toggle="collapse"
                :data-target="`#${value[0].info['distribution-id']}`"
                aria-expanded="false"
                :aria-controls="`#${value[0].info['distribution-id']}`">
                <h3
                  class="mb-0"
                >
                  <div class="row dist">
                    <div class="col-10">
                      <div class="dist-head">{{value[0].info["distribution-title"]}}</div>
                    </div>
                    <div class="col-2">
                      <!-- <div class="badge badge-light format">XML</div> -->
                      <div
                        class="float-right small-arrow"
                        v-bind:class="{ active: key === activeItem}"
                      >
                        <svg
                          width="12px"
                          height="12px"
                          viewBox="0 0 16 16"
                          class="bi bi-chevron-down text-light"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </h3>
              </div>
              <div
                :id="`${value[0].info['distribution-id']}`"
                class="collapse"
                :aria-labelledby="`${value[0].info['distribution-id']}`"
                data-parent="#accordion"
              >
                <div class="card-body dist-content">
                  <div class="row" v-for="(value,key) in value[0]" :key="`N-${key}`">
                    <div class="col-12 space move" v-if="key != 'info'">
                      <div
                        class="dimension-headline"
                      >{{ $t(`message.datasetDetails.quality.${key}`) }}</div>
                      <div class="row">
                        <div class="col-md-6">
                          <ul class="keys">
                            <li
                              class="list-group-item keys"
                              v-for="(value,index) in value.slice(0, 2)"
                              :key="`O-${index}`"
                            >
                              <!-- <li class="list-group-item keys" v-if="index <= 1">  -->
                              <div class="row">
                                <div class="col" v-for="(value,key) in value" :key="`P-${key}`">
                                  <span
                                    v-if="key == 'accessUrlStatusCode' || key == 'downloadUrlStatusCode'"
                                  >{{ $t(`message.datasetDetails.quality.distributions.${key}`) }}</span>
                                  <span v-else>{{ $t(`message.datasetDetails.quality.${key}`) }}</span>
                                </div>
                                <div v-for="(value,key) in value" :key="`Q-${key}`">
                                  <div class="col-auto text-right" v-if="value == false">
                                    <span class="badge-no">no</span>
                                  </div>
                                  <div class="col-auto text-right" v-else-if="value == true">
                                    <span :class="`badge-yes`">yes</span>
                                  </div>
                                  <div
                                    class="col-auto text-right"
                                    v-else-if="isAccessAndDownloadUrlStatusCodeAvailable(key, value)"
                                  >
                                    <span :class="`badge-yes`">{{value}}</span>
                                  </div>
                                  <div class="col-auto text-right" v-else>
                                    <span :class="`badge-n-a`">n/a</span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div class="col-md-6">
                          <ul class="keys">
                            <li
                              class="list-group-item keys"
                              v-for="(value,index) in value.slice(2)"
                              :key="`S-${index}`"
                            >
                              <!-- <li class="list-group-item keys" v-if="index <= 1">       -->
                              <div class="row">
                                <div class="col" v-for="(value,key) in value" :key="`R-${key}`">
                                  <span
                                    v-if="key == 'accessUrlStatusCode' || key == 'downloadUrlStatusCode'"
                                  >{{ $t(`message.datasetDetails.quality.distributions.${key}`) }}</span>
                                  <span v-else>{{ $t(`message.datasetDetails.quality.${key}`) }}</span>
                                </div>
                                <div v-for="(value,key) in value" :key="`t-${key}`">
                                  <div class="col-auto text-right" v-if="value == false">
                                    <span class="badge-no">no</span>
                                  </div>
                                  <div class="col-auto text-right" v-else-if="value == true">
                                    <span :class="`badge-yes`">yes</span>
                                  </div>
                                  <div
                                    class="col-auto text-right"
                                    v-else-if="isAccessAndDownloadUrlStatusCodeAvailable(key, value)"
                                  >
                                    <span :class="`badge-yes`">{{value}}</span>
                                  </div>
                                  <div class="col-auto text-right" v-else>
                                    <span :class="`badge-n-a`">n/a</span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 text-center" v-if="getQualityDistributionData.result.count >= 6">
            <button class="btn btn-light mt-3 text-center" @click="showLess = false"> {{ $t(`message.metadata.showMore`) }} <i class="material-icons align-middle small-icon">keyboard_arrow_down</i> </button>
            </div>
          </div>
          <div id="accordion" class="space" v-else>
            <div
              v-for="(value, key) in getQualityDistributionData.result.results"
              class="card"
              :key="`B-${key}`"
            >
              <div
              class="card-header distribution"
              id="headingFirst"
              data-toggle="collapse"
              :data-target="`#${value[0].info['distribution-id']}`"
              aria-expanded="false"
              :aria-controls="`#${value[0].info['distribution-id']}`"
              @click="clickHandler(key)">
                <h3
                  class="mb-0"
                >
                  <div class="row dist">
                    <div class="col-10">
                      <div class="dist-head">{{value[0].info["distribution-title"]}}</div>
                    </div>
                    <div class="col-2">
                      <!-- <div class="badge badge-light format">XML</div> -->
                      <div
                        class="float-right small-arrow"
                        v-bind:class="{ active: key === activeItem}"
                      >
                        <svg
                          width="12px"
                          height="12px"
                          viewBox="0 0 16 16"
                          class="bi bi-chevron-down text-light"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </h3>
              </div>
              <div
                :id="`${value[0].info['distribution-id']}`"
                class="collapse"
                :aria-labelledby="`${value[0].info['distribution-id']}`"
                data-parent="#accordion"
              >
                <div class="card-body dist-content">
                  <div class="row" v-for="(value,key) in value[0]" :key="`N-${key}`">
                    <div class="col-12 space move" v-if="key != 'info'">
                      <div
                        class="dimension-headline"
                      >{{ $t(`message.datasetDetails.quality.${key}`) }}</div>
                      <div class="row">
                        <div class="col-md-6">
                          <ul class="keys">
                            <li
                              class="list-group-item keys"
                              v-for="(value,index) in value.slice(0, 2)"
                              :key="`O-${index}`"
                            >
                              <!-- <li class="list-group-item keys" v-if="index <= 1">  -->
                              <div class="row">
                                <div class="col" v-for="(value,key) in value" :key="`P-${key}`">
                                  <span
                                    v-if="key == 'accessUrlStatusCode' || key == 'downloadUrlStatusCode'"
                                  >{{ $t(`message.datasetDetails.quality.distributions.${key}`) }}</span>
                                  <span v-else>{{ $t(`message.datasetDetails.quality.${key}`) }}</span>
                                </div>
                                <div v-for="(value,key) in value" :key="`Q-${key}`">
                                  <div class="col-auto text-right" v-if="value == false">
                                    <span class="badge-no">no</span>
                                  </div>
                                  <div class="col-auto text-right" v-else-if="value == true">
                                    <span :class="`badge-yes`">yes</span>
                                  </div>
                                  <div
                                    class="col-auto text-right"
                                    v-else-if="isAccessAndDownloadUrlStatusCodeAvailable(key, value)"
                                  >
                                    <span :class="`badge-yes`">{{value}}</span>
                                  </div>
                                  <div class="col-auto text-right" v-else>
                                    <span :class="`badge-n-a`">n/a</span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div class="col-md-6">
                          <ul class="keys">
                            <li
                              class="list-group-item keys"
                              v-for="(value,index) in value.slice(2)"
                              :key="`S-${index}`"
                            >
                              <!-- <li class="list-group-item keys" v-if="index <= 1">       -->
                              <div class="row">
                                <div class="col" v-for="(value,key) in value" :key="`R-${key}`">
                                  <span
                                    v-if="key == 'accessUrlStatusCode' || key == 'downloadUrlStatusCode'"
                                  >{{ $t(`message.datasetDetails.quality.distributions.${key}`) }}</span>
                                  <span v-else>{{ $t(`message.datasetDetails.quality.${key}`) }}</span>
                                </div>
                                <div v-for="(value,key) in value" :key="`t-${key}`">
                                  <div class="col-auto text-right" v-if="value == false">
                                    <span class="badge-no">no</span>
                                  </div>
                                  <div class="col-auto text-right" v-else-if="value == true">
                                    <span :class="`badge-yes`">yes</span>
                                  </div>
                                  <div
                                    class="col-auto text-right"
                                    v-else-if="isAccessAndDownloadUrlStatusCodeAvailable(key, value)"
                                  >
                                    <span :class="`badge-yes`">{{value}}</span>
                                  </div>
                                  <div class="col-auto text-right" v-else>
                                    <span :class="`badge-n-a`">n/a</span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 text-center">
            <button class="btn btn-light mt-3 text-center" @click="showLess = true"> {{ $t(`message.metadata.showLess`) }}  <i class="material-icons align-middle small-icon">keyboard_arrow_up</i></button>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="isLoadingQualityData || isLoadingQualityDistributionData" class="loading-spinner mx-auto mb-4"></div>
      <div v-else class="col-10 offset-1 no-quality-data">
            <div class="no-qualitiy-data alert alert-secondary">
                <i class="fas fa-exclamation-circle"></i>
                 {{ $t('message.datasetDetails.quality.nodata') }}
            </div>
       </div>
      <div class="space"></div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery';
  import { mapActions, mapGetters } from 'vuex';
  import { has } from 'lodash';
  import { getTranslationFor } from "../utils/helpers";

  export default {
    name: 'datasetDetailsCategories',
    dependencies: 'DatasetService',
    metaInfo() {
      return {
        // title: this.$t('message.metadata.categories'),
        title: this.$t('message.datasetDetails.subnav.quality'),
        meta: [
          {
            name: 'description',
            vmid: 'description',
            content: (`${this.$t('message.datasetDetails.subnav.quality')} - ${this.getTranslationFor(this.getTitle, this.$route.query.locale, this.getLanguages)} - data.europa.eu`).substr(0, 4999),
          },
        ],
      };
    },
    data() {
      return {
        samplewidth: 20,
        isActive: false,
        activeItem: -1,
        showLess: true,
        isLoadingQualityData: false,
        isLoadingQualityDistributionData: false,
      };
    },
    computed: {
      // import store-getters
      ...mapGetters('datasetDetails', [
        'getLanguages',
        'getQualityData',
        'getQualityDistributionData',
        'getTitle',
        'getDistributions',
        'getPublisher',
        'getLicences',
        'getID',
        'getModificationDate',
      ]),
    },
    methods: {
      isAccessAndDownloadUrlStatusCodeAvailable(key, value) {
        return (key === 'accessUrlStatusCode' && typeof value !== 'object' && value.length !== 0) || (key === 'downloadUrlStatusCode' && typeof value !== 'object' && value.length !== 0);
      },
      clickHandler(idx) {
        if (this.activeItem > -1) {
          this.activeItem = -1;
        } else {
          this.activeItem = idx;
        }
      },
      has,
      getTranslationFor,
      // import store-actions
      ...mapActions('datasetDetails', [
        'loadDatasetDetails',
        'useService',
        'loadQualityData',
        'loadQualityDistributionData',
      ]),
    },
    created() {
      this.useService(this.DatasetService);
      this.$nextTick(() => {
        this.$Progress.start();
        this.isLoadingQualityData = true;
        this.isLoadingQualityDistributionData = true;
        this.loadDatasetDetails(this.$route.params.ds_id)
          .then(() => {
            this.$Progress.finish();
            $('[data-toggle="tooltip"]').tooltip({
              container: 'body',
            });
          })
          .catch(() => {
            this.$Progress.fail();
            this.$router.replace({
              name: 'NotFound',
              query: { locale: this.$route.query.locale, dataset: this.$route.params.ds_id },
            });
          });
        this.loadQualityData(this.$route.params.ds_id)
          .then(() => {
            this.$Progress.finish();
            this.isLoadingQualityData = false;
          })
          .catch(() => {
            this.$Progress.fail();
            this.isLoadingQualityData = false;
          });
        this.loadQualityDistributionData(this.$route.params.ds_id)
          .then(() => {
            this.$Progress.finish();
            this.isLoadingQualityDistributionData = false;
          })
          .catch(() => {
            this.$Progress.fail();
            this.isLoadingQualityDistributionData = false;
          });
      });
    },
    mounted() {
      $('[data-toggle="tooltip"]').tooltip({
        container: 'body',
      });
    },
  };
</script>

<style lang="scss" scoped>
  //@import '../../styles/bootstrap_theme';
  //@import '../../styles/utils/css-animations';

.dimension-card {
  // Default background color to be overwritten
  background-color: var(--gray);
  color: rgba(rgb(255, 255, 255), 1.00);
  border-radius: 4px;

  &.clickable {
    transition: transform .4s ease;

    &:hover {
    transition: transform .4s ease;
    transform: scale(1.01);
    }

    &::after {
      content: '';
      position: absolute;
      z-index: -1;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      transition: opacity .5s cubic-bezier(.25, .8, .25, 1);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.22);
      opacity: 0;
    }

    &:hover::after {
      opacity: 1;
    }
  }

  .list-group {
    .list-group-item {
      margin-bottom: -1px;
      border: 0;
      background: rgba(0, 0, 0, 0.12);
    }
  }

  .card-title {
    hyphens: auto;
    margin-top: 5px;
  }
}
.no-quality-data {
  // margin-left: -10px;
}

.space {
  margin-top: 20px;
}

.quality-dimension {
  color: #000;

}

.progress-bar {
  background-color: #ffffff;
}

.badge-no {
  background-color: rgba(0, 0, 0, 0.174);
  padding: 3px 14px 3px 14px;
  border-radius:3px;
}

.badge-n-a {
  background-color: rgba(0, 0, 0, 0.174);
  padding: 3px 11px 3px 12px;
  border-radius:3px;
}

.badge-yes-interoperability {
  padding: 3px 10px 3px 10px;
  border-radius:3px;
  background-color: #0024A7;
}
.badge-yes-findability {
  padding: 3px 10px 3px 10px;
  border-radius:3px;
  background-color: #00997A;
}
.badge-yes-accessibility {
  padding: 3px 10px 3px 10px;
  border-radius:3px;
  background-color: #4A82FA;
  margin-bottom: 3px;
}
.badge-yes-reusability {
  padding: 3px 10px 3px 10px;
  border-radius:3px;
  background-color:#DC5149;
}
.badge-yes-contextuality {
  padding: 3px 10px 3px 10px;
  border-radius:3px;
  background-color: #ffcc00;
}

@mixin gradient($colors...) {
  background-color: nth($colors, 1);
  background: -webkit-linear-gradient(left top, $colors);
  background: linear-gradient(to left top, $colors);
}

.dimension-accessibility {
  @include gradient(var(--deu-logo-medium-blue-gradient));
}

.dimension-findability {
  @include gradient(var(--deu-badge-green-gradient));
}

.dimension-interoperability {
  @include gradient(var(--deu-logo-blue-gradient));
}

.dimension-reusability {
  @include gradient(var(--deu-dark-orange-gradient));
}

.dimension-contextuality {
  @include gradient(var(--deu-logo-yellow-gradient));
}

.dimension-total {
  // background-color: $gray;
}

.dimension-scoring {
  background-image: var(--deu-badge-black-gradient);
}

.small-arrow {
  vertical-align: middle;
}

.card {
  border-radius: 5px !important;
}

.card-header {
    padding: 0.75rem 1.25rem;
    margin-bottom: 0;
   // background-color: rgba(0, 0, 0, 0.03);
    /* border-bottom: 1px solid rgba(0, 0, 0, 0.125); */
}

.btn-link {
  color: #fff;
}

.distribution {
   background: rgb(41,99,140);
   background: linear-gradient(90deg, rgba(41,99,140,1) 0%, rgba(33,71,115,1) 100%);
   cursor: pointer;
}

.dist-head {
  color: #fff;
  font-weight: 100;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  font-size: 17px;
  vertical-align: middle;
  margin-top: 2px;
}
.dist-content {
  background: #31668c;
  color: #fff;
}

#headingFirst {
 // "One" mit id "0" ersetzen aus index der For-Schleife
 border-radius: 2px;
}

.format {
  font-size: 12px;
  border-radius: 2px;
  color: rgb(58, 58, 58);
  // margin-top: 10px;
  margin-left: 0px;
  vertical-align: middle;
  margin-bottom: 2px;
}

.dist {
  padding: 3px;
}

.list-group-item {
    position: relative;
    display: block;
    padding: 0.75rem 1.25rem;
    margin-bottom: -1px;
    background-color: transparent;
    border: none;
}

.keys {
  padding-left: 0px !important;
  color: rgb(235, 235, 235);
  font-weight: 100;
}

.badge-yes {
  background-color:#407ca5;
  padding: 3px 10px 3px 10px;
  border-radius:3px;
}

.active {
   transform: rotate(180deg);
}

.bottom {
  margin-top: 60px;
}

.move {
  margin-left: 5px;
}

.dimension-dist {
  background-color: #407ca5;
}

.dimension-headline {
  font-size: 24px !important;
  margin-bottom: 15px;
}

.access-percentage {
  padding-left: 30px;
}

.access-space {
  margin-top: 6px;
  margin-bottom: 3px;
}

.dataset-space {
  margin-top:6px;
  margin-bottom: 3px;
}

.key-row {
  font-size: 17px;
}

@media (min-width: 876px) {
  .card-columns {
    column-count: 2;
    column-gap: 1.25rem;
    orphans: 1;
    widows: 1;
}
}

@media (max-width: 876px) {
  .card-columns {
    column-count: 1;
    column-gap: 1.25rem;
    orphans: 1;
    widows: 1;
}
}

#accordion {
  margin-bottom: 25px;
}

.values-container {
   margin-top: 0px;
}

</style>
