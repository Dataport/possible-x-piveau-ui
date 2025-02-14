<template>
  <div class="page">
    <section class="main_section">
      <section>
        <br />
        <br />
        <h4>Data Service Offering ID</h4>
        <hr />
        <div class="id-container">
          <span class="id-text">{{ resourceDetailsData.id }}</span>
          <button class="copy-button" @click="copyId">
            Copy ID
          </button>
        </div>
        <div v-if="notificationVisible" class="notification">
          Data Service Offering ID Copied
        </div>
      </section>

      <section>
        <h4>Copyright Owned By</h4>
        <hr />
        <div
          class="service-provider"
          v-for="(entry, index) in copyrightOwnedEntries"
          :key="index"
        >
          <div v-if="entry.name">
            <div>
              <span class="label">Organization:</span>
              <span>{{ entry.name }}</span>
            </div>
            <div>
              <span class="label">DID:</span>
              <span>{{ entry.did || 'Unknown DID' }}</span>
            </div>
          </div>
          <div v-else>
            <span class="label">Copyright Owner:</span>
            <span>{{ entry.did || 'Unknown DID' }}</span>
          </div>
          <br v-if="index < copyrightOwnedEntries.length - 1" />
        </div>
      </section>

      <section>
        <h4>License</h4>
        <hr />
        <div class="tag_container">
          <div
            class="tag"
            v-for="(license, index) in resourceDetailsData.aggregation_of?.[0]?.license"
            :key="index"
          >
            <span>{{ license }}</span>
          </div>
        </div>
      </section>

      <section>
        <h4>Produced By</h4>
        <hr />
        <div class="service-provider">
          <div>
            <span class="label">Organization Name:</span>
            <span>{{ producedByEntry.name || 'Unknown Organization' }}</span>
          </div>
          <div>
            <span class="label">DID:</span>
            <span>{{ producedByEntry.did || 'Unknown DID' }}</span>
          </div>
        </div>
      </section>

      <section>
        <h4>Data Resource Policy</h4>
        <div class="policy-container">
          <!-- DID Restriction -->
          <div v-if="convertedAggregationPolicies?.didRestriction?.length" class="policy-item">
            <span>Contracting is restricted to the following organizations:</span>
            <ul>
              <li v-for="(org, index) in convertedAggregationPolicies.didRestriction" :key="index">
                {{ org }}
              </li>
            </ul>
          </div>

          <!-- Start Date Restriction -->
          <div v-if="convertedAggregationPolicies?.startDateRestriction" class="policy-item">
            <span>Contract duration is restricted to the following start date:</span>
            <ul>
              <li>{{ convertedAggregationPolicies.startDateRestriction }}</li>
            </ul>
          </div>

          <!-- End Date Restriction -->
          <div v-if="convertedAggregationPolicies?.endDateRestriction" class="policy-item">
            <span>Contract duration is restricted to the following end date:</span>
            <ul>
              <li>{{ convertedAggregationPolicies.endDateRestriction }}</li>
            </ul>
          </div>

          <!-- Offset Restriction -->
          <div v-if="convertedAggregationPolicies?.offsetRestriction" class="policy-item">
            <span>Transfer is restricted to the following period starting from the contract signing date:</span>
            <ul>
              <li>{{ convertedAggregationPolicies.offsetRestriction }}</li>
            </ul>
          </div>

          <!-- Text Restriction -->
          <div v-if="convertedAggregationPolicies?.textRestriction?.length" class="policy-item">
            <div v-for="(restriction, index) in convertedAggregationPolicies.textRestriction" :key="index">
              <span>{{ restriction }}</span>
            </div>
          </div>

          <!-- No Policies Message -->
          <div 
            v-if="!convertedAggregationPolicies?.didRestriction?.length &&
                  !convertedAggregationPolicies?.startDateRestriction &&
                  !convertedAggregationPolicies?.endDateRestriction &&
                  !convertedAggregationPolicies?.offsetRestriction &&
                  !convertedAggregationPolicies?.textRestriction?.length"
            class="policy-item no-policies">
            <span>No policies apply to this Data Resource.</span>
          </div>
        </div>
      </section>

      <section v-if="resourceDetailsData.aggregation_of?.[0]?.contains_pii === 'true'">
        <h4>Legitimate Interest</h4>
        <hr />
        <div class="tag_container">
          <div
            v-for="(legitimateInterest, index) in resourceDetailsData.aggregation_of?.[0]?.legitimate_interest"
            :key="index"
            class="tag"
          >
            <div>
              <span class="label">Legal Basis:</span>
              <span>{{ legitimateInterest.legal_basis || 'None' }}</span>
            </div>
            <div>
              <span class="label">Data Protection Contract:</span>
              <span>{{ legitimateInterest.data_protection_contract || 'None' }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="additional_info">
        <h3>Associated Service Offering</h3>
        <hr />

        <section>
          <h4>Service Provider</h4>
          <div class="service-provider">
            <div>
              <span class="label">Organization Name:</span>
              <span>{{ serviceProviderEntry.name || 'Unknown Organization' }}</span>
            </div>
            <div>
              <span class="label">DID:</span>
              <span>{{ serviceProviderEntry.did || 'Unknown DID' }}</span>
            </div>
          </div>
        </section>

        <hr />

        <section>
          <h4>Name:</h4>
          <p>{{ resourceDetailsData?.name }}</p>
        </section>

        <hr />

        <section>
          <h4 class="description_tag">Description:</h4>
          <p class="description">{{ resourceDetailsData?.description }}</p>
        </section>

        <hr />

        <section>
          <h4>Data Protection Regime:</h4>
          <div class="tag_container">
            <div
              v-if="!resourceDetailsData.data_protection_regime || resourceDetailsData.data_protection_regime.length === 0"
            >
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

        <hr />

        <section>
          <h4>Data Account Export:</h4>
          <div class="tag_container">
            <div
              v-for="(account_export, index) in resourceDetailsData.data_account_export"
              :key="index"
            >
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

        <hr />

        <section>
          <h4>Terms and Conditions:</h4>
          <div class="tag_container">
            <div
              v-for="(t_c, index) in resourceDetailsData.terms_and_conditions"
              :key="index"
            >
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

        <hr />

        <section>
          <h4>Service Offering Policy</h4>
          <div class="policy-container">
            <!-- DID Restriction -->
            <div v-if="convertedServiceOfferingPolicies?.didRestriction?.length" class="policy-item">
              <span>Contracting is restricted to the following organizations:</span>
              <ul>
                <li v-for="(org, index) in convertedServiceOfferingPolicies.didRestriction" :key="index">
                  {{ org }}
                </li>
              </ul>
            </div>

            <!-- Start Date Restriction -->
            <div v-if="convertedServiceOfferingPolicies?.startDateRestriction" class="policy-item">
              <span>Contract duration is restricted to the following start date:</span>
              <ul>
                <li>{{ convertedServiceOfferingPolicies.startDateRestriction }}</li>
              </ul>
            </div>

            <!-- End Date Restriction -->
            <div v-if="convertedServiceOfferingPolicies?.endDateRestriction" class="policy-item">
              <span>Contract duration is restricted to the following end date:</span>
              <ul>
                <li>{{ convertedServiceOfferingPolicies.endDateRestriction }}</li>
              </ul>
            </div>

            <!-- Offset Restriction -->
            <div v-if="convertedServiceOfferingPolicies?.offsetRestriction" class="policy-item">
              <span>Transfer is restricted to the following period starting from the contract signing date:</span>
              <ul>
                <li>{{ convertedServiceOfferingPolicies.offsetRestriction }}</li>
              </ul>
            </div>

            <!-- Text Restriction -->
            <div v-if="convertedServiceOfferingPolicies?.textRestriction?.length" class="policy-item">
              <div v-for="(restriction, index) in convertedServiceOfferingPolicies.textRestriction" :key="index">
                <span>{{ restriction }}</span>
              </div>
            </div>

            <!-- No Policies Message -->
            <div 
              v-if="!convertedServiceOfferingPolicies?.didRestriction?.length &&
                    !convertedServiceOfferingPolicies?.startDateRestriction &&
                    !convertedServiceOfferingPolicies?.endDateRestriction &&
                    !convertedServiceOfferingPolicies?.offsetRestriction && 
                    !convertedServiceOfferingPolicies?.textRestriction?.length"
              class="policy-item no-policies">
              <span>No policies apply to this Service Offering.</span>
            </div>
          </div>
        </section>

        <hr />

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
  copyToClipboard: Function,
});

