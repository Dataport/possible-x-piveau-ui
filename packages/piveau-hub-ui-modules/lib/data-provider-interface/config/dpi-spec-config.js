// @ts-nocheck
// dynamic imports are somehow diffcult so we need to import everything :(

// import for DCAT-AP
import pageContent from './dcatap/page-content-config';
import inputDefinition from './dcatap/input-definition';
import prefixes from './dcatap/prefixes';
import formatTypes from './dcatap/format-types';
import vocabPrefixes from './dcatap/vocab-prefixes';

// import DCAT-AP.de
import pageContentDCATAPDE from './dcatapde/page-content-config';
import inputDefinitionDCATAPDE from './dcatapde/input-definition';
import prefixesDCATAPDE from './dcatapde/prefixes';
import formatTypesDCATAPDE from './dcatapde/format-types';
import vocabPrefixesDCATAPDE from './dcatapde/vocab-prefixes';

const config = {
    dcatap: {
        pageConent: pageContent,
        inputDefinition: inputDefinition,
        formatTypes: formatTypes,
        prefixes: prefixes,
        vocabPrefixes: vocabPrefixes,
    },
    dcatapde: {
        pageConent: pageContentDCATAPDE,
        inputDefinition: inputDefinitionDCATAPDE,
        formatTypes: formatTypesDCATAPDE,
        prefixes: prefixesDCATAPDE,
        vocabPrefixes: vocabPrefixesDCATAPDE,
    }
    
};

export default config;