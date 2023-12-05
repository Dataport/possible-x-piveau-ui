<!-- Wraps all IMPRINT components -->

<template>
    <user-imprint></user-imprint>
</template>

<script>
  // Import Components
  import UserImprint from './user/UserImprint.vue';
  import * as metaInfo from '../composables/head';

  export default {
    name: 'imprint',
    components: {
      userImprint: UserImprint,
    },
    data() {
      return {};
    },
    methods: {},
    setup() {
      metaInfo.useImprintHead();
    }
  };
</script>