const notificationVisible = ref(false);
const copyrightOwnedEntries = ref([]);
const producedByEntry = ref({ name: null, did: null });
const serviceProviderEntry = ref({ name: null, did: null });

// New refs for converted policies
const convertedAggregationPolicies = ref([]);
const convertedServiceOfferingPolicies = ref([]);

function copyId() {
  if (props.copyToClipboard) {
    props.copyToClipboard(props.resourceDetailsData.id);
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(props.resourceDetailsData.id);
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = props.resourceDetailsData.id;
    textarea.style.position = 'fixed';
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
  }, 3000);
}

async function fetchOrganizationData(did) {
  try {
    const response = await axios.get(
      `${baseUrl}resources/legal-participant/${did}`
    );
    return {
      name: response.data?.result?.name || null,
      did,
    };
  } catch (error) {
    console.error(`Failed to fetch data for DID ${did}:`, error);
    return { name: null, did };
  }
}

async function fetchAllEntries() {
  const copyrightDIDs = props.resourceDetailsData.aggregation_of?.[0]?.copyright_owned_by || [];
  const producedByDID = props.resourceDetailsData.aggregation_of?.[0]?.produced_by;
  const serviceProviderDID = props.resourceDetailsData?.provided_by;

  // Fetch data for "Copyright Owned By"
  copyrightOwnedEntries.value = await Promise.all(
    copyrightDIDs.map((did) => fetchOrganizationData(did))
  );

  // Fetch data for "Produced By"
  if (producedByDID) {
    producedByEntry.value = await fetchOrganizationData(producedByDID);
  }

  // Fetch data for "Service Provider"
  if (serviceProviderDID) {
    serviceProviderEntry.value = await fetchOrganizationData(serviceProviderDID);
  }
}

