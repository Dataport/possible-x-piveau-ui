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
        name: resource?.name,
        description: resource?.description,
        createdDate: resource?.releaseDate,
        updatedDate: resource?.modificationDate,
      };
    });

    return computedResources;
  });
}