import Vue from 'vue';
import { getTranslationFor } from '../utils/helpers';

export default Vue.extend({
  computed: {
    $breadcrumbs() {
      // Go through the route path to build the breadcrumbs
      return this.$route.matched.reduce((acc, route) => {
        const breadcrumbs = route?.meta?.breadcrumbs || null;
        if (breadcrumbs && breadcrumbs.length > 0) {
          const isBreadcrumbFn = breadcrumbs instanceof Function;

          if (isBreadcrumbFn) {
            const langResolverFn = (messages: Record<string, string>) => getTranslationFor(messages, this.$route.query.locale, ['en']);
            return acc.concat(route?.meta?.breadcrumbs.call(this, {route: this.$route, store: this.$store, t: this.$t, langResolverFn}));
          }
          return acc.concat(breadcrumbs);
        }
        return acc;
      } , []);
    }
  }
});

