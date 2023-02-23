// @ts-nocheck
// dynamic imports are somehow diffcult so we need to import everything :(

// import for DCAT-AP
import pageContent from './dcatap/page-content-config';
import inputDefinition from './dcatap/input-definition';
import prefixes from './dcatap/prefixes';
import formatTypes from './dcatap/format-types';

// import DCAT-AP.de
import pageContentDCATAPDE from './dcatapde/page-content-config';
import inputDefinitionDCATAPDE from './dcatapde/input-definition';
import prefixesDCATAPDE from './dcatapde/prefixes';
import formatTypesDCATAPDE from './dcatapde/format-types';

const config = {
    "pageConent": pageContent,
    "inputDefinition": inputDefinition,
    "formatTypes": formatTypes,
    "prefixes": prefixes,
};

// TODO: get to work
// overwrite definitions if DCAT-AP.de is selected
// if (this.$env.upload && this.$env.upload.specification === 'dcatapde') {        
//     config.pageConent = pageContentDCATAPDE;
//     config.inputDefinition = inputDefinitionDCATAPDE;
//     config.formatTypes = formatTypesDCATAPDE;
//     config.prefixes = prefixesDCATAPDE;
// }

export default config;