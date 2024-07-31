<template>
  <router-link
    :to="to"
    class="resource-info-box text-dark text-decoration-none"
  >
    <!-- HEADER SLOT -->
    <slot name="header">
      <div class="resource-info-box-header py-3" data-cy="resource-title">
        <h2 class="card-title">{{ getTitle }}</h2>
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

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Resource } from "../../types/global";

import ResourceInfoBoxFooter from "./ResourceInfoBoxFooter.vue";

export default defineComponent({
  name: "ResourceInfoBox",
  components: {
    ResourceInfoBoxFooter,
  },
  props: {
    resource: {
      type: Object as PropType<Resource>,
      default: () =>
        ({
          id: "",
          title: "",
          description: "",
          createdDate: "",
          updatedDate: "",
        } as Resource),
    },
    to: {
      type: [Object, String],
      required: true,
    },
  },

  computed: {
    getTitle() {
      return this.resource?.title
        ? this.resource.title
        : this.resource.id ;
    },
    getDescription() {
      return this.resource?.description
        ? this.resource.description
        : 'No description available';
    },
  },
});
</script>