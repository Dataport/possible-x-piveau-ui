import { useHead } from "@unhead/vue";
import { useRuntimeEnv } from "../useRuntimeEnv";
import { useRoute } from "vue-router";
import { computed } from "vue";

export function useRootHead() {
  const env = useRuntimeEnv();
  const route = useRoute();

  const titleTemplate = (chunk?: string) => chunk ? `${chunk} - ${env.metadata.title}` : env.metadata.title;
  const meta = [
    { name: 'description', vmid: 'description', content: env.metadata.description },
    { name: 'keywords', vmid: 'keywords', content: env.metadata.keywords },
    { name: 'minh', vmid: 'minh', content: 'ungabunga' },
  ];
  
  const htmlAttrs = computed(() => {
    const lang = route.query.locale;
    const langString = Array.isArray(lang) ? lang[0] : lang;
    return {
      lang: langString || env.languages.locale,
    }
  })


  return useHead({
    titleTemplate,
    meta,
    htmlAttrs,
  })
}