import { useHead } from '@unhead/vue';
import { useI18n } from 'vue-i18n';
import { useRuntimeEnv } from '../useRuntimeEnv';


export function useNotFoundHead() {
  const { t } = useI18n();
  const env = useRuntimeEnv();

  return useHead({
    title: () => t('message.metadata.notFound'),
    meta: [
      { name: 'description', vmid: 'description', content: `${t('message.metadata.notFound')} - ${env.metadata.description}` },
      { name: 'keywords', vmid: 'keywords', content: `${env.metadata.keywords} ${t('message.metadata.notFound')}` },
      { name: 'robots', content: 'noindex, follow' },
    ],
  });
}
