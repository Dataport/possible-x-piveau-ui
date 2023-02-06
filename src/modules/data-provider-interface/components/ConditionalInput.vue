<template>
  <div :class="`formulate-input-element formulate-input-element--${context.type}`" :data-type="context.type" v-on="$listeners">
    <FormulateSlot name="prefix" :context="context">
      <component :is="context.slotComponents.prefix" v-if="context.slotComponents.prefix" :context="context"/>
    </FormulateSlot>
    <input type="text" v-model="context.model" @blur="context.blurHandler" hidden/>

    <!-- temporal solution for license only using vocabulary -->
    <div v-if="context.attributes.name === 'dct:license'">
      <FormulateForm v-model="inputValues" :schema="data['voc']" @change="setContext"></FormulateForm>
    </div>
    <div v-else>
      <FormulateForm v-model="conditionalValues" key="intern">
      <FormulateInput type="select" :options="context.options" :name="context.name" :label="$t('message.dataupload.type')" :placeholder="context.attributes.placeholder"></FormulateInput>
      </FormulateForm>

      <div v-if="conditionalValues === 'file'">
        <FormulateForm v-model="inputValues" v-if="conditionalValues" :schema="data[conditionalValues[context.name]]" @input="setContext"></FormulateForm>
      </div>
      <div v-else>
        <FormulateForm v-model="inputValues" v-if="conditionalValues" :schema="data[conditionalValues[context.name]]" @change="setContext"></FormulateForm>
      </div>
    </div>

    <FormulateSlot name="suffix" :context="context">
      <component :is="context.slotComponents.suffix" v-if="context.slotComponents.suffix" :context="context"/>
    </FormulateSlot>
  </div>
</template>

<script>
import { isEmpty } from 'lodash';
import generalHelper from '../utils/general-helper';

export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
    data: {},
  },
  data() {
    return {
      conditionalValues: {},
      inputValues: {},
    };
  },
  computed: {},
  methods: {
    /**
     * Saving changed values to context which will be given to parent form
     */
    setContext() {
      const dataKey = Object.keys(this.inputValues);
      if (dataKey.length > 0) {
        this.context.model = this.inputValues[dataKey[0]];
      }
      this.context.rootEmit('change');
    },
    fillValues() {
      const semanticName = this.context.attributes.name;
      if (semanticName === 'dct:issued' || semanticName === 'dct:modified') {
        //   // date time includes an 'T' to delimit date and time
        if (this.context.model.includes('T')) {
          this.conditionalValues[this.context.name] = 'datetime';
        } else {
          this.conditionalValues[this.context.name] = 'date';
        }
        this.inputValues = {'@value': this.context.model };
      } else if (semanticName === 'dct:license') {
        // either an array with an object containing multiple properties
        if (Array.isArray(this.context.model)) {
          if (!isEmpty(this.context.model[0])) {
            this.conditionalValues[this.context.name] = 'man';
            this.inputValues = {...this.inputValues, 'dct:license': this.context.model};
          }
        } else {
          // singular URI
          this.conditionalValues[this.context.name] = 'voc';
          this.inputValues = {'@id': this.context.model };
        }
      } else if (this.context.attributes.identifier === 'accessUrl') {
        this.conditionalValues[this.context.name] = 'url';
        this.inputValues = { '@id': this.context.model };
      } else if (semanticName === 'dct:spatial') {

        // both options return an URI
        this.conditionalValues[this.context.name] = 'man';
        this.inputValues = {'@id': this.context.model };

        // TODO: implement display of conditional choice when vocabulary was used

      } else if (semanticName === 'dct:rights') {
        console.log(this.context.model);
        // url and string provided as normal string
        if (generalHelper.isUrl(this.context.model)) {
          this.conditionalValues[this.context.name] = 'url';
        } else {
          this.conditionalValues[this.context.name] = 'str';
        }
        this.inputValues = { 'rdfs:label': this.context.model };
      }
    },
  },
  watch: {
    context: {
      handler() {
        if (this.context.model !== "") {
          this.fillValues();
        }
      }
    }
  }
};
</script>

<style>

</style>
