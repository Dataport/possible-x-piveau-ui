import { computed, unref } from "vue";
import { getTranslationFor } from "../../utils/helpers";

export function useResourceInfoBox({ resources, locale }) {

  return computed(() => {
    const resourceList = unref(resources);
    const l = unref(locale);

    if (!resources || !resourceList) {
      return null;
    }

    const computedResources = resourceList.map((resource) => {
      return {
        id: resource,
        title: getTranslationFor(resource?.title, l) || resource,
        createdDate: resource?.releaseDate || "01.01.2024",
        updatedDate: resource?.modificationDate || "01.01.2024",
      }
    });

    return computedResources;
  });
}