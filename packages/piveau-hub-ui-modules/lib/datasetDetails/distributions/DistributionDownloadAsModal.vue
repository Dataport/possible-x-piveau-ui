<template>
   <div class="modal fade" id="downloadAsModal" tabindex="-1" role="dialog" aria-labelledby="downloadAsModal" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.75);">
      <div class="modal-dialog  modal-dialog-centered modal-lg" role="document" >
         <div class="modal-content rounded-0">
            <div class="modal-header">
               <h5 class="modal-title" id="exampleModalLabel">{{ $t('message.datasetDetails.datasets.modal.downloadAs') }} ...</h5>
               <button ref="modal-close-btn" type="button" id="modal-close-btn" data-dismiss="modal" class="close" aria-label="Close">
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
                        <svg width="40" height="38" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="warning-icon">
                        <path d="M0 22L12 0L24 22H0ZM12 18.5263C12.3091 18.5263 12.5684 18.4152 12.7778 18.1928C12.9873 17.9705 13.0916 17.6957 13.0909 17.3684C13.0902 17.0411 12.9855 16.7663 12.7767 16.544C12.568 16.3217 12.3091 16.2105 12 16.2105C11.6909 16.2105 11.432 16.3217 11.2233 16.544C11.0145 16.7663 10.9098 17.0411 10.9091 17.3684C10.9084 17.6957 11.0131 17.9709 11.2233 18.194C11.4335 18.4171 11.6924 18.5279 12 18.5263ZM10.9091 15.0526H13.0909V9.26316H10.9091V15.0526Z" fill="#FBC712"/>
                        </svg>

                          <span> 
                            <span class="font-weight-bold ml-3">{{ $t('message.datasetDetails.datasets.modal.fileConversionFail') }}</span> <br>
                            <span class="ml-3">{{ $t('message.datasetDetails.datasets.modal.fileConversionTarget') }} </span>
                            <div class="ml-3 details"><strong>{{ $t('message.datasetDetails.datasets.modal.fileConversionDetails') }}</strong></div>
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
                <a v-if="error == true" :href="this.getDistributionDownloadAs.downloadUrls" target="_blank" class="ecl-button ecl-button--secondary">  
                {{ $t('message.datasetDetails.datasets.modal.fileConversionDownloadOriginal') }} <i class="material-icons align-middle mb-1">open_in_new</i>  </a>
            </div>
         </div>
      </div>
   </div>
</template>

<script >
import AppLink from "../../widgets/AppLink.vue";
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
    components: {
    AppLink
    },
    mounted() {
        // Add a listener to the modal close button
        const modalCloseBtnRef = this.$refs['modal-close-btn'];
        modalCloseBtnRef.addEventListener('click', () => {
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
                            const FILE = window.URL.createObjectURL(res.data);
                           

                            let docUrl = document.createElement('a');
                            docUrl.href = FILE;
                            docUrl.setAttribute('download', this.setFileName(locale));
                            document.body.appendChild(docUrl);
                            this.done = true;

                            docUrl.click();
                        })
                        .catch(async (e) => {              
                            console.error("Error", e)
                            if (axios.isCancel(e)) {
                                console.error('Request canceled:', e.message);
                            } else {
                                if (e.response) this.errorMsg = await e.response.data.text();
                                this.error = true;
                                this.downloadBtnText = 'Retry';
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
             if (typeof this.getDistributionDownloadAs.title === 'undefined') {
                return 'file'
            } 
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
  border: 3px solid #0e47cb;
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
  color: #0e47cb;
  opacity: 1;
  padding: 0.5rem!important;
  .close-icon {
    color:white;
    background: #0e47cb;
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
  border: 2px solid #FBC712;
  .error-body {
    padding: 1.8rem;
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

.details {
    margin-top: 30px;
}

.warning-icon {
    margin-top: 5px;
    margin-right: 7px
}
</style>
