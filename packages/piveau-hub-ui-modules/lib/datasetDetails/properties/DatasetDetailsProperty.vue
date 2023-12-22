<template>
  <tr v-if="show">
    <td class="w-25 text-break font-weight-bold">
      <tooltip :title="labelDisplay[0]">
        {{ labelDisplay[1] }}
      </tooltip>
    </td>
    <td v-if="['string', 'date', 'first:number', 'translation'].includes(type)">{{ value }}</td>
    <td v-if="type==='uri'"><a :href='value'>{{ value }}</a></td>
    <td v-if="type==='links'">
      <div v-for="(v, i) of value" :key="i">
        <app-link v-if="!isNil(v) && v.link" :to="v.link">{{ truncate(v.label, 75) }}</app-link>
        <div v-if="!isNil(v) && !v.link">{{ truncate(v.label, 75) }}</div>
      </div>
    </td>
    <td v-if="type==='object'">
      <values-list :values="value" :interpretTranslateKey="interpretTranslateKey" :itemstyles="itemstyles"/>
    </td>
    <td v-if="type==='objects'">
      <div v-for="(item, i) of value" :key="i">
        <values-list :values="item" :interpretTranslateKey="interpretTranslateKey" :itemstyles="itemstyles"/>
      </div>
    </td>
  </tr>
</template>

<script>
import AppLink from "../../widgets/AppLink";
import Tooltip from "../../widgets/Tooltip";
import {isNil, isArray} from "lodash";
import {showByType} from "./typeCheckers.ts";
import ValuesList from "./ValuesList";
import {mapGetters} from "vuex";
import dateFilters from "../../filters/dateFilters.ts";
import {truncate, getTranslationFor} from "../../utils/helpers";

export default {
  name: "DatasetDetailsProperty",
  props: {
    type: String, // Can be any of the types recognized in typeCheckers.ts
    translate: String | Array, // i18n key for the tooltip and label string values (if not given, name is used!)
    name: String, // Key to extract the value from the Datasets store
    fields: String, // Comma-separated keys for extracting data from an object
    itemstyles: String, // Styles to apply to an object key-value block
    track: String, // Comma-separated keys for tracking
    preTransform: Function, // Transform raw data from dataset service
    transform: Function // Transform data after preparing by this.value
  },
  components: {
    Tooltip, AppLink, ValuesList
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getProperty'
    ]),
    labelDisplay() {
      const prefix = ["message.tooltip.datasetDetails", "message.metadata"];
      let translateItems;
      if (this.translate) {
        translateItems = this.translate.split(',');
        if (translateItems.length === 1) {
          translateItems.push(translateItems[0]);
        }
      } else {
        translateItems = [this.name, this.name];
      }
      return translateItems.map((item, i) => this.interpretTranslateKey(item, prefix[i]));
    },
    data() {
      return this.getProperty(this.name);
    },
    preparedFields() {
      return this.fields?.split(',').map(field => field.split(':'));
    },
    preparedTrack() {
      return this.track?.split(',');
    },
    value() {
      let v = this.data;
      if (this.preTransform) v = this.preTransform(v);
      switch (this.type) {
        case 'date':
          v = dateFilters.formatEU(v);
          break;
        case 'links':
          v = this.data.map(item => {
            if (item) {
              const link = typeof item === 'string'? item : item.resource;
              const label = typeof item === 'string'? item : item.label || item.id || item.resource;
              return { link, label };
            }
          });
          break;
        case 'object':
          v = this.prepareObject(this.data);
          break;
        case 'objects':
          v = this.data.map(item => {
            return this.prepareObject(item);
          });
          break;
        case 'translation':
          v = this.getTranslationFor(v);
          break;
        default:
          if (this.type.startsWith('first')) {
            v = this.data[0];
          }
      }
      if (this.transform) v = this.transform(v);
      return v;
    },
    show() {
      return showByType(this.type, this.data);
    }
  },
  methods: {
    isNil,
    isArray,
    truncate,
    getTranslationFor,
    dateValue() {
      return dateFilters.formatEU(this.value);
    },
    prepareObject(object) {
      // Because this.fields can contain ":" signs that split a key into an array,
      // we also transform the keys in the case this.fields is undefined into arrays:
      let keys = this.preparedFields ?? Object.keys(object).map(key => [key]);

      // Now key[0] holds the actual key in all cases. Check if the value given
      // For a key is undefined and filter them out:
      keys = keys.filter(key => !isNil(object[key[0]]));

      return keys.map(key => {
        let value = object[key[0]];

        // Values can be arrays for displaying several values. For uniform treatment,
        // transform single values into arrays of length 1:
        if (!isArray(value)) value = [value];

        // First step: an object holding key and value:
        const result = {key: key[0], value};

        // Enrich the object when appropriate:
        if (key[1] !== undefined) result.type = key[1];
        if (key[2] !== undefined) result.translation = key[2];

        return result;
      });
    },
    interpretTranslateKey(key, prefix) {
      if (key === '') return '';
      if (key.startsWith('/')) return `${this.$i18n.t(key.substring(1))}:`;
      if (key.startsWith('\'')) return key.substring(1, key.length - 1);
      return `${this.$i18n.t(`${prefix}.${key}`)}:`;
    },
  }
}
</script>

<style scoped>
tr {
  width: 100%;
}
.w-25 {
  min-width: 160px;
}

</style>
