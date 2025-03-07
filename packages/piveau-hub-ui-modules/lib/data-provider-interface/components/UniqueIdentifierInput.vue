<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import { isNil } from 'lodash';
import axios from 'axios';
import { useStore } from 'vuex';
import { getCurrentInstance } from "vue";

let env = getCurrentInstance().appContext.app.config.globalProperties.$env;

const store = useStore();
const isEditMode = ref();
isEditMode.value = store.getters['auth/getIsEditMode'];

const validationMessages = {
  idformatvalid: "Dataset ID must only contain lower case letters, numbers and single dashes (-). Please choose a different ID.",
  idunique: "This ID is already in use, please choose a different one."
};

async function idunique(node) {
  let isUniqueID = true;
  let hubUrl = env.api.hubUrl;
  const draftIDs = store.getters['auth/getUserDraftIds'];

  new Promise(() => {
    if (isNil(node.value) || node.value === '' || node.value === undefined) isUniqueID = true;
    else if (draftIDs.includes(node.value)) isUniqueID = false;
    else {
      const request = `${hubUrl}datasets/${node.value}?useNormalizedId=true`;
      axios.head(request)
        .then(() => {
          isUniqueID = false;
        })
        .catch((e) => {
          isUniqueID = true;
        });
    }
  });
  return isUniqueID;
}

function idformatvalid(node) {
  return /^[a-z0-9-]*$/.test(node.value);
}

</script>

<template>
  <div class="formkitProperty DSid">
    <h4>{{ $t(`message.dataupload.datasets.datasetID.label`) }}</h4>

    <FormKit v-if="!isEditMode" type="text" name="datasetID" id="datasetID"
      :placeholder="$t(`message.dataupload.datasets.datasetID.label`)"
      :info="$t(`message.dataupload.datasets.datasetID.info`)" :help="$t(`message.dataupload.datasets.datasetID.help`)"
      :validation-rules="{ idformatvalid, idunique }" validation="idformatvalid|idunique|required"
      validation-visibility="live" :validation-messages="validationMessages" outer-class="formkitCmpWrap p-3">
    </FormKit>
    <FormKit v-else type="text" name="datasetID" id="datasetID" :disabled="true"
      :info="$t(`message.dataupload.datasets.datasetID.info`)" :help="$t(`message.dataupload.datasets.datasetID.help`)">
    </FormKit>
  </div>
</template>

<script>
export default {
  props: ['context']
}
</script>

<style></style>
