<template>
  <div>
    <div v-for="(v, i) of values" :key="i" :style="itemstyles">
      <div v-if="v.key === 'email'" :class="{'mb-1':i<values.length}">
          <span class="dsd-properties-inner-label">{{ getLabel(v) }}</span>
          <app-link v-for="(item, j) in v.value" :key="j" :to="`mailto:${removeMailtoOrTel(item)}`">{{ displayValue(item, v.type) }}</app-link>
      </div>
      <div v-else-if="isLink(v)" :class="{'mb-1':i<values.length}">
        <span class="dsd-properties-inner-label">{{ getLabel(v) }}</span>
        <a v-for="(item, j) in v.value" :key="j" :href="item"
           :target="v.type==='link_blank'? '_blank':undefined"
            @click="handleClick(item, v)">
          {{ displayValue(item, v.type) }}
        </a>
      </div>
      <div v-else :class="{'mb-1':i<values.length}">
        <span class="dsd-properties-inner-label">{{ getLabel(v) }}</span>
        <span v-for="(item, j) in v.value" :key="j">{{ displayValue(item, v.type) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import AppLink from "../../widgets/AppLink";
import {removeMailtoOrTel, truncate} from "../../utils/helpers.ts";
import dateFilters from "../../filters/dateFilters.ts";

export default {
  name: "ValuesList",
  props: {
    values: Array, // Expected format: array of objects with "key" and "value" field, where
                  // "key" is a string and "value" is an array of strings (a single value
                  // is represented by n array of length 1). Additionally, a "type" field
                  // and a translation field may be included. If type is "link" we display
                  // a link, if translation is given, it is used for the i18n value for the label.
                  // Special cases of translation: in single quotes, use the literal string instead
                  // of a i18n translation; if starting with a slash, use the value as an i18n key
                  // literally, instead of appending it to "message.metadata."
    track: Array,
    itemstyles: String,
    interpretTranslateKey: Function
  },
  components: {
    AppLink
  },
  methods: {
    truncate,
    removeMailtoOrTel,
    getLabel(v) {
      const prefix = "message.metadata";
      if (typeof v.translation === 'string') {
        return this.interpretTranslateKey(v.translation, prefix);
      }
      return `${this.$i18n.t(`${prefix}.${v.key}`)}:`;
    },
    isLink(v) {
      const key = v.key.toLowerCase();
      const type = v.type?.toLowerCase();
      return ['homepage'].includes(key) || type === 'link' || type === 'link_blank';//|| key.endsWith('url') || key.endsWith('uri');
    },
    displayValue(item, type) {
      switch(type) {
        case 'date': return dateFilters.formatEU(item);
        default:
          return typeof item === 'string'? truncate(item, 75) : item;
      }
    },
    handleClick(item, v) {
      const key = v.key.toLowerCase();
      if (this.track && this.track.includes(key)) {
        this.$emit('track-link', item, 'link');
      }
    }
  }
}
</script>

<style scoped>
  .dsd-properties-inner-label {
    white-space: pre;
  }
</style>
