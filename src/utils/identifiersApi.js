import Axios from 'axios';

const createIdentifiersApi = ({ baseURL, authToken }) => {
  const maybeTrailingSlash = baseURL.endsWith('/') ? '' : '/';
  const api = Axios.create({
    baseURL: `${baseURL}${maybeTrailingSlash}identifiers`,
    headers: {
      'Content-Type': 'text/turtle',
      Authorization: `Bearer ${authToken}`,
    },
  });

  // Create persistent identifier for a dataset id (Register DOI)
  const createPersistentIdentifier = ({ id, catalogue, type = 'mock' }) => api
    .put(`/datasets/${id}`, null, { params: { catalogue, type } });

  return {
    createPersistentIdentifier,
  };
};

export default createIdentifiersApi;
