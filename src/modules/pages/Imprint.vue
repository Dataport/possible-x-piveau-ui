<!-- Wraps all IMPRINT components -->

<template>
    <user-imprint></user-imprint>
</template>

<script>
  // Import Components
  import UserImprint from './user/UserImprint';

  export default {
    name: 'imprint',
    components: {
      userImprint: UserImprint,
    },
    metaInfo: function() {
      const title = this.$t('message.navigation.navItems.imprint');
      return {
        title,
        meta: [
          {
            name: 'description',
            vmid: 'description',
            content: `${this.$t('message.navigation.navItems.imprint')} - ${this.$env.metadata.description}`
          },
          {
            name: 'keywords',
            vmid: 'keywords',
            content: `${this.$env.metadata.keywords} ${this.$t('message.navigation.navItems.imprint')}`
          }
        ]
      }
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>
