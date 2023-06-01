<template>
  <app-link class="text-decoration-none" :to="createLinkedMetricsURL(format, datasetId)" target="_blank" >
    <div>{{ text }}</div>
  </app-link>
</template>

<script>
  // Import components used in template
  import AppLink from "../widgets/AppLink.vue";

  export default {
    name: 'DEU-datasetDetailsLinkedMetricsButton',
    components: {
      appLink: AppLink,
    },
    data() {
      return {};
    },
    props: {
      format: {
        type: String,
        default: '',
        required: true,
      },
      text: {
        type: String,
        default: '',
        required: true,
      },
      datasetId: {
        type: String,
        required: true,
      },
    },
    computed: {},
    methods: {
      createLinkedMetricsURL(format, datasetId) {
        return `${this.$env.api.hubUrl}metrics/${datasetId}.${format}?useNormalizedId=true&locale=${this.$route.query.locale}`;
      },
    },
  };
</script>
