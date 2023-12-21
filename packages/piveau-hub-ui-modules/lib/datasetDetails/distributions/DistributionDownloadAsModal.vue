<template>
   <div class="modal fade" id="downloadAsModal" tabindex="-1" role="dialog" aria-labelledby="downloadAsModal" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.75);">
      <div class="modal-dialog  modal-dialog-centered modal-lg" role="document" >
         <div class="modal-content rounded-0">
            <div class="modal-header">
               <h5 class="modal-title" id="exampleModalLabel">{{ $t('message.datasetDetails.datasets.modal.downloadAs') }} ...</h5>
               <button type="button" id="modal-close-btn" data-dismiss="modal" class="close" aria-label="Close">
                  {{ $t('message.datasetDetails.datasets.modal.close') }}
                  <span aria-hidden="true" class="close-icon rounded-circle">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="white" xmlns:xlink="http://www.w3.org/1999/xlink" height="8" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="8" xml:space="preserve">
                        <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/>
                     </svg>
                  </span>
               </button>
            </div>
            <div class="modal-body">
               <div class="align-items-center">
                  <div>
                     <div class="ecl-form-group">
                        <div class="ecl-select__container ecl-select__container--m">
                           <select v-model="selected" @change="onChange()" class="ecl-select coursor-pointer" id="select-default"
                              required="">
                              <option value="" disabled hidden>- {{ $t('message.datasetDetails.datasets.modal.selectFileFormat') }} -</option>
                              <option v-for="(option, index) in getDistributionDownloadAsOptions" :key="index" :value="option" v-text="option.toUpperCase()"></option>
                           </select>
                           <div class="ecl-select__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="16" height="8" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 298.04"><path fill="#ffffff" fill-rule="nonzero" d="M12.08 70.78c-16.17-16.24-16.09-42.54.15-58.7 16.25-16.17 42.54-16.09 58.71.15L256 197.76 441.06 12.23c16.17-16.24 42.46-16.32 58.71-.15 16.24 16.16 16.32 42.46.15 58.7L285.27 285.96c-16.24 16.17-42.54 16.09-58.7-.15L12.08 70.78z"/></svg>
                           </div>
                        </div>
                     </div>
                     <div v-if="error" class="error mt-4">
                       <div class="error-body">
                          <span>
                            <svg width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                              <rect width="31" height="30" fill="url(#pattern0)"/>
                              <defs>
                              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                              <use xlink:href="#image0_29_137" transform="translate(-0.2 -0.358491) scale(0.0181818 0.0188679)"/>
                              </pattern>
                              <image id="image0_29_137" width="91" height="88" xlink:href="data:image/png;base64,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"/>
                              </defs>
                              </svg>
                          </span>
                          <span>
                            <p class="font-weight-bold ml-3">{{ $t('message.datasetDetails.datasets.modal.fileConversionFail') }}</p>
                            <p class="ml-3">{{ errorMsg }}</p>
                          </span>
                       </div>
                     </div>

                     <div v-if="converting">
                        <div class="d-flex mt-4">
                           <p class="m-0">1 {{ $t('message.datasetDetails.datasets.modal.fileConversionTo') }} <span class="font-weight-bold">{{selected.toUpperCase()}}</span></p>
                           <i v-if="converted" class="success rounded-circle">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-check" viewBox="0 0 16 16">
                                 <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                              </svg>
                           </i>
                        </div>
                        <div class="d-flex mt-2">
                           <p :class="{ active: converted }" class="m-0" style="color:#A8A8A8;">2 {{ $t('message.datasetDetails.datasets.modal.downloading') }} </p>
                           <i v-if="readyForDownload" class="success rounded-circle">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-check" viewBox="0 0 16 16">
                                 <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                              </svg>
                           </i>
                        </div>
                        <div class="w-100 text-right">{{this.progress + '%'}}</div>
                        <div class="progress mt-2">
                           <div class="progress-bar" role="progressbar" v-bind:style="{ width: progress + '%' }" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div class="modal-footer justify-content-start">
               <button v-if="!done" @click="download" type="button" class="ecl-button ecl-button--secondary" v-text="downloadBtnText"></button>
               <button v-if="done" type="button" class="ecl-button ecl-button--secondary" data-dismiss="modal" aria-label="Close">Done</button>
            </div>
         </div>
      </div>
   </div>
</template>

<script >
import $ from 'jquery'
import {
    mapGetters
} from 'vuex'
import axios from 'axios'
import {
    late
} from 'zod'


