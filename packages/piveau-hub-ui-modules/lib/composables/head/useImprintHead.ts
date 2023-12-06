import { useHead } from '@unhead/vue';
import { useI18n } from 'vue-i18n';
import { useRuntimeEnv } from '../useRuntimeEnv';


export function useImprintHead() {
  const { t } = useI18n();
  const env = useRuntimeEnv();

  return useHead({
    title: () => t('message.navigation.navItems.imprint'),
    meta: [
      {
        name: 'description',
        vmid: 'description',
        content: `${t('message.navigation.navItems.imprint')} - ${env.metadata.description}`
      },
      {
        name: 'keywords',
        vmid: 'keywords',
        content: `${env.metadata.keywords} ${t('message.navigation.navItems.imprint')}`
      }
    ]
  });
}
