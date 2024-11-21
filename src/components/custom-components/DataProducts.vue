<template>
  <div class="page">
    <section class="main_section">
      <section>
        <h4>Data Product ID</h4>
        <hr />
        <div class="id-container">
          <span class="id-text">{{ resourceDetailsData.id }}</span>
          <button class="copy-button" @click="copyToClipboard(resourceDetailsData.id)">
            Copy ID
          </button>
        </div>
      </section>

      <section class="">
        <h4>Copyright Owned By:</h4>
        <hr />
        <div class="tag" v-for="(cob) in resourceDetailsData.aggregation_of?.[0]?.copyright_owned_by" v-bind:key="cob">
          <span>{{ cob }}</span>
        </div>
      </section>

      <section>
        <h4>License</h4>
        <hr />
        <div class="tag_container">
          <div class="tag" v-for="(license) in resourceDetailsData.aggregation_of?.at(0)?.license" v-bind:key="license">
            <span>{{ license }}</span>
          </div>
        </div>
      </section>


      <section>
        <h4>Produced by</h4>
        <hr />
        <p>{{ resourceDetailsData.aggregation_of?.at(0)?.produced_by }}</p>
      </section>

      <section>
        <h4>Data Resource Policy</h4>
        <hr />
        <div class="tag_container">
          <div class="tag" v-for="(policy) in resourceDetailsData.aggregation_of?.at(0)?.policy" v-bind:key="policy">
            <span>{{ policy }}</span>
          </div>
        </div>
      </section>


      <section class="additional_info">
        <h3>Additional Service Offering Information</h3>
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
          <h4>Service Provider:</h4>
          <p>{{ resourceDetailsData?.provided_by }}</p>
        </section>

        <hr />

        <section>
          <h4>Data Protection Regime:</h4>
          <div class="tag_container">
            <div
              v-if="!resourceDetailsData.data_protection_regime || resourceDetailsData.data_protection_regime.length === 0">
              <span>None</span>
            </div>
            <div class="tag" v-else v-for="(regime, index) in resourceDetailsData.data_protection_regime" :key="index">
              <span>{{ regime }}</span>
            </div>
          </div>
        </section>

        <hr />

        <section class="">
          <h4>Data Account Export:</h4>

          <div class="tag_container">
            <div class="" v-for="(account_export) in resourceDetailsData.data_account_export"
              v-bind:key="data_account_export">


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

        <section class="">
          <h4>Terms and Conditions:</h4>

          <div class="tag_container">
            <div class="" v-for="(t_c) in resourceDetailsData.terms_and_conditions" v-bind:key="terms_and_conditions">


              <div class="tag">
                <div>
                  <span class="label">URL:</span>
                  <span><a v-bind:href="`${t_c.url}`">{{ t_c.url }}</a></span>
                </div>
                <div>
                  <span class="label">Hash:</span>
                  <span>{{ t_c.hash }}</span>
                </div>

              </div>
            </div>
          </div>
        </section>
      </section>

    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
});

console.log('Resource Details Data:', props.resourceDetailsData);

const copyToClipboard = (productId) => {
  const valueToCopy = productId;
  if (!valueToCopy) {
    alert(`No value found for key: "${key}"`);
    return;
  }
  const tempInput = document.createElement('input');
  tempInput.value = valueToCopy;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    alert(`Copied "${valueToCopy}" to clipboard!`);
  } catch (err) {
    alert('Clipboard API not supported');
  }
  document.body.removeChild(tempInput);
};
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
}

a {
  text-decoration: underline
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
    text-decoration: underline;
    transform: scale(0.95);
  }
}

.tag_container {
  display: flex !important;
  flex-wrap: wrap;
  gap: .5rem;




  .tag {

    background-color: #314D84;
    color: #fff;
    padding: .4rem .6rem;
    border-radius: .3rem;

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
  padding: .0rem 0rem;
  border-radius: .6rem;

  .info {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    div {}
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
    border-top-left-radius: .6rem;
    border-top-right-radius: .6rem;

  }

  .info {
    padding: 1rem
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
    background-color: #D99809;
    color: #fff;
    padding: .4rem .6rem;
    border-radius: .3rem;

  }
}

@media screen and (max-width: 1024px) {
  .page {
    .content-wrapper {
      width: 98%
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
  -webkit-box-shadow: 1px 7px 15px -8px #E4E4E7;
  box-shadow: 1px 7px 15px -8px #e4e4e7;
  border: 2px solid #e4e4e7;
  padding: 1rem;
  border-radius: .5rem;
  width: 100% !important;

  h4 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  .description {
    margin-bottom: 1rem;
  }

  .description_tag {
    margin-top: .2rem;
  }

  section {
    display: flex;
    flex-direction: column;
    gap: .5rem;


  }



  h3 {
    text-align: center
  }
}
</style>