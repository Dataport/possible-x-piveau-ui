<template>
  <div class="page">
    <div class="content-wrapper">
      <section class="main_section">
        <div class="left">
          <section>
            <h5>Keywords</h5>
            <hr />
            <div class="tag_container">
              <div class="tag" v-for="(keyword) in resourceDetailsData.keyword">
                <span>{{ keyword.label }}</span>
              </div>
            </div>

          </section>

          <section>
            <h5>Service Policy</h5>
            <hr />
            <div class="tag_container">
              <div class="tag" v-for="(policy) in resourceDetailsData.service_policy">
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
                <a href="">{{ resourceDetailsData.endpoint?.endpoint_url }}</a>
              </div>

              <div>
                <span class="label">Formal description:</span>
                <span>{{ resourceDetailsData.endpoint?.formal_description }}</span>
              </div>

              <div>
                <span class="label">Standard Conformity:</span>
                <span>
                  {{ resourceDetailsData.endpoint?.standard_conformity?.at(0)?.title }} ({{ resourceDetailsData.endpoint?.standard_conformity?.at(0)?.publisher }})
                </span>
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
                <span class="cropped_link"><a href="">{{ resourceDetailsData.terms_and_conditions?.at(0)?.url }}</a></span>
              </div>
              <div>
                <span class="label">Hash:</span>
                <span>{{ resourceDetailsData.terms_and_conditions?.at(0)?.hash }}</span>
              </div>
            </div>
          </div>

          <div class="info-box">
            <h5>Data Account Export</h5>
            <hr />
            <div class="info">
              <div>
                <span class="label">Request Type:</span>
                <span>{{ resourceDetailsData.data_account_export?.at(0)?.request_type }}</span>
              </div>
              <div>
                <span class="label">Format Type:</span>
                <span>{{ resourceDetailsData.data_account_export?.at(0)?.format_type }}</span>
              </div>
              <div>
                <span class="label">Access Type:</span>
                <span>{{ resourceDetailsData.data_account_export?.at(0)?.access_type }}</span>
              </div>
            </div>
          </div>

          <div class="info-box">
            <h5>Hosted On:</h5>
            <hr />
            <div class="info">
              <div>
                <span class="label">Name:</span>
                <span>{{ resourceDetailsData.hosted_on?.at(0)?.name }}</span>
              </div>
              <div>
                <span class="label">Description:</span>
                <span>{{ resourceDetailsData.hosted_on?.at(0)?.description }}</span>
              </div>
              <div>
                <span class="label">Resource Policy:</span>
                <span>{{ resourceDetailsData.hosted_on?.at(0)?.resource_policy?.at(0) }}</span>
              </div>
              <div>
                <span class="label">License:</span>
                <span>{{ resourceDetailsData.hosted_on?.at(0)?.license?.at(0) }}</span>
              </div>
              <div>
                <span class="label">Copyright Owned By</span>
                <span>{{ resourceDetailsData.hosted_on?.at(0)?.copyright_owned_by?.at(0) }}</span>
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
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
});
</script>

<style lang="scss" scoped>
.page {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  gap: 1rem;

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

@media screen and (max-width: 1024px) {
  .page{
    .content-wrapper{
      width: 98%
    }
  }
}

@media screen and (max-width: 768px) {
  .page{

    .main_section{
      flex-direction: column;

      .left, .right{
        width: 100%;
      }
    }
  }
}
</style>