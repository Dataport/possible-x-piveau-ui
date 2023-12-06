import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { getTranslationFor } from '../../utils/helpers';
import { useRuntimeEnv } from '../useRuntimeEnv';


export function useDatasetDetailsNavigationLinksHead() {
  const store = useStore();
  const env = useRuntimeEnv();
  const route = useRoute();

  const currentLocale = computed(() => route.query.locale as string || '');

  const getTitle = computed(() => store.getters['datasetDetails/getTitle'] as string || '');
  const getLanguages = computed(() => store.getters['datasetDetails/getLanguages'] as string || '');
  const getID = computed(() => store.getters['datasetDetails/getID'] as string || '');

  const datasetTitleTranslated = computed(() => {
    return getTranslationFor(getTitle.value, currentLocale.value, getLanguages.value) as string;
  });

  return useHead({
    link: [{
      rel: 'alternate', type: 'application/rss+xml', title: `${env.metadata.title} - ${datasetTitleTranslated.value}`, href: `https://piveau-hub-search-data-europa-eu.apps.osc.fokus.fraunhofer.de/de/feeds/datasets/${getID.value}.rss`,
    }]
  });
}
