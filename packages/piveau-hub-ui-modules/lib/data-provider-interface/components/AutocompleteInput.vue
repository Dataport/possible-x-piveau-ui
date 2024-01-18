<script setup>

</script>
<template>
  <h4>{{camel2title(context.attrs.identifier)}}</h4>
  <!-- <details>{{ this.autocomplete}}</details> -->
  <div class="autoCompleteWrapper repeatableWrap" :class="[context.attrs.identifier]">
    <FormKit type="text" @click="this.openSuggestedList = !this.openSuggestedList" class="w-100"
      @input="getAutocompleteSuggestions" :placeholder="this.context.attrs.placeholder" />
    <div v-if="openSuggestedList" class="suggestedItemsContainer">
      <ul>
        <li v-for="items, key in this.autocomplete['suggestions']" :key="key" @click="this.chooseSuggestedItem(items)">{{
          items.name }}
        </li>
      </ul>
    </div>
    <div v-if="this.context.attrs.multiple" :class="{ 'chosenItemsContainer': true, 'd-none': this.values.length < 1 }">
      <hr>
      <ul>
        <li v-for="chosenItems, index in this.values" :key="index">
          <p>{{ chosenItems }}</p>
          <div class="removeX" @click="removeActiveItem($event)" @mouseover="hoverEffect($event, true)"
            @mouseleave="hoverEffect($event, false)">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import { mapActions } from "vuex";
import { getTranslationFor } from "../../utils/helpers";
import { getNode } from '@formkit/core'

export default {
  props: {
    context: Object,
  },

  data() {
    return {
      openSuggestedList: false,
      node: getNode(this.context.id),
      autocomplete: {
        text: "",
        selected: false,
        suggestions: [],
        clicked: false,
      },
      values: [],
      camel2title: (str) =>
        str
          .replace(/([A-Z])/g, (match) => ` ${match}`)
          .replace(/^./, (match) => match.toUpperCase())
          .trim(),
    }
  },
  methods: {
    ...mapActions("dpiStore", [
      "requestFirstEntrySuggestions",
      "requestAutocompleteSuggestions",
      "requestResourceName",
    ]),
    hoverEffect(e, bool) {
      if (bool) e.target.previousElementSibling.classList.add('eraseItem');
      else e.target.previousElementSibling.classList.remove('eraseItem');
    },
    getAutocompleteSuggestions(searchText) {

      if (!searchText) {
       
        if (this.autocomplete.text.length <= 1) {
          
          this.requestFirstEntrySuggestions(this.context.voc).then((response) => {
            
            const results = response.data.result.results.map((r) => ({
              name: getTranslationFor(r.pref_label, this.$i18n.locale, []),
              resource: r.resource,
            }));
     
            this.autocomplete.suggestions = results;
            this.autocomplete.suggestions.splice(0, 0, { name: "--- Choose from the suggested entries or search the vocabulary ---", resource: "None" });
          });
        } else {
          this.requestAutocompleteSuggestions(this.context.voc, text).then((response) => {

            const results = response.data.result.results.map((r) => ({
              name: getTranslationFor(r.pref_label, this.$i18n.locale, []) + " (" + r.id + ")",
              resource: r.resource,
            }));

            if (results.length === 0) this.autocomplete.suggestions = [{ name: "--- No results found! ---", resource: "None" }];
            else this.autocomplete.suggestions = results;
          });
        }
      }
      else {
        this.requestAutocompleteSuggestions({ voc: this.context.voc, text: searchText }).then((response) => {
          const results = response.data.result.results.map((r) => ({
            name: getTranslationFor(r.pref_label, this.$i18n.locale, []) + " (" + r.id + ")",
            resource: r.resource,
          }));

          if (results.length === 0) this.autocomplete.suggestions = [{ name: "--- No results found! ---", resource: "None" }];
          else this.autocomplete.suggestions = results;
        });
      }
    },
    removeActiveItem(e) {
      let itemToEraseText = e.target.previousElementSibling.innerHTML
      this.values = this.values.filter(filtered => filtered.name != itemToEraseText)

      // Todo need to refresh the context Object
    },
    chooseSuggestedItem(chosenObject) {
      if (this.context.attrs.multiple) {
      console.log(this.values);
        if (this.values.name === chosenObject) {
        } else {
          this.values.push(chosenObject)
        }
      }
      else {
        this.values[0] = chosenObject;
        this.context.attrs.placeholder = chosenObject.name
      }

      this.context.model = this.values;
      this.node.input(this.values)

      if (this.values.length > 0) this.itemsChosen = true;
      else this.itemsChosen = false;

      this.openSuggestedList = !this.openSuggestedList
    },
    searchVocabulary(typedText) {
      //console.log(typedText);
    }
  },
  computed: {
    getformerValues() {
      return ref(this.context.value)._rawValue;
    }
  },
  mounted() {
    this.getAutocompleteSuggestions();
    if (ref(this.context.value)._rawValue) {
      this.values = ref(this.context.value)._rawValue;
    }
  },
  watch: {
    getformerValues: {
      handler() {
        this.values = this.getformerValues
      },
    }
  }
}
</script>
<style></style>