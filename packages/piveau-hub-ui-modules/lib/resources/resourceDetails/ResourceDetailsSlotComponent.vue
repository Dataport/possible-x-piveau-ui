<template>
  <div class="content-wrapper">
    <span class="resource_banner">{{ $t(`message.header.navigation.data.${selectedResource}`) }}</span>
    <div class="sub_nav">
        <a href="">Linked Data &#128279;</a>
        <a href="">Get VC &#x21d3;</a>
    </div>
    <h1>{{ resourceDetailsData?.name || resourceDetailsData?.id }} </h1>
    <p>{{ resourceDetailsData?.description }}</p>
    <slot name="resource-details"></slot>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
});
</script>

<style lang="scss" scoped> 
.content-wrapper{
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
    color: #99772C;
    text-decoration: none;
  }

}
</style>