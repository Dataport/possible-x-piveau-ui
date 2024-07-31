<template>
  <router-link
    :to="to"
    class="resource-info-box text-dark text-decoration-none"
  >
    <slot name="header">
      <div class="resource-info-box-header py-3" data-cy="resource-title">
        <h2 class="card-title m0">{{ getTitle }}</h2>
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
          createdDate: "01.01.2024",
          updatedDate: "01.01.2024",
        } as Resource),
    },
    to: {
      type: [Object, String],
      required: true,
    },
  },

  computed: {
    getTitle() {
      return this.resource?.title;
    }
  },
});
</script>