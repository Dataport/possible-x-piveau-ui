import { onMounted, watch } from "vue";

/**
 * Initiates a download of the dataset on mount and on route change
 * Needs router param ds_id and query param dl to be available
 * @param options
 */
export function useDownloadDatasetOnMount(options: { route: any, hubUrl: string }) {
  const { route, hubUrl } = options;
  
  if (!route.params.ds_id) {
    console.error('No dataset id found in route params');
    return;
  }

  const dlFormat = route.query.dl;
  const downloadOnRouteChange = () => {
    if (route.query.dl) {
      const url = `${hubUrl}${route.path}.${dlFormat}?useNormalizedId=true${route.query.locale ? `&locale=${route.query.locale}` : ''}`;
      if (!url) {
        return;
      }

      // Create a link element, hide it, direct it towards the URL, and then 'click' it programatically
      // This is the most cross browser solution to programmatically downloading content
      const link = document.createElement('a');
      link.href = url;
      const datasetId = route.params.ds_id;
      link.download = `${datasetId}.${dlFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  onMounted(downloadOnRouteChange);

  watch(() => route, downloadOnRouteChange);
}
