<script setup>
import { isNil } from 'lodash';
import axios from 'axios';
import { useStore } from 'vuex';

const store = useStore();
const isEditMode = store.getters['auth/getIsEditMode'];
const validationMessages = {
  idformatvalid: "Dataset ID must only contain lower case letters, numbers and single dashes (-). Please choose a different ID.",
  idunique: "This ID is already in use, please choose a different one."
};

async function idunique(node) {
  let isUniqueID = true;

  const draftIDs = store.getters['auth/getUserDraftIds'];

  new Promise(() => {
    if (isNil(node.value) || node.value === '' || node.value === undefined) isUniqueID = true;
    else if (draftIDs.includes(node.value)) isUniqueID = false;
    else {
      // TODO: insert env hubUrl
      const request = `https://piveau-hub-repo-piveau.apps.osc.fokus.fraunhofer.de/datasets/${node.value}?useNormalizedId=true`;
      axios.head(request)
        .then(() => {
          isUniqueID = false;
        })
        .catch((e) => {
          isUniqueID = true;
        });
    }
  });

  return isUniqueID
}

function idformatvalid(node) {
  return /^[a-z0-9-]*$/.test(node.value);
}

</script>

<template>
  <h4>{{ $t(`message.dataupload.datasets.datasetID.label`) }}</h4>
  
  <FormKit v-if="!isEditMode" type="text" name="datasetID" id="datasetID"
    :placeholder="$t(`message.dataupload.datasets.datasetID.label`)"
    :info="$t(`message.dataupload.datasets.datasetID.info`)"
    :help="$t(`message.dataupload.datasets.datasetID.help`)"
    :validation-rules="{ idformatvalid, idunique }" 
    validation="idformatvalid|idunique|required" 
    validation-visibility="live"
    :validation-messages="validationMessages"
    outer-class="formkitCmpWrap m-0 p-3"
    >
  </FormKit>
  <FormKit v-else type="text" name="datasetID" id="datasetID" :disabled="true"
    :info="$t(`message.dataupload.datasets.datasetID.info`)"
    :help="$t(`message.dataupload.datasets.datasetID.help`)">
  </FormKit>
</template>

<script>
export default {
  props: ['context']
}
</script>

<style></style>
