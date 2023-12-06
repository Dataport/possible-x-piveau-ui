import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { getTranslationFor } from '../../utils/helpers';
import { useRuntimeEnv } from '../useRuntimeEnv';


export function useDatasetsFacetsHead() {
  const { t } = useI18n();
  const store = useStore();
  const route = useRoute();
  const env = useRuntimeEnv();

  const currentSearchQuery = computed(() => {
    const searchQuery = route.query.query;
    const searchQueryString = Array.isArray(searchQuery) ? searchQuery[0] : searchQuery;
    return searchQueryString;
  });

  const getLanguages = computed(() => store.getters['datasetDetails/getLanguages']);
  const getCatalog = computed(() => store.getters['catalogDetails/getCatalog']);

  const showCatalogDetails = computed(() => {
    const hasCatalogId = !!route.query.ctlg_id;
    return hasCatalogId;
  });

  const catalogTitleTranslated = computed(() => {
    return getTranslationFor(getCatalog.value.title, route.query?.locale, getLanguages.value) as string;
  });

  const title = computed(() => {
    return currentSearchQuery.value
      ? `${currentSearchQuery.value}${showCatalogDetails.value ? ` - ${catalogTitleTranslated.value}` : ''}`
      : `${showCatalogDetails.value ? catalogTitleTranslated.value : t('message.header.navigation.data.datasets')}`;
  });

  return useHead({
    title: () => title.value,
    meta: computed(() => [
      {
        name: 'description',
        vmid: 'description',
        content: showCatalogDetails.value ? catalogTitleTranslated.value : `${t('message.datasets.meta.description')}`,
      },
      {
        name: 'keywords',
        vmid: 'keywords',
        content: showCatalogDetails.value ? `${env.metadata.keywords} ${t('message.datasets.meta.description')}` : `${env.metadata.keywords} ${t('message.datasets.meta.description')}`,
      },
    ]),
  });
}
