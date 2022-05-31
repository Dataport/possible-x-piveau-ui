<template>
  <div :class="`formulate-input-element formulate-input-element--${context.type}`" :data-type="context.type" v-on="$listeners">
    <FormulateSlot name="prefix" :context="context">
      <component :is="context.slotComponents.prefix" v-if="context.slotComponents.prefix" :context="context"/>
    </FormulateSlot>

    <input type="text" v-model="context.model" @blur="context.blurHandler" hidden/>
    <FormulateForm v-model="conditionalValues" key="intern">
      <FormulateInput type="select" :options="context.options" :name="context.name" :label="$t('message.dataupload.type')" :placeholder="context.attributes.placeholder"></FormulateInput>
    </FormulateForm>

    <div v-if="conditionalValues === 'file'">
      <FormulateForm v-model="inputValues" v-if="conditionalValues" :schema="data[conditionalValues[context.name]]" @input="setContext"></FormulateForm>
    </div>
    <div v-else>
      <FormulateForm v-model="inputValues" v-if="conditionalValues" :schema="data[conditionalValues[context.name]]" @change="setContext"></FormulateForm>
    </div>

    <FormulateSlot name="suffix" :context="context">
      <component :is="context.slotComponents.suffix" v-if="context.slotComponents.suffix" :context="context"/>
    </FormulateSlot>
  </div>
</template>

<script>
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
  methods: {
    setContext() {
      const dataKey = Object.keys(this.inputValues);
      if (dataKey.length > 0) {
        // because of the deep nesting spatial should at least provide used vocabulary for later jsonld conversion
        if (this.context.attributes.name === 'dct:spatial') {
          if (dataKey[0] !== '@value') {
            // spatial can be a manual link
            this.context.model = this.inputValues;
          } else {
            // or a value from a vocabulary which must be provided too
            this.context.model = this.inputValues[dataKey[0]];
          }
        } else {
          this.context.model = this.inputValues[dataKey[0]];
        }
      }
      this.context.rootEmit('change');
    },
  },
  beforeMount() {
    // if values for conditional inputs are available:
    // define condition and fill fields
    if (this.context.model) {
      const semanticName = this.context.attributes.name;
      if (semanticName === 'dct:issued' || semanticName === 'dct:modified') {
        //   // date time includes an 'T' to delimit date and time
        if (this.context.model.includes('T')) {
          this.conditionalValues[this.context.name] = 'datetime';
          this.inputValues['@value'] = this.context.model.slice(0, 16);
        } else {
          this.conditionalValues[this.context.name] = 'date';
          this.inputValues['@value'] = this.context.model;
        }
      } else if (semanticName === 'dct:license' || semanticName === 'dct:publisher') {
        // either an object containing multiple properties
        if (typeof this.context.model === 'object') {
          this.conditionalValues[this.context.name] = 'man';
          this.inputValues[semanticName] = this.context.model;
        } else { // or a single URI
          this.conditionalValues[this.context.name] = 'voc';
          this.inputValues['@value'] = this.context.model;
        }
      } else if (this.context.attributes.identifier === 'accessUrl') {
        this.conditionalValues[this.context.name] = 'url';
        this.inputValues = { '@value': this.context.model };
      } else if (semanticName === 'dct:spatial') {
        if (typeof this.context.model !== 'string') {
          const objectKey = Object.keys(this.context.model)[0];
          if (objectKey.startsWith('dct:spatial')) {
            this.conditionalValues[this.context.name] = 'voc';
            this.inputValues = this.context.model;
          } else if (objectKey.startsWith('http')) {
            const vocKey = objectKey.substring(objectKey.lastIndexOf('/') + 1);
            this.conditionalValues[this.context.name] = vocKey;
            this.inputValues = this.context.model;
          }
        } else {
          this.conditionalValues[this.context.name] = 'man';
          this.inputValues = this.context.model;
        }
      }
    }
  },
};
</script>

<style>

</style>