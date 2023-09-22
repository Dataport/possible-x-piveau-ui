
/**
 * @deprecated
 */
export const DISALLOWED_CATALOG_IDS = ['open', 'odb', 'localhost', 'data'];

/**
 * @deprecated you shouldn't use this method
 * @param url 
 * @returns 
 */
export function getSubdomainCatalogIdFromUrl(url: string, disallowedCatalogIds : string[] = DISALLOWED_CATALOG_IDS): string {
  const host = new URL(url).host;
  const parts = host.split('.');
  if (parts.length > 1) {
    const catalogId = parts[0];
    return disallowedCatalogIds.includes(catalogId) ? '' : catalogId;
  }
  return '';
}