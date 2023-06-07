<template>
  <app-link class="text-decoration-none"
            :to="to"
            target="_blank">
    <div>
      {{ $t('message.datasetDetails.shareOn') }}
      <font-awesome-icon
        class="ml-1 fa"
        :icon="icon"
      />
    </div>
  </app-link>
</template>

<script>
  // Import components used in template
  import AppLink from "../widgets/AppLink.vue";

  export default {
    name: 'DEU-datasetDetailsShareButton',
    components: {
      appLink: AppLink,
    },
    data() {
      return {};
    },
    props: {
      to: {
        type: String,
        default: '',
        required: true,
      },
      icon: {
        type: Object,
        required: true,
      },
    },
    computed: {
      url() { return window.location.href; },
    },
    methods: {},
  };
</script>
