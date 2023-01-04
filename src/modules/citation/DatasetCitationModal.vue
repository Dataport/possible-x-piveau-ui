/**
 * Shows a modal with the dataset citation based on the current state of DatasetDetails store.
 */

<template>
  <div class="modal fade" id="citationModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true" data-cy="citation-modal">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title" id="deleteModalLabel">
              {{ $t('message.cite.title') }}
            </h2>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" data-cy="citation-modal-close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-borderless table-responsive">
              <tbody>
                <tr>
                  <th scope="row" class="text-muted font-weight-light">
                    {{  availableCitationStyles[citationStyle] }}
                  </th>
                  <td v-if="isReady"><div ref="bibliography" v-html="bibliographyHtml" data-cy="bibliography" /></td>
                  <td v-else><div>...</div></td>
                </tr>
              </tbody>
            </table>
            <div class="mt-3 d-flex justify-content-start align-items-center">
              <button
                class="btn btn-sm btn-outline-primary"
                :disabled="!isReady"
                @click="handleCopyToClipboard"
                data-cy="citation-copy-to-clipboard"
              >
                {{ $t('message.cite.copyToClipboard') }}
              </button>
            </div>
          </div>
          <!-- Export options -->
          <!-- Currently unused but might be useful in the future -->
          <div v-if="false" class="modal-footer">
            <button
              v-for="({name, args, postprocess, extension, disabled}, format) in exportFormats"
              :key="`format@${format}`"
              type="button"
              class="btn btn-link"
              :disabled="disabled || getLoading || !citation"
              @click="handleCitationExport({ args, postprocess, extension, filename: getID })"
            >
              {{ name }}
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import { debounce } from 'lodash-es';
import { mapGetters } from 'vuex';
import { getRepresentativeLocaleOf } from '../utils/helpers';

