import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { getTranslationFor } from '../../utils/helpers';


export function useDatasetDetailsSimilarDatasetsHead() {
  const { t } = useI18n();
  const store = useStore();
  const route = useRoute();

  const getKeywords = computed(() => store.getters['datasetDetails/getKeywords']);

  const currentLocale = computed(() => route.query.locale as string || '');

  return useHead({
    title: () => t('message.similarDatasets.similarDatasets'),
    meta: computed(() => [
      {
        name: 'description',
        vmid: 'description',
        content: `${t('message.similarDatasets.similarDatasets')} - ${getTranslationFor(store.getters['datasetDetails/getTitle'] as string, currentLocale.value, store.getters['datasetDetails/getLanguages'] as string)} - ${t('message.metadata.description')}`.slice(0, 4999),
      },
      {
        name: 'keywords',
        vmid: 'keywords',
        content: getKeywords.value.map((k: any) => k.title).join(' ').slice(0, 4999),
      }
    ]),
  });
}
