
/**
 * @deprecated
 */
export const DISALLOWED_CATALOG_IDS = ['open', 'odb', 'localhost', 'data'];
export const ALLOWED_CATALOG_IDS = ['augsburg'];

/**
 * @deprecated you shouldn't use this method
 * @param url 
 * @returns 
 */
export function getSubdomainCatalogIdFromUrl(url: string, allowedCatalogIds : string[] = ALLOWED_CATALOG_IDS): string {
  const host = new URL(url).host;
  const parts = host.split('.');
  if (parts.length > 1) {
    const catalogId = parts[0];
    return allowedCatalogIds.includes(catalogId) ?  catalogId: "";
  }
  return '';
}