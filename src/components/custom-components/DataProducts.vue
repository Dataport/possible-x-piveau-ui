<template>
  <div class="page">
    <section class="main_section">
      <section>
        <br />
        <br />
        <h4>Data Product ID</h4>
        <hr />
        <div class="id-container">
          <span class="id-text">{{ resourceDetailsData.id }}</span>
          <button class="copy-button" @click="copyId">
            Copy ID
          </button>
        </div>
        <div v-if="notificationVisible" class="notification">
          Data Product ID Copied
        </div>
      </section>

      <section>
        <h4>Copyright Owned By:</h4>
        <hr />
        <div
          class="tag"
          v-for="(cob, index) in resourceDetailsData.aggregation_of?.[0]?.copyright_owned_by"
          :key="index"
        >
          <span>{{ cob }}</span>
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
        <h4>Produced by</h4>
        <hr />
        <p>{{ resourceDetailsData.aggregation_of?.[0]?.produced_by }}</p>
      </section>

      <section>
        <h4>Data Resource Policy</h4>
        <hr />
        <div class="tag_container">
          <div
            class="tag"
            v-for="(policy, index) in resourceDetailsData.aggregation_of?.[0]?.policy"
            :key="index"
          >
            <span>{{ policy }}</span>
          </div>
        </div>
      </section>

      <section class="additional_info">
        <h3>Associated Service Offering</h3>
        <hr />

        <section>
          <h4>Service Provider:</h4>
          <p>{{ resourceDetailsData?.provided_by }}</p>
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

        <section v-if="resourceDetailsData.containsPII">
          <hr/>
          <h4>Legitimate Interest</h4>
          <hr />
          <div class="tag_container">
            <div>
              <span class="label">Legal Basis:</span>
              <span>{{ resourceDetailsData.legitimate_interest?.legal_basis || 'None' }}</span>
            </div>
            <div>
              <span class="label">Data Protection Contract:</span>
              <span>{{ resourceDetailsData.legitimate_interest?.data_protection_contract || 'None' }}</span>
            </div>
          </div>
        </section>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
  copyToClipboard: Function,
});

const notificationVisible = ref(false);

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

console.log('Resource Details Data:', props.resourceDetailsData);
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
  h4 {
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

  h4 {
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
</style>