export default {
  props: {
    modalId: {
      type: String,
      required: true,
    },
    citationStyle: {
      type: String,
      required: true,
    },
    availableCitationStyles: {
      type: Object,
      required: true,
    },
  },
  emits: ['ready'],
  data: () => ({
    currentCitationId: null,
    citation: null,
    // Currently unused, but might be useful in the future
    // exportFormats: {
    //   bibtex: {
    //     name: 'BibTeX',
    //     format: 'bibtex',
    //     args: ['biblatex'],
    //     extension: 'bib',
    //   },
    //   datacite: {
    //     name: 'DataCite XML',
    //     format: 'datacite',
    //     args: ['data'],
    //     extension: 'xml',
    //     // todo
    //     disabled: true,
    //   },
    //   json: {
    //     name: 'JSON',
    //     format: 'json',
    //     args: ['data', { format: 'object' }],
    //     extension: 'json',
    //     postprocess: o => JSON.stringify(o[0], null, 2),
    //   },
    //   jsonld: {
    //     name: 'JSON-LD',
    //     format: 'json-ld',
    //     extension: 'jsonld',
    //     // todo
    //     disabled: true,
    //   },
    // },
  }),
  computed: {
    ...mapGetters('datasetDetails', [
      'getLoading',
      'getID',
    ]),
    /**
     * Provide bibliography html based on current citation and citation style
     */
    bibliographyHtml() {
      if (!this.citation) {
        return '';
      }
      let bibliography = this.citation.format('bibliography', {
        format: 'html',
        template: this.citationStyle || 'apa',
        lang: 'en-US',
      });

      // Bibliography conditional post-processing
      // Remove Vancouver citation style numbering header from bibliography
      const isVancouver = this.citationStyle === 'vancouver';
      bibliography = bibliography && isVancouver
        ? bibliography.replace(/<div class="csl-left-margin">\d+\. <\/div>/g, '')
        : bibliography;

      return bibliography || '';
    },
    /**
     * Provide bibliography text for clipboard content
     */
    bibliographyText() {
      if (!this.citation) {
        return '';
      }

      const bibliographyText = this.citationStyle === 'vancouver'
        // If vancouver style, refer to html text content because it has postformatting applied
        ? this.$refs.bibliography.textContent.trim()
        // Otherwise, just format bibliography as text
        : this.citation.format('bibliography', {
          format: 'text',
          template: this.citationStyle || 'apa',
          lang: 'en-US',
        });

      return bibliographyText || '';
    },
    isReady() {
      this.$emit('ready');
      return !this.getLoading && this.citation && this.bibliographyHtml;
    },
  },
  watch: {
    // Update citation when dataset details are loaded
    // Uses watcher instead of computed property because computed is unable to
    // handle async code (i.e. citation retrieval per http request)
    getLoading: {
      /**
       * Assign citation object (CSL) based on current dataset in store to vm.citation
       */
      handler(isLoading) {
        if (isLoading) return;
        if (this.currentCitationId === this.getID) return;

        this.currentCitationId = this.getID;

        // For some reason, IS_LOADING commit is triggered multiple times
        // and may result in store that is not ready yet.
        // workaround: debounce to always get the latest dataset.
        this.retrieveCitation(this);
      },
      immediate: true,
    },
  },
  async created() {
    const { plugins } = await import('@citation-js/core');

    const {default: installDcatStateToCsl} = await import('./plugins/dcat-state-to-csl');
    const {default: installCslAddAccessed} = await import('./plugins/csl-add-accessed');
    installDcatStateToCsl(plugins);
    installCslAddAccessed(plugins);

    const { default: deu } = await import('./template/deu');
    const styleConfig = plugins.config.get('@csl');
    if (styleConfig) {
      // styleConfig.templates.add(chicago.name, chicago.csl);
      // styleConfig.templates.add(datacite.name, datacite.csl);
      styleConfig.templates.add(deu.name, deu.csl);
    }
  },
  methods: {
    /**
     * Retrieves Citation Style Language (CSL) based on current dataset in store
     * Side-effect: sets vm.citation to the resulting citation object
     * @param vm Vue instance
     */
    retrieveCitation: debounce(async (vm) => {
      // Deep-clone state to avoid any unintended mutations while citation is generated
      const dataset = JSON.parse(JSON.stringify(vm.$store.state.datasetDetails.dataset));
      Object.freeze(dataset);

      if (!dataset || !dataset.id) return null;

      const citationParams = [{
        // Pass some additional data to the dataset object
        __meta: {
          // Pass the chosen dataset language for the bibliography
          lang: getRepresentativeLocaleOf(dataset.title, vm.$route.query.locale || 'en', dataset.languages),
          // Pass dataset URL for the bibliography
          url: `http://data.europa.eu/88u/dataset/${dataset.id || vm.$route.params.ds_id}`,
          skipDoiNegotiation: false,
        },
        ...dataset,
      }, {
        forceType: '@piveau/dcat-state',
        generateGraph: false,
      }];

      let citation = null;

      const { Cite } = await import('@citation-js/core')
      await import('@citation-js/plugin-csl');
      await import('@citation-js/plugin-doi');
      try {
        citation = await Cite.async(...citationParams);
        // eslint-disable-next-line no-param-reassign
        vm.citation = citation;
        return citation;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }

      // Retry by using manual citation generation as fallback
      // in case above DOI content negotiation service fails
      try {
        // eslint-disable-next-line no-underscore-dangle
        citationParams[0].__meta = { ...citationParams[0].__meta, skipDoiNegotiation: true };
        citation = await Cite.async(...citationParams);
        // eslint-disable-next-line no-param-reassign
        vm.citation = citation;
        return citation;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }

      return citation;
    }, 500),
    /**
     * Handle export of the citation
     *
     * @param {Object} format - The export format object
     * @param {String} format.args - The arguments to be passed into citation.format
     * @param {String} format.postprocess - A function to be called on the result of citation.format
     * @param {String} format.extension - The file extension
     * @param {String} format.filename - The filename
     */
    // handleCitationExport({
    //   args,
    //   postprocess = o => o,
    //   extension,
    //   filename = 'dataset',
    // }) {
    //   const exportedCitation = this.citation.format(
    //     ...args,
    //     { graph: false },
    //   );
    //   const postprocessedCitation = postprocess(exportedCitation);

    //   this.download(`${filename}.${extension}`, postprocessedCitation);
    // },
    /**
     * Download the given content as a file
     *
     * @see https://stackoverflow.com/a/45831280
     *
     * @param {String} filename - The filename
     * @param {String} content - The content to be downloaded
     */
    // download(filename, text) {
    //   const element = document.createElement('a');
    //   element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`);
    //   element.setAttribute('download', filename);

    //   element.style.display = 'none';
    //   document.body.appendChild(element);

    //   element.click();

    //   document.body.removeChild(element);
    // },
    /**
     * Copy the bibliography to the clipboard
     */
    async handleCopyToClipboard() {
      // Select the bibliography text
      window.getSelection().selectAllChildren(this.$refs.bibliography);

      // Copy the text to the clipboard
      try {
        await navigator.clipboard.writeText(this.bibliographyText);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy to clipboard: ', err);
      }
    },
  },
};
</script>
