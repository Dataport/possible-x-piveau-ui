<template>
   <div class="modal fade" id="embedModal" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true" style="background-color: rgba(0, 0, 0, 0.75);">
      <div class="modal-dialog  modal-dialog-centered modal-lg" role="document"  style="z-index: 1100; max-width:52%;">
         <div class="modal-content border-none" style="border-radius: 0; padding: 1rem 2.125rem 2.75rem;">
            <button type="button" id="modal-close-btn" data-dismiss="modal" class="close" aria-label="Close">
               {{ $t('message.datasetDetails.datasets.modal.close') }}
               <span aria-hidden="true" class="close-icon rounded-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="white" xmlns:xlink="http://www.w3.org/1999/xlink" height="8" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="8" xml:space="preserve">
                     <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/>
                  </svg>
               </span>
            </button>
            <div class="modal-head">
               <h5  class="modal-title" id="exampleModalLabel" style="display: inline-block;">{{ $t('message.datasetDetails.datasets.modal.embedText') }}</h5>
            </div>
            <div class="modal-body">
               <div class="container" style="padding:0; margin:0;">
                  <div class="d-flex flex-row iframeSettings">
                     <div class="input-wrapper">
                        <label for="iframeWidth">{{ $t('message.datasetDetails.datasets.modal.width') }}</label><br>
                        <div class="input-with-px">
                           <input
                              type="number"
                              id="iframeWidth"
                              v-model="iframeWidth"
                              @input="updateEmbedCode"
                              :min="minRange"
                              :max="maxRange"
                              />
                        </div>
                     </div>
                     <div class="input-wrapper height" style="padding-left: 3.3rem">
                        <label for="iframeHeight">{{ $t('message.datasetDetails.datasets.modal.height') }}</label><br>
                        <div class="input-with-px">
                           <input
                              type="number"
                              id="iframeHeight"
                              v-model="iframeHeight"
                              @input="updateEmbedCode"
                              :min="minRange"
                              :max="maxRange"
                              />
                        </div>
                     </div>
                  </div>
               </div>
               <div class="ecl-form-group">
                  <label class="ecl-form-label" for="ebmedTextarea" style="font-size:18px; font-weight: 400; color: #000000;">{{ $t('message.datasetDetails.datasets.modal.code')}}</label>
                  <textarea id="ebmedTextarea" style="width: 100%; resize: none; padding: 20px 25px 0px 20px; overflow: hidden; font-size:18px; line-height: 1.1; color:#888888; margin-top: 1.375rem; word-break: break-all;float: left!important;"
                     class="ecl-text-area ecl-text-area--m" rows="4" :value="embedCode" readonly></textarea>
               </div>
            </div>
            <div class="modal-footer justify-content-start">
               <button @click="copy" class="ecl-button ecl-button--secondary px-4 py-3" style="float: left!important;" type="button">{{ $t('message.datasetDetails.datasets.modal.copy')}}</button>
               <span v-show="copied" class="copied">
                  <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <g clip-path="url(#clip0_13_474)">
                        <path d="M14.2857 20.125V21.9219C14.2857 22.5173 13.806 23 13.2143 23H1.07143C0.479688 23 0 22.5173 0 21.9219V5.39062C0 4.79519 0.479688 4.3125 1.07143 4.3125H4.28571V17.6094C4.28571 18.9965 5.40719 20.125 6.78571 20.125H14.2857ZM14.2857 4.67188V0H6.78571C6.19397 0 5.71429 0.482686 5.71429 1.07812V17.6094C5.71429 18.2048 6.19397 18.6875 6.78571 18.6875H18.9286C19.5203 18.6875 20 18.2048 20 17.6094V5.75H15.3571C14.7679 5.75 14.2857 5.26484 14.2857 4.67188ZM19.6862 3.27799L16.7424 0.315756C16.5414 0.113582 16.2689 1.49498e-06 15.9848 0L15.7143 0V4.3125H20V4.04032C20 3.75439 19.8871 3.48018 19.6862 3.27799Z" fill="#464646"/>
                     </g>
                     <defs>
                        <clipPath id="clip0_13_474">
                           <rect width="20" height="23" fill="white"/>
                        </clipPath>
                     </defs>
                  </svg>
                  {{ $t('message.datasetDetails.datasets.modal.copied') }}
               </span>
            </div>
         </div>
      </div>
   </div>
</template>

<script >
export default {
    name: "embed-modal",
    data() {
    return {
      iframeWidth: this.$env.content.datasetDetails.embed.defaultWidth,
      iframeHeight: this.$env.content.datasetDetails.embed.defaultHeight,
      embedCode: '',
      copied: false,
      minRange: this.$env.content.datasetDetails.embed.minRange,
      maxRange: this.$env.content.datasetDetails.embed.maxRange,
    };
  },
  methods: {
    updateEmbedCode() {
        // Ensure the input values are within the specified range
        this.iframeWidth = Math.min(Math.max(this.iframeWidth, this.minRange), this.maxRange);
        this.iframeHeight = Math.min(Math.max(this.iframeHeight, this.minRange), this.maxRange);
         // Generate the embed code
        const currentURL = window.location.href.replace(/\?.*$/, '') + '/embed';
        this.embedCode = `<iframe src="${currentURL}" width="${this.iframeWidth}" height="${this.iframeHeight}" frameborder="0"></iframe>`;
    },
    copy() {
      navigator.clipboard.writeText(this.embedCode)
        .then(() => {
          this.copied = true;
          setTimeout(() => {
            this.copied = false;
          }, 3000);
        })
        .catch((error) => {
          // Handle the error
          console.error('Failed to copy: ', error);
        });
    }
  },
  created() {
    // Initialize the embed code with default values
    this.updateEmbedCode();
  }
}
</script>

<style scoped lang="scss">
.modal-title {
  float: left!important;
  font-family: 'Arial';
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  // line-height: 24px;
  color: #000000;
}
.modal-head {
  border-bottom: none;
  padding: 0;
  padding-bottom: 1rem;
}
.modal-body {
  border-top: 1px solid #e9ecef;
  padding: 0;
}
.ecl-button {
    font-size: 16px;
}
.modal-footer {
  border-top: none;
   padding: 2.438rem 0 0 0;
   font-size: 16px;
}
.close {
  font-size: 14px;
  color: #1C3D66;
  opacity: 1;
  padding: 0.5rem!important;
  text-align: right;
  .close-icon {
    color:white;
    background: #1C3D66;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 16px;
    height: 16px;
    float: right;
    margin-left: 10px;
  }
}
.active {
  color: #000000!important;
}
.iframeSettings {
    padding: 1.875rem 0 2.438rem 0;
    font-size: 18px;

    input {
        padding: 1.563rem 0rem;
    }
 /* Style the input field wrapper */
.input-with-px {
  position: relative;
  margin-top: 5px;

}

.input-with-px input {
  padding: 15px 50px 15px 50px;
  border: 1px solid #A5A5A5;
}

/* Style the "px" text */
.input-with-px::after {
  content: "px";
  position: absolute;
  right: 22%;
  top: 54%;
  transform: translateY(-50%);
  color: #777;
  pointer-events: none; /* Prevent interaction with the "px" span */
}
}
.copied {
    margin-left: 30px;
}
/* Firefox-specific styles */
@-moz-document url-prefix() {
  .input-with-px input {
    max-width: 240px;
  }
}
@media screen and (max-width: 1100px) {
  .iframeSettings {
    flex-direction: column!important;
  }
  .height {
    padding-left: 0!important;
    margin-top: 10px;
  }
  #ebmedTextarea {
    padding-bottom: 20px!important;
  }
}
</style>
