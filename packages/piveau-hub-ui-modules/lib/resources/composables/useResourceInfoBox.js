import { computed, unref } from "vue";

export function useResourceInfoBox({ resources }) {

  return computed(() => {
    const resourceList = unref(resources);

    if (!resources || !resourceList) {
      return null;
    }

    const computedResources = resourceList.map((resource) => {
      return {
        id: resource.id,
        title: resource?.title,
        description: resource?.description,
        createdDate: resource?.releaseDate || "01.01.2024",
        updatedDate: resource?.modificationDate || "01.01.2024",
      };
    });

    return computedResources;
  });
}