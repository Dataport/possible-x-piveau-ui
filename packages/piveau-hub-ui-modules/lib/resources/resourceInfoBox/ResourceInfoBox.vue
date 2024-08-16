<template>
  <router-link
    :to="to"
    class="resource-info-box text-dark text-decoration-none"
  >
    <!-- HEADER SLOT -->
    <slot name="header">
      <div class="resource-info-box-header py-3" data-cy="resource-title">
        <h2 class="card-title">{{ getName }}</h2>
      </div>
    </slot>

    <!-- BODY SLOT -->
    <slot name="body">
      <div class="resource-info-box-body py-3" data-cy="resource-body">
        <p class="card-description">{{ getDescription }}</p>
      </div>
    </slot>

    <!-- Footer slot -->
    <slot name="footer" :resource="resource">
      <resource-info-box-footer
        class="col-12"
        :createdDate="resource.createdDate"
        :updatedDate="resource.updatedDate"
      ></resource-info-box-footer>
    </slot>
  </router-link>
</template>

<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { Resource } from "../../types/global";

import ResourceInfoBoxFooter from "./ResourceInfoBoxFooter.vue";

const props = defineProps({
  resource: {
    type: Object as PropType<Resource>,
      default: () =>
        ({
          id: "",
          name: "",
          description: "",
          createdDate: "",
          updatedDate: "",
        } as Resource),
  },
  to: {
    type: [Object, String],
    required: true,
  },
});

const getName = computed(() => {
  console.log(props.resource)
  return props.resource?.name
        ? props.resource.name
        : props.resource.id;
});

const getDescription = computed(() => {
  return props.resource?.description
        ? props.resource.description
        : 'No description available';
});
</script>