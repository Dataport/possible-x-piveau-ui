// @ts-nocheck
import { plugins } from '@citation-js/core';
import dgs from './dg';

/**
 * Regex check for DOI
 * @param {String} doi the given string to check
 * @returns true, if doi is a DOI
 */
function checkDoi(doi = '') {
  return doi.match(/^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i);
}

/**
 * Regex check for pURI (EU Persistent URI)
 * @param {String} puri the given string to check
 * @returns true, if puri is a pURI
 */
function checkpUri(puri = '') {
  return puri.match(/^http:\/\/data\.europa\.eu(\/[^/]+){1,3}\/?$/i);
}

function dcatStateToCsl(state) {
  // eslint-disable-next-line no-underscore-dangle
  const meta = state.__meta;
  let doi;

  // If there is a DOI, return it directly for DOI content negotiation
  if (state.admsIdentifiers) {
    // check if there is a DOI
    const admsIdentifier = state.admsIdentifiers.find(({ identifier }) => checkDoi(identifier));
    doi = admsIdentifier && admsIdentifier.identifier;

    // return doi to let citation-js do their work
    if (!meta.skipDoiNegotiation && doi) return doi;
  }

  // If there is no DOI, create CSL object

  // Selected language and URL
  const lang = meta && (meta.lang || 'en');
  const URL = state.identifiers.find(checkpUri)
   || (meta && (meta.url || ''));

  // EUROSTAT identifier
  // Match all strings that are not pURI or DOI
  const hasPublisher = state.publisher && state.publisher.name;
  const publisherTrimmed = (hasPublisher && state.publisher.name.trim().toLowerCase()) || '';
  const isEurostat = publisherTrimmed === 'eurostat';
  const eurostatId = isEurostat
    ? state.identifiers.find(
      identifier => !checkDoi(identifier) && !checkpUri(identifier),
    )
    : null;

  // Creator
  const author = state.creator?.name && [{ literal: state.creator?.name }];

  // Provider
  // If publisher is in DG, prepend 'European Commission, ' before it
  const EUROPEAN_COMISSION = 'European Commission';
  const isDg = dgs.map(dg => dg.toLowerCase()).includes(publisherTrimmed);
  let publisher = isDg
    ? `${EUROPEAN_COMISSION}, ${state.publisher.name}`
    : state.publisher.name;
  // If author and publisher are identical, remove publisher;
  publisher = publisher === author ? null : publisher;

  // Date
  // If there are both release date and modification date available, prefer
  // modification date as the issued date.
  const issuedDate = state.modificationDate || state.releaseDate
    ? new Date(state.modificationDate || state.releaseDate)
    : null;

  // take release date as original date only if there's both release and
  // modification date available
  const originalDate = state.modificationDate && state.releaseDate
    ? new Date(state.releaseDate)
    : null;

  const date = {
    ...(issuedDate && {
      issued: {
        'date-parts': [[
          issuedDate.getFullYear(),
          issuedDate.getMonth() + 1,
          issuedDate.getDate(),
        ]],
      },
    }),
    ...(originalDate && {
      'original-date': {
        'date-parts': [[
          originalDate.getFullYear(),
          originalDate.getMonth() + 1,
          originalDate.getDate(),
        ]],
      },
    }),
  };

  const csl = [
    {
      type: 'dataset',
      id:
        state.admsIdentifiers && state.admsIdentifiers.length > 0
          ? `https://doi.org/${state.admsIdentifiers[0].identifier}`
          : state.identifiers[0],
      categories: state.categories.map(({ label }) => label[lang]) || [],
      language: lang,
      author,
      // contains 'issued' and 'original-date'
      ...date,
      // 'original-date': originalDate,
      abstract: state.description[lang],
      DOI: state.admsIdentifiers && state.admsIdentifiers.length > 0
        ? doi || state.admsIdentifiers
        : undefined,
      publisher,
      title: state.title[lang],
      'title-short': eurostatId || undefined,
      URL,
      version: state.versionInfo,
    },
  ];
  return csl;
}

// Add custom Vuex DatasetDetails state parser to citation-js
plugins.input.add('@piveau/dcat-state', {
  parse: dcatStateToCsl,
});

export default dcatStateToCsl;
