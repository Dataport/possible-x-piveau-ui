<template>
  <div class="page">
    <section class="main_section pt-5">
      <section>
        <h4>Legal Participant ID</h4>
        <hr />
        <div class="id-container">
          <span class="id-text">{{ resourceDetailsData.id }}</span>
          <button class="copy-button" @click="copyId">
            Copy ID
          </button>
        </div>
        <div v-if="notificationVisible" class="notification">
          Legal Participant ID Copied
        </div>
      </section>

      <section>
        <h4>Email Address</h4>
        <hr />
        <p>{{ resourceDetailsData.email_address || 'None Provided' }}</p>
      </section>

      <section v-if="resourceDetailsData.legal_address">
        <h4>Legal Address</h4>
        <hr />
        <div class="address-container tag_container">
          <p class="tag">
            <div v-if="resourceDetailsData.legal_address.country_code">
              <span class="label">Country Code:</span>
              <span>{{ resourceDetailsData.legal_address.country_code }}</span>
            </div>
            <div v-if="resourceDetailsData.legal_address.country_subdivision_code">
              <span class="label">Country Subdivision Code:</span>
              <span>{{ resourceDetailsData.legal_address.country_subdivision_code }}</span>
            </div>
            <div v-if="resourceDetailsData.legal_address.street_address">
              <span class="label">Street Address:</span>
              <span>{{ resourceDetailsData.legal_address.street_address }}</span>
            </div>
            <div v-if="resourceDetailsData.legal_address.postal_code">
              <span class="label">Postal Code:</span>
              <span>{{ resourceDetailsData.legal_address.postal_code}}</span>
            </div>
            <div v-if="resourceDetailsData.legal_address.locality">
              <span class="label">City:</span>
              <span>{{ resourceDetailsData.legal_address.locality }}</span>
            </div>
          </p>
        </div>
      </section>

      <section v-if="resourceDetailsData.headquarter_address">
        <h4>Headquarter Address</h4>
        <hr />
        <div class="address-container tag_container">
          <p class="tag">
            <div v-if="resourceDetailsData.headquarter_address.country_code">
              <span class="label">Country Code:</span>
              <span>{{ resourceDetailsData.headquarter_address.country_code }}</span>
            </div>
            <div v-if="resourceDetailsData.headquarter_address.country_subdivision_code">
              <span class="label">Country Subdivision Code:</span>
              <span>{{ resourceDetailsData.headquarter_address.country_subdivision_code }}</span>
            </div>
            <div v-if="resourceDetailsData.headquarter_address.street_address">
              <span class="label">Street Address:</span>
              <span>{{ resourceDetailsData.headquarter_address.street_address }}</span>
            </div>
            <div v-if="resourceDetailsData.headquarter_address.postal_code">
              <span class="label">Postal Code:</span>
              <span>{{ resourceDetailsData.headquarter_address.postal_code}}</span>
            </div>
            <div v-if="resourceDetailsData.headquarter_address.locality">
              <span class="label">City:</span>
              <span>{{ resourceDetailsData.headquarter_address.locality }}</span>
            </div>
          </p>
        </div>
      </section>

      <section v-if="resourceDetailsData.legal_registration_number">
        <h4>Legal Registration Number</h4>
        <hr />
        <div class="tag_container">
          <div class="tag" v-for="(value, key) in readableLegalRegistrationNumbers" :key="key">
            <span class="label">{{ key }}:</span>
            <span>{{ value }}</span>
          </div>
        </div>
      </section>

    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
  copyToClipboard: Function
});

const notificationVisible = ref(false);

function copyId() {
  if (props.copyToClipboard) {
    props.copyToClipboard(props.resourceDetailsData.id);
  } else {
    navigator.clipboard.writeText(props.resourceDetailsData.id);
  }
  notificationVisible.value = true;
  setTimeout(() => {
    notificationVisible.value = false;
  }, 3000); // Hide notification after 3 seconds
}

// Computed property to map keys in legal_registration_number to more readable labels
const readableLegalRegistrationNumbers = computed(() => {
  const readableKeys = {
    lei_code: 'LEI Code',
    vat_id: 'VAT ID',
    eori: 'EORI'
  };

  const legalRegNumbers = props.resourceDetailsData.legal_registration_number || {};

  // Map keys to readable labels
  return Object.fromEntries(
    Object.entries(legalRegNumbers).map(([key, value]) => [
      readableKeys[key] || key, // Use readable label if available, otherwise fallback to original key
      value
    ])
  );
});

console.log("*** Inside LegalParticipants.vue");
console.log("Props: ", props);
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
}

a {
  text-decoration: underline;
}

.cropped_link {
  -ms-word-break: break-all;
  word-break: break-all;
  /* Non standard for webkit */
  word-break: break-word;

  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
}

.main_section {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
}

.content-text {
  font-size: 1.4rem;
  font-weight: 400;
  color: black;
  padding-bottom: 4px;
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
    background-color: #d99809;
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
  background-color: #314d84;
  color: #fff;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s, text-decoration 0.3s;

  &:hover {
    background-color: #2a3f6e;
    text-decoration: underline; /* Underline text on hover */
    transform: scale(0.95); /* Slightly shrink the button */
  }
}

.id-section hr {
  border: 0;
  height: 1px;
  background-color: #314d84; /* Change this to the desired color */
  margin: 0.5rem 0; /* Adjust the margins as needed */
}

.notification {
  background-color: #d4edda; /* light green background */
  color: #155724; /* dark green text */
  padding: 1rem;
  border-radius: 0.25rem;
  margin-top: 1rem;
}
</style>
