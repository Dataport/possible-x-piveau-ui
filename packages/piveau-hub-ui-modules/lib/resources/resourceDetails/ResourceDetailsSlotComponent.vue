<template>
  <div class="content-wrapper row">
    <div class="col-12">
      <!-- <div class="d-flex justify-content-between mb-3"> -->
      <div class="row mb-3">
        <div class="col-12 col-md-3 p-0">
          <span class="resource_banner">{{ $t(`message.header.navigation.data.${selectedResource}`) }}</span>
        </div>
        <div class="col-12 col-md-9 p-0 mt-3 mt-md-0 sub_nav">
          <!-- If the resource type is data-product, show four buttons -->
          <template v-if="type === 'data-product'">
            <a :href="`${hubUrl}resources/${type}/${id}`" target='_blank' class="link">Linked Data &#8599;</a>
            <a :href="`${hubUrl}trust/credentials/${type}/${id}`" target='_blank' class="link">Service Offering Verifiable Credential &#8599;</a>
            <a :href="`${hubUrl}trust/credentials/data-resource/${resourceDetailsData.aggregation_of?.at(0)?.id}`" target='_blank' class="link">Data Resource Verifiable Credential &#8599;</a>
            <a :href="`${hubUrl}trust/credentials/${type}/${id}?showCompliance=true`" target='_blank' class="link">Gaia-X Compliance &#8599;</a>
          </template>

          <!-- If the resource type is legal-participant, show four buttons -->
          <template v-if="type === 'legal-participant'">
            <a :href="`${hubUrl}resources/${type}/${id}`" target='_blank' class="link">Linked Data &#8599;</a>
            <a :href="`${hubUrl}trust/credentials/${type}/${id}`" target='_blank' class="link">Legal Participant Verifiable Credential &#8599;</a>
            <a :href="`${hubUrl}trust/credentials/legal-registration-number/${id}`" target='_blank' class="link">Legal Registration Number Verifiable Credential &#8599;</a>
            <a :href="`${hubUrl}trust/credentials/${type}/${id}?showCompliance=true`" target='_blank' class="link">Gaia-X Compliance &#8599;</a>
          </template>

          <!-- Otherwise, show the original three buttons -->
          <template v-else>
            <a :href="`${hubUrl}resources/${type}/${id}`" target='_blank' class="link">Linked Data &#8599;</a>
            <a :href="`${hubUrl}trust/credentials/${type}/${id}`" target='_blank' class="link">Verifiable Credential &#8599;</a>
            <a :href="`${hubUrl}trust/credentials/${type}/${id}?showCompliance=true`" target='_blank' class="link">Gaia-X Compliance &#8599;</a>
          </template>
        </div>
      </div>

      <div v-if="'aggregation_of' in resourceDetailsData && resourceDetailsData.aggregation_of !==null">
        <h1 class="resource-details-title">{{ resourceDetailsData.aggregation_of?.at(0)?.name }}</h1>
        <p>{{ resourceDetailsData.aggregation_of?.at(0)?.description }}</p>
      </div>
      <div v-else>
        <h1 class="resource-details-title">{{ resourceDetailsData?.name || resourceDetailsData?.id }}</h1>
        <p>{{ resourceDetailsData?.description }}</p>
      </div>
      <slot name="resource-details"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeEnv } from '../../composables/useRuntimeEnv';

const route = useRoute();
const ENV = useRuntimeEnv();

const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
});

let type: string = route.params.resource_type.toString();
let id: string = route.params.resource_id.toString();

const hubUrl = ENV.api.hubUrl;

</script>

<style lang="scss" scoped>
.resource_banner {
  background-color: #1E2E4D;
  color: #fff;
  padding: .4rem .6rem;
  border-radius: .3rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.sub_nav {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  a {
    background-color: #99772C;
    color: #fff;
    padding: .5rem .7rem;
    border-radius: .35rem;
    text-decoration: none;
    transition-duration: .35s !important;
    align-self: flex-start;

    &:hover {
      transform: scale(.95);
      text-decoration: underline
    }
  }

}

.resource-details-title {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.2;
  color: inherit;
}

@media (min-width: 768px) {
  .resource-details-title {
    font-size: 1.5rem;
  }
}

@media (min-width: 992px) {
  .resource-details-title {
    font-size: 1.75rem;
  }
}

// @media screen and (max-width:876px) {
//   .sub_nav{
//     justify-content: flex-start
//   }
// }
// @media screen and (max-width:680px) {
//   .sub_nav{
//     justify-content: flex-start;
//     flex-direction: column
//   }
// }</style>