import { onMounted, watch } from "vue";
import type { Router } from 'vue-router';

/**
 * Initiates a download of the dataset on mount and on route change
 * Needs router param ds_id and query param dl to be available
 * @param options
 */
export function useDownloadDatasetOnMount(options: { router: Router, hubUrl: string }) {
  const { router, hubUrl } = options;

  console.log(router)
  
  if (!router.currentRoute.params.ds_id) {
    console.error('No dataset id found in route params');
    return;
  }

  const dlFormat = router.currentRoute.query.dl;
  const downloadOnRouteChange = () => {
    if (router.currentRoute.query.dl) {
      const url = `${hubUrl}${router.currentRoute.path}.${dlFormat}?useNormalizedId=true${router.currentRoute.query.locale ? `&locale=${router.currentRoute.query.locale}` : ''}`;
      if (!url) {
        return;
      }

      // Create a link element, hide it, direct it towards the URL, and then 'click' it programatically
      // This is the most cross browser solution to programmatically downloading content
      const link = document.createElement('a');
      link.href = url;
      const datasetId = router.currentRoute.params.ds_id;
      link.download = `${datasetId}.${dlFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  onMounted(downloadOnRouteChange);

  watch(() => router.currentRoute, downloadOnRouteChange);
}
