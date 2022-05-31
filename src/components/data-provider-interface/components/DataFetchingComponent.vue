<template>
  <div style="height:370px;">
    <div class="spinner"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
/* eslint-disable */
import { convertToInput } from '../../../utils/converter/convertToInput';

export default {
  props: ['id', 'property', 'catalog'],
  data() {
    return {
      token: this.$store.getters['auth/getUserData'].rtpToken,
    };
  },
  computed: {
    ...mapGetters('auth', ['getIsDraft']),
  },
  methods: {
    ...mapActions('auth', ['setIsEditMode', 'setIsDraft']),
    convertToInput,
    async setupEditPage() {
      let endpoint;
      this.setIsEditMode(true);

      if (this.getIsDraft) {
        this.setIsDraft(true);
        endpoint = `${this.$env.api.hubUrl}drafts/datasets/${this.id}.jsonld?catalogue=${this.catalog}`;
        await this.convertToInput(this.property, this.catalog, endpoint, this.token);
      } else {
        this.setIsDraft(false);
        endpoint = `${this.$env.api.hubUrl}datasets/${this.id}.jsonld?useNormalizedId=true`;
        await this.convertToInput(this.property, this.catalog, endpoint, '');
      }

      const firstStep = this.$env.upload.input[this.property].steps[0].path;
      const path = `${this.$env.upload.basePath}/${this.property}/${firstStep}?locale=${this.$i18n.locale}`;
      this.$router.push(path).catch(() => {});
    },
  },
  created() {
    this.setupEditPage();
  },
};
</script>