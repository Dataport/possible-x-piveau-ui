import { useHead } from '@unhead/vue';
import { useI18n } from 'vue-i18n';
import { useRuntimeEnv } from '../useRuntimeEnv';


export function usePrivacyPolicyHead() {
  const { t } = useI18n();
  const env = useRuntimeEnv();

  return useHead({
    title: () => t('message.navigation.navItems.privacyPolicy'),
    meta: [
      {
        name: 'description',
        vmid: 'description',
        content: `${t('message.navigation.navItems.privacyPolicy')} - ${env.metadata.description}`
      },
      {
        name: 'keywords',
        vmid: 'keywords',
        content: `${env.metadata.keywords} ${t('message.navigation.navItems.privacyPolicy')}`
      },
    ]
  });
}