async function updatePolicies() {
  if (props.resourceDetailsData.aggregation_of?.[0]?.policy) {
    
    let convertedPolicies = convertODRLPolicies(props.resourceDetailsData.aggregation_of[0].policy);

    // Fetch organization names for each DID restriction
    if (convertedPolicies.didRestriction.length > 0) {
      let updatedDidRestrictions = await Promise.all(
        convertedPolicies.didRestriction.map(async (did) => {
          const orgData = await fetchOrganizationData(did);
          return `${orgData.name || "Consumer Org"} (${did})`;
        })
      );
      convertedPolicies.didRestriction = updatedDidRestrictions;
    }

    convertedAggregationPolicies.value = convertedPolicies;
  }

  if (props.resourceDetailsData.policy) {
    let convertedPolicies = convertODRLPolicies(props.resourceDetailsData.policy);

    // Fetch organization names for each DID restriction
    if (convertedPolicies.didRestriction.length > 0) {
      let updatedDidRestrictions = await Promise.all(
        convertedPolicies.didRestriction.map(async (did) => {
          const orgData = await fetchOrganizationData(did);
          return `${orgData.name || "Consumer Org"} (${did})`;
        })
      );
      convertedPolicies.didRestriction = updatedDidRestrictions;
    }

    convertedServiceOfferingPolicies.value = convertedPolicies;
  }
}

onMounted(() => {
  fetchAllEntries();
  updatePolicies();
});

watch(() => props.resourceDetailsData, () => {
  fetchAllEntries();
  updatePolicies();
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
  background-color: #314d84;
  color: #fff;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s, text-decoration 0.3s;

  &:hover {
    background-color: #2a3f6e;
    text-decoration: underline;
    transform: scale(0.95);
  }
}

.tag_container {
  display: flex !important;
  flex-wrap: wrap;
  gap: 0.5rem;

  .tag {
    background-color: #314d84;
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
  background-color: #1e2e4d;
  color: #fff;
  padding: 0rem 0rem;
  border-radius: 0.6rem;

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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

.additional_info {
  margin-top: 3rem;
  -webkit-box-shadow: 1px 7px 15px -8px #e4e4e7;
  box-shadow: 1px 7px 15px -8px #e4e4e7;
  border: 2px solid #e4e4e7;
  padding: 1rem;
  border-radius: 0.5rem;
  width: 100% !important;

  h4 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .description {
    margin-bottom: 1rem;
  }

  .description_tag {
    margin-top: 0.2rem;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  h3 {
    text-align: center;
  }
}

.notification {
  background-color: #d4edda; /* light green background */
  color: #155724; /* dark green text */
  padding: 1rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
}

ul.no-space {
  margin: 0;
  padding-left: 20px; /* Ensures correct indentation */
  list-style-type: disc; /* Keep bullet points */
}

.restriction-item {
  display: block;
  margin-top: 5px; /* Ensures spacing between items */
  margin-bottom: 0; /* Prevents extra space below the last item */
  padding-bottom: 0;
  white-space: nowrap; /* Ensures text stays on one line */
}

.policy-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Ensures spacing between policy sections */
  align-items: flex-start; /* Align policies to the left */
}

.policy-item {
  background-color: #314d84;
  color: #fff;
  padding: 0.6rem 1rem;
  border-radius: 0.3rem;
  display: inline-block; /* Ensures tags don't take full width */
  max-width: 80%; /* Limits tag width, adjust as needed */
}

.policy-item span {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.policy-item ul {
  margin: 0;
  padding-left: 20px; /* Proper bullet indentation */
  list-style-type: disc;
}

.policy-item li {
  margin: 2px 0;
  white-space: nowrap; /* Prevents wrapping */
}

.no-policies {
  display: inline-block;
  text-align: left;
  width: fit-content;
}
</style>
