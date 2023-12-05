import { useHead } from '@unhead/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { getTranslationFor } from '../../utils/helpers';


export function useDatasetDetailsQualityHead() {
  const { t } = useI18n();
  const store = useStore();
  const route = useRoute();

  const currentLocale = computed(() => route.query.locale as string || '');

  return useHead({
    title: () => t('message.datasetDetails.subnav.quality'),
    meta: [
      {
        name: 'description',
        vmid: 'description',
        content: `${t('message.datasetDetails.subnav.quality')} - ${getTranslationFor(store.getters['datasetDetails/getTitle'] as string, currentLocale.value, store.getters['datasetDetails/getLanguages'] as string)} - ${t('message.metadata.description')}`.slice(0, 4999),
      },
    ],
  });
}
