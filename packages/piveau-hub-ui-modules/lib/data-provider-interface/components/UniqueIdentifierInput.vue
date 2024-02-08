<script setup>
  import { isNil } from 'lodash';
  import axios from 'axios';
  import { useStore } from 'vuex';

  const store = useStore();
  const isEditMode = store.getters['auth/getIsEditMode'];

  // Validation messages

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
  <h4>ID</h4>
  <FormKit v-if="!isEditMode" type="text" name="datasetID" id="datasetID"
    :validation-rules="{ idformatvalid, idunique }" 
    validation="idformatvalid|idunique|required" 
    validation-visibility="live">
  </FormKit>
  <FormKit v-else type="text" name="datasetID" id="datasetID" :disabled="true"></FormKit>
</template>

<script>
export default {
  props: ['context']
}
</script>

<style></style>
