<!-- Wraps all PRIVACY POLICY components -->

<template>
  <user-privacy-policy></user-privacy-policy>
</template>

<script>
  import UserPrivacyPolicy from './user/UserPrivacyPolicy';

  export default {
    name: 'imprint',
    components: {
      userPrivacyPolicy: UserPrivacyPolicy,
    },
    metaInfo: function() {
      return {
        title: this.$t('message.navigation.navItems.privacyPolicy'),
        meta: [
          {
            name: 'description',
            vmid: 'description',
            content: `${this.$t('message.navigation.navItems.privacyPolicy')} - ${this.$env.metadata.description}`
          },
          {
            name: 'keywords',
            vmid: 'keywords',
            content: `${this.$env.metadata.keywords} ${this.$t('message.navigation.navItems.privacyPolicy')}`
          },
        ]
      }
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>

<style lang="scss" scoped>
</style>
