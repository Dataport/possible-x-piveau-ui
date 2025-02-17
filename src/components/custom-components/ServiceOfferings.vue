<template>
  <div class="page">
    <section class="main_section pt-5">
      <section>
        <h4>Service Offering ID</h4>
        <hr />
        <div class="id-container">
          <span class="id-text">{{ resourceDetailsData.id }}</span>
          <button class="copy-button" @click="copyId">
            Copy ID
          </button>
        </div>
        <div v-if="notificationVisible" class="notification">
          Service Offering ID Copied
        </div>
      </section>

      <section>
        <h4>Service Provider</h4>
        <hr />
        <div class="service-provider">
          <div>
            <span class="label">Organization Name:</span>
            <span>{{ serviceProviderName || 'Unknown Organization' }}</span>
          </div>
          <div>
            <span class="label">DID:</span>
            <span>{{ resourceDetailsData?.provided_by || 'Unknown DID' }}</span>
          </div>
        </div>
      </section>

      <section>
        <h4>Data Protection Regime</h4>
        <hr />
        <div class="tag_container">
          <div v-if="!resourceDetailsData.data_protection_regime || resourceDetailsData.data_protection_regime.length === 0">
            <span>None</span>
          </div>
          <div
            class="tag"
            v-else
            v-for="(regime, index) in resourceDetailsData.data_protection_regime"
            :key="index"
          >
            <span>{{ regime }}</span>
          </div>
        </div>
      </section>

      <section>
        <h4>Data Account Export</h4>
        <hr />
        <div class="tag_container">
          <div v-for="(account_export, index) in resourceDetailsData.data_account_export"
            :key="index">
            <div class="tag">
              <div>
                <span class="label">Format Type:</span>
                <span>{{ account_export.format_type }}</span>
              </div>
              <div>
                <span class="label">Access Type:</span>
                <span>{{ account_export.access_type }}</span>
              </div>
              <div>
                <span class="label">Request Type:</span>
                <span>{{ account_export.request_type }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h4>Terms and Conditions</h4>
        <hr />
        <div class="tag_container">
          <div v-for="(t_c, index) in resourceDetailsData.terms_and_conditions"
            :key="index">
            <div class="tag">
              <div>
                <span class="label">URL:</span>
                <span><a :href="t_c.url">{{ t_c.url }}</a></span>
              </div>
              <div>
                <span class="label">Hash:</span>
                <span>{{ t_c.hash }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h4>Service Offering Policy</h4>
        <hr />
        <div class="policy-container">
          <!-- DID Restriction -->
          <div v-if="convertedPolicies?.didRestriction?.length" class="policy-item">
            <span>Contracting is restricted to the following organizations:</span>
            <ul class="no-space">
              <li v-for="(did, index) in convertedPolicies.didRestriction" :key="index">
                Consumer org ({{ did }})
              </li>
            </ul>
          </div>

          <!-- Start Date Restriction -->
          <div v-if="convertedPolicies?.startDateRestriction" class="policy-item">
            <span>Contract duration is restricted to the following start date:</span>
            <ul class="no-space">
              <li>{{ convertedPolicies.startDateRestriction }}</li>
            </ul>
          </div>

          <!-- End Date Restriction -->
          <div v-if="convertedPolicies?.endDateRestriction" class="policy-item">
            <span>Contract duration is restricted to the following end date:</span>
            <ul class="no-space">
              <li>{{ convertedPolicies.endDateRestriction }}</li>
            </ul>
          </div>

          <!-- Offset Restriction -->
          <div v-if="convertedPolicies?.offsetRestriction" class="policy-item">
            <span>Transfer is restricted to the following period starting from the contract signing date:</span>
            <ul class="no-space">
              <li>{{ convertedPolicies.offsetRestriction }}</li>
            </ul>
          </div>

          <!-- Text Restriction -->
          <div v-if="convertedPolicies?.textRestriction?.length" class="policy-item">
            <div v-for="(restriction, index) in convertedPolicies.textRestriction" :key="index">
              <span>{{ restriction }}</span>
            </div>
          </div>

          <!-- No Policies Message -->
          <div 
          v-if="!convertedPolicies?.didRestriction?.length &&
                !convertedPolicies?.startDateRestriction &&
                !convertedPolicies?.endDateRestriction &&
                !convertedPolicies?.offsetRestriction &&
                !convertedPolicies?.textRestriction?.length"
          class="policy-item no-policies">
            <span>No valid ODRL policies apply to this service offering.</span>
          </div>
        </div>
      </section>

    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import axios from 'axios';
import { convertODRLPolicies } from './convertODRLPolicies.js';

const baseUrl = inject('baseUrl');

const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
  copyToClipboard: Function
});

