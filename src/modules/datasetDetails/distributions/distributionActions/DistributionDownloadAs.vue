<template>
   <span v-if="ifFormatMatches" class="dropdown-item d-block px-3 d-flex justify-content-end align-items-center">
      <a @click="openModal()" class="download-btn text-dark text-decoration-none px-2" data-toggle="modal" data-target="#downloadAsModal">Download as</a>
   </span>
</template>
<script>
import { isEmpty } from 'lodash';
import { mapActions } from 'vuex'

export default {
  name: "DownloadAs",
  props: {
    distribution: Object
  },
  data() {
    return {
      ifFormatMatches: false,
      selectOptions: [],
      convertionFormats: [
        {
          sourceFileFormat: 'HTML',
          targetFileFormat: [
            'html', 'pdf', 'docx', 'json', 'odt', 'rtf'
          ]
        },
        {
          sourceFileFormat: 'CSV',
          targetFileFormat: [
            'csv', 'docx', 'html', 'json', 'odt', 'rtf', 'xls', 'xlsx', 'xml'
          ]
        },
        {
          sourceFileFormat: 'JSON',
          targetFileFormat: [
            'json', 'xml',
          ]
        },
        {
          sourceFileFormat: 'ODT',
          targetFileFormat: [
            'odt', 'docx', 'html', 'json', 'rtf'
          ]
        },
        {
          sourceFileFormat: 'DOCX',
          targetFileFormat: [
            'docx', 'pptx', 'odt', 'pdf', 'txt', 'html', 'json', 'odt', 'rtf'
          ]
        },
        {
          sourceFileFormat: 'XLSX',
          targetFileFormat: [
            'xlsx', 'csv',
          ]
        },
        {
          sourceFileFormat: 'XLS',
          targetFileFormat: [
            'xls', 'csv',
          ]
        },
        {
          sourceFileFormat: 'PDF',
          targetFileFormat: [
            'pdf', 'txt',
          ]
        }

      ]
    }
  },
  created() {
    this.ifMatchesFormat(this.distribution.format.id);
  },
  methods: {
    ...mapActions('datasetDetails', [
      'selectDistributionForDownloadAs'
    ]),
    ifMatchesFormat(format) {
      if (isEmpty(format)) {
        return false
      } else {
        this.convertionFormats.forEach(convertionFormat => {
          if (convertionFormat.sourceFileFormat.toLowerCase() === format.toLowerCase()) {
            this.ifFormatMatches = true;
            this.selectOptions = convertionFormat.targetFileFormat;
          }
      });
     }
    },
    openModal() {
      const distribution = this.distribution
      const selectOptions = this.selectOptions
      this.selectDistributionForDownloadAs({distribution, selectOptions})
    }
  },
}
</script>
<style scoped lang="scss">
  .download-btn {font-size: 13px; cursor: pointer;}
</style>

