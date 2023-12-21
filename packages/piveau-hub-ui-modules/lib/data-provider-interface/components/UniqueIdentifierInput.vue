<template>
  <div
    :class="`formkit-input-element`"
    id="datasetID"
    ref="datasetID"
    v-bind="$attrs"
  >
    <div v-if="getIsEditMode">
      <FormKit
        v-model="uniqueID"
        type="text"
        name="datasetID"
        :disabled="true"
        class="w100-textfield"
        suffix-icon="add">
      </FormKit>
    </div>
    <div v-else>
      <FormKit
        v-model="uniqueID"
        @input="checkUniqueID"
        id="datasetIDForm"
        type="text"
        name="datasetID"
        class="w100-textfield"
        suffix-icon="add"
        :placeholder="$t('message.dataupload.createUniqueID')"
        :validation="validation"
        :validation-rules="validationRules"
        :validation-messages="validationMessages">
      </FormKit>
    </div>
  </div>
</template>

<script>
/* eslint-disable,arrow-parens,no-param-reassign */
import axios from 'axios';
import { mapGetters } from 'vuex';
import { isNil } from 'lodash-es';

export default {
  data() {
    return {
      draftIDs: [],
      isUniqueID: true,
      uniqueID: '',
      validation: 'optional|validateID|idDuplicate',
      validationRules: {
        validateID: () => /^[a-z0-9-]*$/.test(this.uniqueID),
      },
      validationMessages: {
        validateID: 'Dataset ID must only contain lower case letters, numbers and dashes (-). Please choose a different ID.',
      },
    };
  },
  props:{
    context: Object,
  },
  computed: {
    ...mapGetters('auth', [
      'getIsEditMode',
      'getUserDrafts',
    ]),
    rawTitle() {
      return this.$formkit.get("title")?.context.value[0]['@value'];
    },
  },
  methods: {
    checkUniqueID(uniqueID) {
      this.draftIDs = this.getUserDrafts.map(element => element['id']);

      return new Promise(() => {
        if (isNil(uniqueID) || uniqueID === '' || uniqueID === undefined) this.isUniqueID = true;
        else if (this.draftIDs.includes(uniqueID)) this.isUniqueID = false;
        else {
          const request = `${this.$env.api.hubUrl}${this.$route.params.property}/${uniqueID}?useNormalizedId=true`;
          axios.head(request)
            .then(() => {
              this.isUniqueID = false;
            })
            .catch((e) => {
              if (e.response) console.log(e);
              this.isUniqueID = true;
            });
        }
      });
    },
    handleDatasetIDError(newValue) {
      if (!newValue) {
        const datasetID = document.getElementById('datasetID').children[0];
        const text = document.createTextNode('This Dataset ID is already in use. Please choose a different one.');
        const LI = document.createElement('LI');

        LI.setAttribute('role', 'status');
        LI.setAttribute('aria-live', 'polite');
        LI.setAttribute('class', 'formkit-input-error');
        LI.appendChild(text);

        const UL = document.createElement('UL');

        UL.setAttribute('class', 'formkit-input-errors');
        UL.setAttribute('id', 'datasetIDError');
        UL.appendChild(LI);

        datasetID.appendChild(UL);

      } else document.getElementById('datasetIDError').remove();
    },
  },
  mounted() {
    this.checkUniqueID();
  },
  watch: {
    rawTitle: {
      handler(newValue) {
        console.log(newValue)
        this.uniqueID = newValue
        .toLowerCase()
        .replace(/ /g, '-');
      }
    },
    isUniqueID: {
      handler(newValue) {
        if (this.getIsEditMode) return;
        this.handleDatasetIDError(newValue);
      },
    },
  },
};
</script>

<style>
#datasetID.formkit-input-element--unique-identifier-input label {
  display: none !important;
}

#datasetID.formkit-input-element--unique-identifier-input .formkit-input {
  margin-bottom: 0.1em;
}
</style>
