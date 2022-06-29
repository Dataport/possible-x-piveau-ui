<template>
  <div>
    <div class="dist-list">
      <h3>{{ $t('message.metadata.distributions') }}</h3>
      <hr>
      <ul class="list-unstyled" v-if="distributionData.length > 0">
        <li v-for="(dist, i) in distributionData" :key="i" class="dist-item">
          <div class="pr-md-4">
            <div class="circle float-md-right text-center text-white" :type='dist.format'><span>{{ truncate(dist.format, 4, true) }}</span></div>
          </div>
          <div class="dist-details">
            <div class="dist-info">
              <span style="font-weight: bold">{{ dist.title }}</span><br />
              <span style="color: #868e96">{{ dist.description }}</span>
            </div>
            <div class="dist-edit">
              <span @click="redirectToDistributionForm(i)" class="dist-edit-button">{{ $t('message.datasetDetails.edit') }}</span>
              <span @click="triggerDeleteModal(i)" class="dist-delete-button">&times;</span>
            </div>
          </div>
        </li>
      </ul>
      <ul v-else class="list-unstyled">
        <li>{{ $t('message.dataupload.noDistributions') }}</li>
      </ul>
      <button @click="newSubrouting" class="default" v-if="distributionOverviewPage">{{ $t('message.dataupload.newDistribution') }}</button>
    </div>
    <div class="modal fade" id="deleteDistributionModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true" data-cy="citation-modal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title" id="deleteModalLabel">
              {{ $t('message.dataupload.deletemodal.deleteDistribution') }}
            </h2>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h3>{{$t('message.dataupload.deletemodal.areyousure')}}</h3>
            <div class="mt-3 d-flex justify-content-start align-items-center">
              <div class="dist-details">
                <div class="dist-info">
                  <span style="font-weight: bold" v-if="distributionData">{{ getDistributionDetailsForDelete('title') }}</span><br />
                  <span style="color: #868e96" v-if="distributionData">{{ getDistributionDetailsForDelete('description') }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button data-dismiss="modal" id="cancel">{{ $t('message.datasetDetails.datasets.modal.cancel') }}</button>
            <button @click="deleteDistribution" id="delete">{{ $t('message.datasetDetails.delete') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import { isEmpty } from 'lodash';
import { helpers } from '@/modules';
const { truncate } = helpers;

export default {
  props: ['distributionOverviewPage'],
  data() {
    return {
      distributionToDelete: 1,
      distributionData: [],
    };
  },
  methods: {
    truncate,
    deleteDistribution() {
      const distributionKeys = Object.keys(localStorage).filter(dataset => (dataset.startsWith('inputValues_')
        && dataset.includes('distribution')
        && dataset.endsWith(this.distributionToDelete)));

      for (let valueIndex = 0; valueIndex < distributionKeys.length; valueIndex += 1) {
        localStorage.removeItem(distributionKeys[valueIndex]);
      }

      // Reindex other distribution values
      const numberOfDistributions = JSON.parse(localStorage.getItem('numberOfDistributions'));
      if (this.distributionToDelete < numberOfDistributions) {
        const valueNames = Object.keys(localStorage).filter(dataset => (dataset.startsWith('inputValues_') && dataset.includes('distribution')));
        for (let nameIndex = 0; nameIndex < valueNames.length; nameIndex += 1) {
          const currentValueName = valueNames[nameIndex];
          const distIndex = currentValueName[currentValueName.length - 1];
          if (distIndex > this.distributionToDelete) {
            const newValueName = `${currentValueName.slice(0, currentValueName.length - 1)}${distIndex - 1}`;
            const currentData = JSON.parse(localStorage.getItem(currentValueName));
            localStorage.removeItem(currentValueName);
            localStorage.setItem(newValueName, JSON.stringify(currentData));
          }
        }
      }

      if (numberOfDistributions !== 1) localStorage.setItem('numberOfDistributions', JSON.stringify(numberOfDistributions - 1));
      localStorage.setItem('currentDistribution', JSON.stringify(1));

      $('#deleteDistributionModal').modal('hide');

      this.$router.push(`${this.$env.upload.basePath}/${this.$route.params.property}/step3/distribution4`);
    },
    triggerDeleteModal(index) {
      this.distributionToDelete = index + 1;
      $('#deleteDistributionModal').modal({ show: true });
    },
    newSubrouting() {
      this.$root.$emit('newSubrouting');
    },
    getDistributionValues(valueName, data) {
      let value = data[valueName].filter(dataset => dataset['@language'] === this.$i18n.locale).map(dataset => dataset['@value'])[0];
      if (isEmpty(value)) {
        value = data[valueName].filter(dataset => dataset['@language'] === this.$i18n.fallbackLocale).map(dataset => dataset['@value'])[0];
        if (isEmpty(value)) {
          value = data[valueName][0]['@value'];
        }
      }
      return value;
    },
    redirectToDistributionForm(distributionIndex) {
      localStorage.setItem('currentDistribution', distributionIndex + 1);
      this.$router.push(`${this.$env.upload.basePath}/${this.$route.params.property}/${this.$env.upload.input[this.$route.params.property].subroutingStepEntry}`).catch(() => {});
    },
    getDistributionDetailsForDelete(parameter) {
      if (!isEmpty(this.distributionData)) return this.distributionData[this.distributionToDelete - 1][parameter];
      return '';
    },
  },
  computed: {
    getDistributionsFromLocalStorage() {
      const distNumber = JSON.parse(localStorage.getItem('numberOfDistributions'));
      const distributions = [];
      for (let distIndex = 1; distIndex <= distNumber; distIndex += 1) {
        const name = `inputValues_${this.$route.params.property}_${this.$route.params.page}_distribution1_${distIndex}`;
        const data = JSON.parse(localStorage.getItem(name));
        if (!isEmpty(data)) {
          const details = {
            title: this.getDistributionValues('dct:title', data),
            description: this.getDistributionValues('dct:description', data),
            format: data['dct:format'] ? data['dct:format'] : 'UNKNOWN',
          };
          distributions.push(details);
        }
      }
      return distributions;
    },
  },
  created() {
    this.distributionData = this.getDistributionsFromLocalStorage;
  },
};
</script>

<style lang="scss" scoped>
.circle {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  padding: 20px 0;
  font-size: 12px;
  line-height: 1px;
  border-radius: 50%;
  background-color: #595959;
  &[type="HTML"] {
    background-color: #285C76;
  }
  &[type="JSON"] {
    background-color: var(--dark-orange);
  }
  &[type="XML"] {
    background-color: #8F4300;
  }
  &[type="TXT"] {
    background-color: #2B5E73;
  }
  &[type="CSV"] {
    background-color: var(--badge-green);
  }
  &[type="XLS"] {
    background-color: #1A6537;
  }
  &[type="ZIP"] {
    background-color: #252525;
  }
  &[type="API"] {
    background-color: #923560;
  }
  &[type="PDF"] {
    background-color: #B30519;
  }
  &[type="SHP"] {
    background-color: var(--badge-black);
  }
  &[type="RDF"],
  &[type="NQUAD"],
  &[type="NTRIPLES"],
  &[type="TURTLE"] {
    background-color: #0b4498;
  }
}

.dist {
  &-list {
    margin: 50px;
  }
  &-details {
    display: flex;
    flex: 1;
  }
  &-edit {
    width: 25%;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-left: 5px;
    &-button {
        cursor:pointer;
    }
  }
  &-info {
    width: 75%;
  }
  &-item {
    margin: 5px;
    display: flex;
    padding: 20px;
    align-items: center;
    border-bottom: .1em solid #e5e5e5;
  }
  &-delete{
    &-button {
    cursor: pointer;
    font-size:18pt;
    }
  }
}

button {
  &#delete {
    background-color: #B30519;
    color: #fff;
    border-color: #B30519;
  }
  &#cancel {
    background-color: #767676;
    border-color: #767676;
    color: #fff;
  }
  &.default {
    background-color: #001d85;
    border-color: #001d85;
    color: #fff;
  }
  border-radius: 0.3em;
  font-size: 16px;
  font-family: "Ubuntu";
  padding: 0.75em;
  font-weight: 100;
}
</style>
