<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
    v-on="$listeners"
  >
    <div class="input-group suggestion-input-group mb-3" v-click-outside="hideSuggestions">
      <input v-model="context.model" @blur="context.blurHandler" hidden>
      <input type="text" class="form-control suggestion-input" :placeholder="$t('message.dataupload.searchVocabulary')"
        v-model="autocomplete.text"
        @focus="focusAutocomplete()"
        @input="getAutocompleteSuggestions()">
      <div class="suggestion-list-group">
        <ul class="list-group suggestion-list">
          <button
            class="list-group-item list-group-item-action"
            v-for="(suggestion, i) in filteredAutocompleteSuggestions"
            :key="i"
            @click="handleAutocompleteSuggestions(suggestion)">
            <p class="m-0 p-0">{{ suggestion.name }}</p>
          </button>
        </ul>
      </div>
      <div v-if="multiple && values.length > 0" class="selected-values-div">
        <span
          v-for="(selectedValue, i) in values"
          :key="i"
          class="selected-value">
          {{ selectedValue.name }}
          <span aria-hidden="true" class="delete-selected-value" @click="deleteValue(selectedValue.resrouce)">&times;</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable,arrow-parens,no-param-reassign, no-lonely-if, no-await-in-loop */
import axios from 'axios';
import { helpers } from '@/modules';
const { getTranslationFor } = helpers;

export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
    voc: {
      type: String,
      required: true,
    },
    multiple: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      autocomplete: {
        text: '',
        selected: false,
        suggestions: [],
      },
      values: [],
    };
  },
  methods: {
    deleteValue(value) {
      const index = this.values.indexOf(value);
      this.values.splice(index, 1);
      this.context.model = this.values.map(dataset => dataset.resource);
      this.autocomplete.text = '';
      this.context.rootEmit('change');
    },
    getTranslationFor,
    focusAutocomplete() {
      this.autocomplete.selected = false;
      this.autocomplete.text = '';
      this.getAutocompleteSuggestions();
    },
    getAutocompleteSuggestions() {
      // Clear old suggestions
      this.clearAutocompleteSuggestions();

      // Show first 10 entries of vocabulary if text empty
      if (this.autocomplete.text.length <= 1) {
        this.requestFirstEntrySuggestions()
          .then((response) => {
            const results = response.data.result.results.map((r) => ({ name: getTranslationFor(r.pref_label, this.$i18n.locale, []), resource: r.resource }));
            this.autocomplete.suggestions = results;
          });
      } else {
        // Request Autocompletion Suggestions
        this.requestAutocompleteSuggestions()
          .then((response) => {
            const results = response.data.result.results.map((r) => ({ name: getTranslationFor(r.pref_label, this.$i18n.locale, []), resource: r.resource }));
            this.autocomplete.suggestions = results;
          });
      }
    },
    // TODO: Move into DPI store
    requestFirstEntrySuggestions() {
      const vocabulary = this.voc;
      return new Promise((resolve, reject) => {
        const req = `${this.$env.api.baseUrl}search?filter=vocabulary&vocabulary=${vocabulary}&autocomplete=true`;
        axios.get(req)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    // TODO: Move into DPI store
    requestAutocompleteSuggestions() {
      const vocabulary = this.voc;
      return new Promise((resolve, reject) => {
        const input = this.autocomplete.text;
        const req = `${this.$env.api.baseUrl}search?filter=vocabulary&vocabulary=${vocabulary}&autocomplete=true&q=${input}`;
        axios.get(req)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    requestResourceName(resource) {
      const value = resource.substring(resource.lastIndexOf('/') + 1);
      let req;
      if (this.voc === 'iana-media-types' || this.voc === 'spdx-checksum-algorithm') {
        req = `${this.$env.api.baseUrl}/vocabularies/${this.voc}`;
      } else {
        req = `${this.$env.api.baseUrl}/vocabularies/${this.voc}/${value}`;
      }
      return new Promise((resolve, reject) => {
        axios.get(req)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    handleAutocompleteSuggestions(suggestion) {
      this.autocomplete.selected = true;
      if (this.multiple) {
        if (!this.values.map(dataset => dataset.resource).includes(suggestion.resource)) {
          this.values.push(suggestion);
        }
        this.autocomplete.text = this.values.map(dataset => dataset.name)[this.values.length - 1];
        this.context.model = this.values.map(dataset => dataset.resource);
      } else {
        this.autocomplete.text = suggestion.name;
        this.context.model = suggestion.resource;
      }
      this.context.rootEmit('change');
    },
    async getResourceName(resource) {
      const preValues = { name: '', resource: '' };
      await this.requestResourceName(resource).then((response) => {
        let result;
        if (this.voc === 'iana-media-types' || this.voc === 'spdx-checksum-algorithm') {
          result = response.data.result.results.filter(dataset => dataset.resource === resource).map(dataset => dataset.pref_label)[0].en;
        } else {
          result = getTranslationFor(response.data.result.pref_label, this.$i18n.locale, []);
        }
        preValues.name = result;
        preValues.resource = resource;
      });
      return preValues;
    },
    clearAutocompleteSuggestions() {
      this.autocomplete.suggestions = [];
    },
    hideSuggestions() {
      this.autocomplete.selected = true;
    },
    async handleValues() {
      if (Array.isArray(this.context.model)) {
        for (let index = 0; index < this.context.model.length; index += 1) {
          const result = await this.getResourceName(this.context.model[index]);
          this.values.push(result);
          this.autocomplete.text = result.name;
        }
      } else if (this.context.model !== '') {
        if (this.multiple) {
          const result = await this.getResourceName(this.context.model);
          this.values.push(result);
          this.autocomplete.text = result.name;
        } else {
          const valueName = await this.getResourceName(this.context.model);
          this.autocomplete.text = valueName.name;
          // this.context.model = this.context.model;
        }
      }
    },
  },
  computed: {
    filteredAutocompleteSuggestions() {
      if (this.autocomplete.selected) return [];
      return this.autocomplete.suggestions.slice(0, 10);
    },
  },
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target))) vnode.context[binding.expression](event);
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
      },
    },
  },
  beforeMount() {
    this.handleValues();
  },
};
</script>

<style scoped>
.selected-values-div {
  margin-top: 20px;
}
.delete-selected-value {
    margin-left: 10px;
    font-weight: bold;
    font-size: 14pt;
    cursor: pointer;
}

.selected-value {
    background-color: #f5f5f5;
    padding: 5px;
    box-shadow: 0 4px 8px rgba(0,0,0,.04);
    border-radius: 5px;
    border: solid 0.5px #e1e1e1;
    display: inline-block;
    margin: 2px;
}
.suggestion-input-group {
  position: relative;
}
.suggestion-input {
  position: relative;
  top: 0;
  height: 100%;
}
.suggestion-list-group {
  position: relative;
  width: 100%;
}
.suggestion-list {
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 100;
}
</style>
