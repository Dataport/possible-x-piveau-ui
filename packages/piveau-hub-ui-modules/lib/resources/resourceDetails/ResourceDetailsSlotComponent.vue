<template>
  <div class="content-wrapper">
    <span class="resource_banner">{{ $t(`message.header.navigation.data.${selectedResource}`) }}</span>
    <div class="sub_nav">
      <a :href="`${hubUrl}resources/${type}/${id}`" target='_blank' class="link">Linked Data &#8599;</a>
      <a :href="`${hubUrl}trust/${type}/${id}`" target='_blank' class="link">Verifiable Credential &#8599;</a>
      <a :href="`${hubUrl}trust/${type}/${id}?showCompliance=true`" target='_blank' class="link">Gaia-X Compliance &#8599;</a>
    </div>
    <h1>{{ resourceDetailsData?.name || resourceDetailsData?.id }} </h1>
    <p>{{ resourceDetailsData?.description }}</p>
    <slot name="resource-details"></slot>
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
.content-wrapper {
  width: 86% !important;
  align-self: center;
}

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
  margin: 1rem 0;
  gap: 1rem;

  a {
    background-color: #99772C;
    color: #fff;
    padding: .5rem .7rem;
    border-radius: .35rem;
    text-decoration: none;
    transition-duration: .35s !important; 
    align-self: flex-start;
   
    &:hover{
      transform: scale(.95);
      text-decoration: underline
    }
  }

}

@media screen and (max-width:876px) {
  .sub_nav{
    justify-content: flex-start
  }
}
@media screen and (max-width:680px) {
  .sub_nav{
    justify-content: flex-start;
    flex-direction: column
  }
}
</style>