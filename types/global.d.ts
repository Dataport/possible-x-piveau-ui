export type DistributionFormat = 'default' | 'html' | 'json' | 'xml' | 'txt' | 'csv' | 'xls' | 'zip' | 'api' | 'pdf' | 'shp' | 'ld' | 'rdf' | 'nquad' | 'ntriples' | 'turtle'

export type Dataset = {
  /**
   * Dataset title
   */
  title?: string;

  /**
   * Dataset description
   */
  description?: string;

  /**
   * Catalog description
   */
  catalog?: string;

  /**
   * Distribution format hints
   */
  formats?: DistributionFormat[] | null;

  // todo: information about modified and created date
}
