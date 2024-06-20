import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useRuntimeEnv } from '../useRuntimeEnv';

export function useDatasetsHead({ isCatalog = false }: { isCatalog?: boolean; } = {}) {
  const { t } = useI18n();
  const route = useRoute();
  const env = useRuntimeEnv();

  const currentSearchQuery = computed(() => {
    const searchQuery = route.query.query;
    const searchQueryString = Array.isArray(searchQuery) ? searchQuery[0] : searchQuery;
    return searchQueryString;
  })

  const translatedTitleForDatasetOrCatalog = computed(() => {
    if (isCatalog) {
      return t('message.header.navigation.data.catalogs');
    } else {
      return t('message.header.navigation.data.datasets');
    }
  
  })

  return useHead({
    title: () => currentSearchQuery.value || translatedTitleForDatasetOrCatalog.value,
    meta: [
      {
        name: 'description',
        vmid: 'description',
        content: t('message.datasets.meta.description')
      },
      {
        name: 'keywords',
        vmid: 'keywords',
        content: `${env.metadata.keywords} ${t('message.datasets.meta.description')}`
      },
      {
        name: 'minh',
        vmid: 'minh',
        content: 'ungabungadatasets'
      },
      {
        name: 'robots',
        content: 'noindex, follow',
      },
    ]
  })
}