import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { getTranslationFor } from '../../utils/helpers';


export function useDatasetCategoriesHead() {
  const { t } = useI18n();
  const store = useStore();
  const route = useRoute();

  const currentLocale = computed(() => route.query.locale as string || '');
  const getKeywords = computed(() => store.getters['datasetDetails/getKeywords'] as string[] || []);

  return useHead({
    title: () => t('message.metadata.categories'),
    meta: [
      {
        name: 'description',
        vmid: 'description',
        content: `${t('message.metadata.categories')} - ${getTranslationFor(store.getters['datasetDetails/getTitle'] as string, currentLocale.value, store.getters['datasetDetails/getLanguages'] as string)} - ${t('message.metadata.description')}`.substr(0, 4999),
      },
      {
        name: 'keywords',
        vmid: 'keywords',
        content: getKeywords.value.map(k => k).join(' ').slice(0, 4999),
      },
    ],
  });
}
