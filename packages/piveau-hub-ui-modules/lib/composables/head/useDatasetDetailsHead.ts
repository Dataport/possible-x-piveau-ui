import { useHead } from '@unhead/vue';
import { ComputedRef, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useRuntimeEnv } from '../useRuntimeEnv';
import { getTranslationFor } from '../../utils/helpers';
import { useStore } from 'vuex';

export function useDatasetDetailsHead() {
  const store = useStore();
  const route = useRoute();
  const env = useRuntimeEnv();

  const getTitle: ComputedRef<string> = computed(() => store.getters['datasetDetails/getTitle'] as string || '');
  const getLanguages: ComputedRef<string> = computed(() => store.getters['datasetDetails/getLanguages'] as string || '');

  const datasetTitleTranslated = computed(() => {
    return getTranslationFor(getTitle.value, route.query?.locale, getLanguages.value) as string;
  })

  const computedTitle = computed(() => {
    return datasetTitleTranslated.value ? `${datasetTitleTranslated.value} - ${env.metadata.title}` : ''
  })

  const head =  useHead(({
    titleTemplate: (chunk) => chunk ? `${chunk} - ${computedTitle.value}` : computedTitle.value,
  }))

  // hack: titleTemplate does not seem to be reactive,
  // so just patch it manually until we find a better solution
  watchEffect(() => {
    if (head && computedTitle.value) {
      head.patch({
        titleTemplate: (chunk) => chunk ? `${chunk} - ${computedTitle.value}` : computedTitle.value,
      })
    }
  })

  return {
    head,
    getTitle,
    getLanguages,
    datasetTitleTranslated,
    computedTitle,
  }
}