const notificationVisible = ref(false);
const serviceProviderName = ref(null);

// Compute the converted policies using the imported function
const convertedPolicies = ref([]);
onMounted(() => {
  convertedPolicies.value = convertODRLPolicies(props.resourceDetailsData.policy);
});

function copyId() {
  if (props.copyToClipboard) {
    props.copyToClipboard(props.resourceDetailsData.id);
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(props.resourceDetailsData.id);
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = props.resourceDetailsData.id;
    textarea.style.position = 'fixed'; // Avoid scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Unable to copy', err);
    }
    document.body.removeChild(textarea);
  }
  notificationVisible.value = true;
  setTimeout(() => {
    notificationVisible.value = false;
  }, 3000); // Hide notification after 3 seconds
}

async function fetchServiceProviderName() {
  const providedBy = props.resourceDetailsData?.provided_by;
  if (providedBy) {
    try {
      const response = await axios.get(
        `${baseUrl}resources/legal-participant/${providedBy}`
      );
      if (response.data && response.data.result && response.data.result.name) {
        serviceProviderName.value = response.data.result.name;
      } else {
        console.error('No name found in API response:', response.data);
      }
    } catch (error) {
    }
  }
}

onMounted(() => {
  fetchServiceProviderName();
  convertedPolicies.value = convertODRLPolicies(props.resourceDetailsData.policy);
});

watch(() => props.resourceDetailsData, (newData) => {
  fetchServiceProviderName();
  convertedPolicies.value = convertODRLPolicies(newData.policy);
});

</script>

<style lang="scss" scoped>
.page {
  width: 100%;
}

a {
  text-decoration: underline;
}

.cropped_link {
  word-break: break-all;
  word-break: break-word;
  hyphens: auto;
}

.main_section {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;

  .left {
    width: 60%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .right {
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    hr {
      background-color: #fff;
    }
  }
}

.tag_container {
  display: flex !important;
  flex-wrap: wrap;
  gap: 0.5rem;

  .tag {
    background-color: #314D84;
    color: #fff;
    padding: 0.4rem 0.6rem;
    border-radius: 0.3rem;
    a {
      color: #fff !important;
    }
  }
}

.label {
  font-weight: 700;
}

.info-box {
  background-color: #1E2E4D;
  color: #fff;
  padding: 0rem 0rem;
  border-radius: 0.6rem;

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    div {
    }
  }

  a {
    color: #fff;
    text-decoration: underline;
    word-wrap: normal;
  }
}

.endpoint {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.left,
.right {
  h5 {
    border: 1px solid #fff;
    border-top-left-radius: 0.6rem;
    border-top-right-radius: 0.6rem;
  }

  .info {
    padding: 1rem;
  }
}

.right {
  hr {
    display: none;
  }

  h5 {
    padding: 1rem;
  }
}

.policy_tag {
  .label {
    background-color: #D99809;
    color: #fff;
    padding: 0.4rem 0.6rem;
    border-radius: 0.3rem;
  }
}

@media screen and (max-width: 1024px) {
  .page {
    .content-wrapper {
      width: 98%;
    }
  }
}

@media screen and (max-width: 768px) {
  .page {
    .main_section {
      flex-direction: column;

      .left,
      .right {
        width: 100%;
      }
    }
  }
}

.id-section {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.id-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.id-text {
  font-size: 1.4rem;
  font-weight: 400;
  color: black;
  padding-bottom: 4px;
}

.copy-button {
  background-color: #314D84;
  color: #fff;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s, text-decoration 0.3s;

  &:hover {
    background-color: #2A3F6E;
    text-decoration: underline; /* Underline text on hover */
    transform: scale(0.95); /* Slightly shrink the button */
  }
}

.service-provider {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .label {
    font-weight: bold;
    margin-right: 0.5rem;
  }
}

.id-section hr {
  border: 0;
  height: 1px;
  background-color: #314D84; /* Change this to the desired color */
  margin: 0.5rem 0; /* Adjust the margins as needed */
}

.notification {
  background-color: #d4edda; /* light green background */
  color: #155724; /* dark green text */
  padding: 1rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
}

.policy-container {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Spacing between different policy sections */
  align-items: flex-start;
}

.policy-item {
  background-color: #314d84;
  color: #fff;
  padding: 0.6rem 1rem;
  border-radius: 0.3rem;
  display: inline-block;
  max-width: 80%; /* Limits tag width */
}

.policy-item span {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.policy-item ul {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.policy-item li {
  margin: 2px 0;
  white-space: nowrap;
}

.no-policies {
  display: inline-block;
  text-align: left;
  width: fit-content;
}

</style>
