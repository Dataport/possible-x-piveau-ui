<template>
  <div>
    <span class="resource_banner">{{ resource }}</span>
    <div class="sub_nav">
      <a href="">Linked Data</a>
      <a href="">Get VC</a>
    </div>
    <h3>{{ resourceDetailsData.result.name }}</h3>
    <p>{{ resourceDetailsData.result.description }}</p>

    <section class="main_section">
      <div class="left">
        <section>
          <h5>Keywords</h5>
          <hr />
          <div class="tag_container">
            <div class="tag" v-for="(keyword) in resourceDetailsData.result.keyword">
              <span>{{ keyword.label }}</span>
            </div>
          </div>

        </section>

        <section>
          <h5>Service Policy</h5>
          <hr />
          <div class="tag_container">
            <div class="tag" v-for="(policy) in resourceDetailsData.result.service_policy">
              <span>{{ policy }}</span>
            </div>
          </div>

        </section>

        <section>
          <h5>Endpoint</h5>
          <hr />
          <div class="endpoint">
            <div>
              <span class="label">URL:</span>
              <a href="">{{ resourceDetailsData.result.endpoint.endpoint_url }}</a>
            </div>

            <div>
              <span class="label">Formal description:</span>
              <span>{{ resourceDetailsData.result.endpoint.formal_description }}</span>
            </div>

            <div>
              <span class="label">Standard Conformity:</span>
              <span>{{ resourceDetailsData.result.endpoint.standard_conformity[0].title }} ({{
      resourceDetailsData.result.endpoint.standard_conformity[0].publisher }})</span>
            </div>
          </div>
        </section>

      </div>
      <div class="right">
        <div class="info-box">
          <h5>Terms and Conditions</h5>
          <hr />
          <div class="info">
            <div>
              <span class="label">URL:</span>
              <a href="">{{ resourceDetailsData.result.terms_and_conditions[0].url }}</a>
            </div>
            <div>
              <span class="label">Hash:</span>
              <span>{{ resourceDetailsData.result.terms_and_conditions[0].hash }}</span>
            </div>
          </div>
        </div>

        <div class="info-box">
          <h5>Data Account Export</h5>
          <hr />
          <div class="info">
            <div>
              <span class="label">Request Type:</span>
              <span>{{ resourceDetailsData.result.data_account_export[0].request_type }}</span>
            </div>
            <div>
              <span class="label">Format Type:</span>
              <span>{{ resourceDetailsData.result.data_account_export[0].format_type }}</span>
            </div>
            <div>
              <span class="label">Access Type:</span>
              <span>{{ resourceDetailsData.result.data_account_export[0].access_type }}</span>
            </div>
          </div>
        </div>

        <div class="info-box">
          <h5>Hosted On:</h5>
          <hr />
          <div class="info">
            <div>
              <span class="label">Name:</span>
              <span>{{ resourceDetailsData.result.hosted_on[0].name }}</span>
            </div>
            <div>
              <span class="label">Description:</span>
              <span>{{ resourceDetailsData.result.hosted_on[0].description }}</span>
            </div>
            <div>
              <span class="label">Resource Policy:</span>
              <span>{{ resourceDetailsData.result.hosted_on[0].resource_policy[0] }}</span>
            </div>
            <div>
              <span class="label">License:</span>
              <span>{{ resourceDetailsData.result.hosted_on[0].license[0] }}</span>
            </div>
            <div>
              <span class="label">Copyright Owned By</span>
              <span>{{ resourceDetailsData.result.hosted_on[0].copyright_owned_by[0] }}</span>
            </div>
          </div>
        </div>

        <!-- <div class="info-box">
          <h5>Service Policy: </h5>
          <hr />
          <div class="info">
            <div class="policy_tag" v-for="(policy) in resourceDetailsData.result.service_policy">
              <span class="label">{{ policy }}</span>
            </div>
          </div>
        </div> -->
      </div>
    </section>
    <!-- Test message from Service Offerings
    {{ resourceDetailsData }} -->
  </div>
</template>

<script setup>
const props = defineProps({
  resourceDetailsData: Object,
  resource: String
});

</script>

<style scss scoped>
.resource_banner {
  /* background-color: #314D84; */
  background-color: #1E2E4D;
  color: #fff;
  padding: .4rem .6rem;
  border-radius: .3rem;
  font-size: 1.1rem;
  font-weight: 600
}

.sub_nav {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  a{
    color: #99772C;
    text-decoration: underline;
  }

}

.main_section {
  display: flex;
  gap: 1rem;

  .left {
    width: 65%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .right {
    width: 35%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

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
    border-radius: .3rem
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

    div{
     
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

.policy_tag{
  .label{
    background-color: #D99809;
    color: #fff;
    padding: .4rem .6rem;
    border-radius: .3rem;
  
  }
}
</style>