<!-- ERROR page -->

<template>
  <div class="container-fluid">
    <div class="row mt-1 mb-3">
      <div class="col-10 offset-1">
        <slot>
          <h1>{{ $t('message.notFound.error') }} 404</h1>
          <p><app-link :to="{name: 'Datasets'}"> {{ $t('message.notFound.requested.page')}} </app-link></p>
          <p><app-link :href="`/${$route.query.locale || 'en'}/feedback/form`">{{ $t('message.notFound.contactUsAbout')}}</app-link></p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import AppLink from "../widgets/AppLink.vue";

export default {
  name: 'NotFound',
  components: { AppLink },
  metaInfo() {
    return {
      title: this.$t('message.metadata.notFound'),
      meta: [
        { name: 'description', vmid: 'description', content: `${this.$t('message.metadata.notFound')} - ${this.$env.metadata.description}` },
        { name: 'keywords', vmid: 'keywords', content: `${this.$env.metadata.keywords} ${this.$t('message.metadata.notFound')}` },
        { name: 'robots', content: 'noindex, follow' },
      ],
    };
  },
  mounted() {
    if (this.$piwik) {
      this.$piwik.trackInteraction('not_found', {
        screen_title: window.title,
        page_url: window.location.href,
        dataset_ID: this.$route.query.dataset || '',
      });
    }
  },
};
</script>
