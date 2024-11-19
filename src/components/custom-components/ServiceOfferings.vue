<template>
  <div class="page">
    <section class="main_section pt-5">
      <section>
        <h4>Service Offering ID</h4>
        <hr />
        <div class="id-container">
          <span class="id-text">{{ resourceDetailsData.id }}</span>
          <button class="copy-button" @click="copyToClipboard(resourceDetailsData.id)">
            Copy ID
          </button>
        </div>
      </section>

      <section>
        <h4>Service Provider</h4>
        <hr />
        <p>{{ resourceDetailsData?.provided_by }}</p>
      </section>

      <section v-if="resourceDetailsData.data_protection_regime && resourceDetailsData.data_protection_regime.length > 0">
        <h4>Data Protection Regime</h4>
        <hr />
        <div class="tag_container">
          <div
            class="tag"
            v-for="(regime, index) in resourceDetailsData.data_protection_regime"
            v-bind:key="index"
          >
            <span>{{ regime }}</span>
          </div>
        </div>
      </section>

      <section class="">
        <h4>Data Account Export</h4>
        <hr />
        <div class="tag_container">
        <div class="" v-for="(account_export) in resourceDetailsData.data_account_export"
          v-bind:key="data_account_export">

          
            <div class="tag">
            <div>
              <span class="label">Format Type:</span>
              <span>{{ account_export['format_type'] }}</span>
            </div>
            <div>
              <span class="label">Access Type:</span>
              <span>{{ account_export['access_type'] }}</span>
            </div>
            <div>
              <span class="label">Request Type:</span>
              <span>{{ account_export['request_type'] }}</span>
            </div>
          </div>
          </div>
        </div>
      </section>

      <section class="">
        <h4>Terms and Conditions</h4>
        <hr />
        <div class="tag_container">
        <div class="" v-for="(t_c) in resourceDetailsData.terms_and_conditions"
          v-bind:key="terms_and_conditions">
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

      <section class="">
        <h4>Service Offering Policy</h4>
        <hr />
        <div class="tag_container">
        <div class="" v-for="(p) in resourceDetailsData.policy"
          v-bind:key="policy">
            <div class="tag">
            <div>
              <span>{{ p }}</span>
            </div>
          </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
});
console.log("*** Inside ServiceOfferings.vue");
console.log("Props: ", props);

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert("Service Offering ID copied to clipboard!");
  }).catch(err => {
    console.error("Failed to copy ID: ", err);
  });
}
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
  gap: .5rem;


  

  .tag {
    
    background-color: #314D84;
    color: #fff;
    padding: .4rem .6rem;
    border-radius: .3rem;
    a{
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
  h5 {
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

  h5 {
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

.id-section hr {
  border: 0;
  height: 1px;
  background-color: #314D84; /* Change this to the desired color */
  margin: 0.5rem 0; /* Adjust the margins as needed */
}
</style>