export default {
    name: "download-as-modal",
    data() {
        return {
            selected: '',
            converting: false,
            converted: false,
            readyForDownload: false,
            error: false,
            done: false,
            progress: '0',
            downloadBtnText: 'Download',
            errorMsg: '',
            source: null,
        }
    },
    computed: {
        ...mapGetters('datasetDetails', [
            'getDistributionDownloadAsOptions',
            'getDistributionDownloadAs',
        ])
    },
    mounted() {
        // Add a listener to the modal close button
        document.getElementById('modal-close-btn').addEventListener('click', () => {
            if (this.source) {
                // Cancel the ongoing request
                this.source.cancel('Download was canceled by user');
            }
        });
        const scope = this;
        $('#downloadAsModal').on('hide.bs.modal', () => {
            scope.selected = scope.errorMsg = '';
            scope.converting = scope.converted = scope.readyForDownload = scope.error = scope.done = false;
            scope.progress = '0';
            scope.downloadBtnText = 'Download';
        })
    },
    methods: {
        download() {
            this.error = false;
            const ifDownloadUrl = this.getDistributionDownloadAs.downloadUrls.length;
            const ifAccessUrl = this.getDistributionDownloadAs.accessUrl.length;

            if (this.selected.toLowerCase() === this.getDistributionDownloadAs.format.id.toLowerCase()) {
                if (ifDownloadUrl) {
                    window.open(this.getDistributionDownloadAs.downloadUrls[0]);
                    this.done = true;
                } else if (ifAccessUrl) {
                    window.open(this.getDistributionDownloadAs.accessUrl[0]);
                    this.done = true;
                }
            } else {
                this.converting = true;
                this.downloadBtnText = 'Converting...';

                if (ifDownloadUrl || ifAccessUrl) {
                    let url = '';
                    if (ifDownloadUrl) {
                        url = this.getDistributionDownloadAs.downloadUrls[0];
                    } else if (!ifDownloadUrl && ifAccessUrl) {
                        url = this.getDistributionDownloadAs.accessUrl[0];
                    }
                    this.progress = '3' + this.randomNumber();

                    const uri = encodeURIComponent(`${this.$env.content.datasetDetails.downloadAs.url}/${this.getDistributionDownloadAs.format.id.toLowerCase()}/${this.selected}`);
                    const downloadOrAccessUrl = encodeURIComponent(url);

                    // Create a cancel token
                    const CancelToken = axios.CancelToken;
                    this.source = CancelToken.source();

                    axios({
                            url: `${this.$env.content.datasetDetails.downloadAs.proxyUrl}/?uri=${uri}/?url=${downloadOrAccessUrl}`,
                            method: 'GET',
                            responseType: 'blob',
                            headers: {
                                'Content-Type': 'application/octet-stream; charset=UTF-8'
                            },
                            cancelToken: this.source.token,
                        }).then((res) => {
                            this.progress = '8' + this.randomNumber();
                            this.converted = true;
                            this.downloadBtnText = 'Downloading...';

                            this.progress = '100';
                            this.readyForDownload = true;
                            const locale = this.$route.query.locale;
                            let FILE;
                            if (this.selected === 'json') {
                                const jsonString = JSON.stringify(res.data);
                                FILE = window.URL.createObjectURL(new Blob([jsonString], {
                                    type: 'application/json'
                                }));
                            } else if (this.selected === 'xlsx') {
                                FILE = window.URL.createObjectURL(new Blob([res.data], {
                                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                }))
                            } else if (this.selected === 'xls') {
                                FILE = window.URL.createObjectURL(new Blob([res.data], {
                                    type: 'application/vnd.ms-excel'
                                }))
                            } else {
                                FILE = window.URL.createObjectURL(new Blob([res.data]));
                            }

                            let docUrl = document.createElement('a');
                            docUrl.href = FILE;
                            docUrl.setAttribute('download', this.setFileName(locale));
                            document.body.appendChild(docUrl);
                            this.done = true;

                            docUrl.click();
                        })
                        .catch((e) => {
                            if (axios.isCancel(e)) {
                                console.log('Request canceled:', e.message);
                            } else {
                                if (e.response) this.errorMsg = e.response.data;
                                this.error = true;
                                this.downloadBtnText = 'Download';
                                this.converting = false;
                            }
                        });
                }
            }
        },
        onChange() {
            this.done = this.converted = this.converting = this.readyForDownload = this.error = false;
            this.downloadBtnText = 'Download';
        },
        // 0 - 9
        randomNumber() {
            const max = 10;
            return Math.floor(Math.random() * max);
        },
        setFileName(locale) {
            if (this.getDistributionDownloadAs.title[locale]) {
                return this.getDistributionDownloadAs.title[locale].split('.')[0] + '.' + this.selected;
            } else {
                return Object.values(this.getDistributionDownloadAs.title)[0].split('.')[0] + '.' + this.selected;
            }
        }
    }
}
</script>

<style scoped lang="scss">
.success {
  background: #00997A;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  height: 20px;
  width:20px;
}
.modal-title {
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  line-height: 24px;
  color: #000000;
}
.modal-content {
  border: 3px solid #1C3D66;
}
.modal-header {
  padding: 1.5rem 1.5rem 0rem 1.5rem;
  border-bottom: none;
}
.modal-body {
  padding: 1rem 1.5rem;
}
.modal-footer {
  border-top: none;
   padding: 1rem 1.5rem;
}
.close {
  font-size: 16px;
  color: #1C3D66;
  opacity: 1;
  padding: 0.5rem!important;
  .close-icon {
    color:white;
    background: #1C3D66;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 12px;
    height: 12px;
    float: right;
    margin-top: 3px;
    margin-left: 10px;
  }
}
.active {
  color: #000000!important;
}
.error {
  border: 2px solid #DA2131;
  .error-body {
    padding: 1rem;
    display: flex;
  }
}
.progress-bar {
-webkit-transition : width 1s ease;
   -moz-transition : width 1s ease;
     -o-transition : width 1s ease;
        transition : width 1s ease;
}
.ecl-select {
  cursor: pointer;
}
</style>
