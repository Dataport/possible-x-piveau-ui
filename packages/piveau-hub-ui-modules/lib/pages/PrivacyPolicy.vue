<!-- Wraps all PRIVACY POLICY components -->

<template>
  <user-privacy-policy></user-privacy-policy>
</template>

<script>
  import UserPrivacyPolicy from './user/UserPrivacyPolicy.vue';
  import * as metaInfo from '../composables/head';

  export default {
    name: 'imprint',
    components: {
      userPrivacyPolicy: UserPrivacyPolicy,
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

<style lang="scss" scoped>
</style>
