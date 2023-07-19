<template>
  <div :class="`formulate-input-element formulate-input-element--${context.type}`" :data-type="context.type"
    v-on="$listeners">
    <div class="input-group suggestion-input-group mb-3" v-click-outside="hideSuggestions">
      <input v-model="context.model" @blur="context.blurHandler" hidden />
      <div class="annifButtonWrap" v-if="annifTheme && annifEnv">
        <a class="annifItems annifHandleBtn">
          <a class=" annifHandleBtn" @click="handleAnnifSuggestions($event, 'theme')">Generate description based
            suggestions</a>
        </a>
        <a class="annifItems annifHandleBtn" @click="manSearch = !manSearch">Manually search the vocabulary</a>

      </div>
      <div class="position-relative d-flex align-items-center justify-content-center w-100">
        <input v-if="!annifTheme || manSearch" type="text" class="form-control"
          :placeholder="$t('message.dataupload.searchVocabulary')" v-model="autocomplete.text"
          @focus="focusAutocomplete()" @input="getAutocompleteSuggestions()" />
        <div class="position-relative h-100" @click="clearAutocomplete">
          <a v-if="!annifTheme" class="custom-remove" v-bind:class="{ remBG: choice }"></a>
        </div>
      </div>
      <div class="suggestion-list-group">
        <ul class="list-group suggestion-list">
          <button class="list-group-item list-group-item-action"
            v-for="(suggestion, i) in filteredAutocompleteSuggestions" :key="i"
            @click="handleAutocompleteSuggestions(suggestion)">
            <p class="m-0 p-0">{{ suggestion.name }}</p>
          </button>
        </ul>
      </div>
      <div id="suggestedAnnifItemsTheme" v-if="annifTheme && multiple && annifEnv">
        <div v-for="(themeValue, index) in valueListOfThemes" :key="index" data-toggle="tooltip" data-placement="top"
          v-bind:title="themeValue.name" class="annifItems"
          v-bind:class="{ fadeIn: annifChoicebtnClicked, greenBG: themeValue.activeValue }"
          @click="handleAnnifClick($event)">
          <!-- <span class="annifPlusIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle"
              viewBox="0 0 16 16" v-bind:class="{ rotate45: themeValue.activeValue }">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path
                d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
            </svg>
          </span> -->
          {{ truncateWords(themeValue.name, 8, true) }} ...
        </div>
        <p class="ml-2 mb-0" style="font-size: 12px">This field can be auto generated. If you click the generate button,
          it will suggest the most fitting properties based on the dataset-description you provided.</p>

      </div>
      <div v-if="multiple && values.length > 0 && !annifEnv" class="selected-values-div">
        <span v-for="(selectedValue, i) in values" :key="i" class="selected-value">
          {{ selectedValue.name }}
          <span aria-hidden="true" class="delete-selected-value"
            @click="deleteValue(selectedValue.resource)">&times;</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable,arrow-parens,no-param-reassign, no-lonely-if, no-await-in-loop */
import { mapActions } from "vuex";
import { getTranslationFor } from "../../utils/helpers";
import { truncate } from "../../utils/helpers";
import $ from "jquery";
import axios from 'axios';
import qs from 'qs';

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
    subject: {
      type: Boolean,
      required: false,
    },
    annifTheme: {
      type: Boolean,
      required: false,
    },
    multiple: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      autocomplete: {
        text: "",
        selected: false,
        suggestions: [],
        clicked: false
      },
      choice: false,
      themeSuggestionList: {},
      manSearch: false,
      values: [],
      annifEnv: this.$env.content.dataProviderInterface.annifIntegration,
      valueListOfThemes: [],
      getThSuggestions: false,
      thSwitch: false,
      annifChoicebtnClicked: false
    };
  },
  computed: {
    filteredAutocompleteSuggestions() {

      if (this.autocomplete.selected) return [];
      this.autocomplete.suggestions = this.sortAlpabetically(this.autocomplete.suggestions);
      return this.autocomplete.suggestions.slice(0, 10);

    }

  },
  mounted() {

    if (!this.annifEnv) {
      this.manSearch = !this.manSearch
    }
    // This is a bit buggy need to to something here!!!
    setTimeout(() => {
      for (var i = 0; i < Object.keys(this.values).length; i++) {
        this.valueListOfThemes.push(this.values[i])
      }
    }, 2000);
  },
  methods: {
    ...mapActions("dpiStore", [
      "requestFirstEntrySuggestions",
      "requestAutocompleteSuggestions",
      "requestResourceName",
    ]),
    truncateWords(word) {
      return truncate(word, 8, true);
    },
    // small function to sort alphabetically
    sortAlpabetically(arr) {
      let sortedArray = [...arr];
      sortedArray.sort((a, b) => {
        let comparison = 0;
        if (a.name < b.name) {
          comparison = -1;
        } else if (a.name > b.name) {
          comparison = 1;
        }

        return comparison;
      });
      return sortedArray;
    },
    getTranslationFor,
    deleteValue(value) {
      this.values = this.values.filter((dataset) => dataset.resource !== value);
      this.context.model = this.values
        .filter((dataset) => dataset.resource !== value)
        .map((dataset) => dataset.resource);
      this.autocomplete.text = "";
      this.context.rootEmit("change");

      // disable delete button
      if (this.values.length === 0) {
        // console.log('######');
        this.choice = false;
      }
    },
    focusAutocomplete() {
      this.autocomplete.selected = false;
      this.autocomplete.text = "";
      this.getAutocompleteSuggestions();
    },
    clearAutocompleteSuggestions() {

      this.autocomplete.suggestions = [];
    },
    hideSuggestions() {
      this.autocomplete.selected = true;
    },
    getAutocompleteSuggestions() {

      this.choice = true
      let voc = this.voc;
      let text = this.autocomplete.text;
      this.clearAutocompleteSuggestions();


      if (voc == "political-geocoding-municipality-key" || voc == "political-geocoding-regional-key" || voc == "political-geocoding-municipal-association-key" || voc == "political-geocoding-district-key" ||
        voc == "political-geocoding-government-district-key" || voc == "political-geocoding-state-key") {
        if (this.autocomplete.text.length <= 1) {
          this.requestFirstEntrySuggestions(voc).then((response) => {
            const results = response.data.result.results.map((r) => ({
              name: getTranslationFor(r.alt_label, this.$i18n.locale, []),
              resource: r.resource,
            }));
            this.autocomplete.suggestions = results;
          });

        }
      } else {
        if (this.autocomplete.text.length <= 1) {
          this.requestFirstEntrySuggestions(voc).then((response) => {
            const results = response.data.result.results.map((r) => ({
              name: getTranslationFor(r.pref_label, this.$i18n.locale, []),
              resource: r.resource,
            }));
            this.autocomplete.suggestions = results;
            this.autocomplete.suggestions.splice(0, 0, { name: "--- Choose from the suggested entries or search the vocabulary ---", resource: "None" });
          });
        } else {
          this.requestAutocompleteSuggestions({ voc, text }).then((response) => {

            const results = response.data.result.results.map((r) => ({
              name: getTranslationFor(r.pref_label, this.$i18n.locale, []) + " (" + r.id + ")",
              resource: r.resource,
            }));

            if (results.length === 0) this.autocomplete.suggestions = [{ name: "--- No results found! ---", resource: "None" }];
            else this.autocomplete.suggestions = results;
          });
        }

      }
    },
    animateFadeInOut() {
      var timer = 100;
      $("#suggestedAnnifItemsTheme")
        .children()
        .each(function () {
          setTimeout(() => {
            $(this).addClass("fadeIn");
          }, timer);
          timer += 100;
        });
    },
    handleAnnifClick(e) {

      if (e.target.classList.contains('annifItems')) {

        e.target.classList.toggle('greenBG')
        for (var i = 0; i < Object.keys(this.valueListOfThemes).length; i++) {
          if (e.target.dataset.originalTitle == this.valueListOfThemes[i].name && this.valueListOfThemes[i].activeValue == false) {
            this.valueListOfThemes[i].activeValue = true;
            console.log(this.valueListOfThemes[i]);
            this.handleAutocompleteSuggestions(this.valueListOfThemes[i])
            break
          }
          if (e.target.dataset.originalTitle == this.valueListOfThemes[i].name && this.valueListOfThemes[i].activeValue == true) {
            this.deleteValue(this.valueListOfThemes[i].resource)
            break
          }
          if (e.target.title == this.valueListOfThemes[i].name && this.valueListOfThemes[i].activeValue == true) {
            this.deleteValue(this.valueListOfThemes[i].resource)
            break
          }
          if (e.target.title == this.valueListOfThemes[i].name && this.valueListOfThemes[i].activeValue == false) {
            this.valueListOfThemes[i].activeValue = true;
            console.log(this.valueListOfThemes[i]);
            this.handleAutocompleteSuggestions(this.valueListOfThemes[i])
            break
          }
        }
      }

    },
    setTooltip() {
      setTimeout(() => {
        $('[data-toggle="tooltip"]').tooltip();
      });
    },
    handleAnnifSuggestions(e, input) {
      // gets the dct:description value from localstorage and gives it to the annif theme handler

      this.annifHandlerTheme(JSON.parse(localStorage.getItem("dpi_datasets")).step1["dct:description"][0]["@value"])
      this.getThSuggestions = !this.getThSuggestions;

      // e.target.classList.add("inactiveHandleBtn");
    },
    async annifHandlerTheme(input) {
      if (this.thSwitch) {
        return
      }
      else {
        let query = qs.stringify({
          'text': input,
          'limit': 10
        });
        var config
        if (this.voc == "eurovoc") {
          config = {
            method: 'post',
            url: 'https://data.europa.eu/annif/v1/projects/eurovoc-nn-ensemble-eurlex-en/suggest',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            data: query
          };
        }
        else {
          config = {
            method: 'post',
            url: 'https://data.europa.eu/annif/v1/projects/data-theme-nn-ensemble-en/suggest',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            data: query
          };
        }
        let list = []

        axios(config)
          .then(async (response) => {
            for (let i = 0; i < response.data.results.length; i++) {
              // let found = false;
              let item = await this.getResourceName(response.data.results[i].uri);
              // translate suggestions into locale
              list[i] = { "name": item.name, "resource": item.resource, "activeValue": false }
            }
            let filteredList = list.filter((set => item => set.has(item.resource))(new Set(this.values.map(item => item.resource))))
            filteredList = list.filter((set => item => !set.has(item.resource))(new Set(this.values.map(item => item.resource))))
            for (var q = 0; q < filteredList.length; q++) {
              this.valueListOfThemes.push(filteredList[q])
            }

            this.animateFadeInOut();
            this.thSwitch = true;
            this.setTooltip();
          })
          .catch(function (error) {
            console.log(error);
          });
      }

    },
    handleAutocompleteSuggestions(suggestion) {
      this.autocomplete.selected = true;
      if (suggestion.resource == "None") {
        return;
      }
      if (this.multiple) {
        if (!this.values.map((dataset) => dataset.resource).includes(suggestion.resource)) {
          this.values.push(suggestion);
        }
        this.autocomplete.text = this.values.map((dataset) => dataset.name)[
          this.values.length - 1
        ];
        this.context.model = this.values.map((dataset) => dataset.resource);
      } else {
        this.autocomplete.text = suggestion.name;
        this.context.model = suggestion.resource;
        this.context.altLabel = suggestion.name;


      }
      this.context.rootEmit("change");
      if (this.annifTheme && suggestion.activeValue == undefined) {

        // console.log(suggestion);
        suggestion.activeValue = true
        this.valueListOfThemes.push(suggestion)
        this.animateFadeInOut();
      }

    },
    async getResourceName(resource) {
      let preValues = { name: "", resource: "" };

      let vocMatch =
        this.voc === "iana-media-types" ||
        this.voc === "spdx-checksum-algorithm";
      await this.requestResourceName({ voc: this.voc, resource }).then(
        (response) => {
          let result = vocMatch
            ? response.data.result.results
              .filter((dataset) => dataset.resource === resource)
              .map((dataset) => dataset.pref_label)[0].en
            : getTranslationFor(response.data.result.pref_label, this.$i18n.locale, []);
          preValues.name = result;
          preValues.resource = resource;
        }
      );

      return preValues;
    },
    async handleValues() {

      // TODO: disable delete button for invaid content edge case
      // when submitting unsupported values (which are not saved) the delete button stay enabled

      if (this.context.model !== "") {
        // multiple autocomplete input provides always an array of values
        if (Array.isArray(this.context.model)) {
          const newValues = [];
          for (let index = 0; index < this.context.model.length; index += 1) {

            const result = await this.getResourceName(
              this.context.model[index]
            );
            newValues.push(result);
            this.autocomplete.text = result.name;

          }
          this.values = newValues;
          if (this.annifTheme) {
            for (var i = 0; i < Object.keys(this.values).length; i++) {
              this.values[i].activeValue = true
            }

            this.animateFadeInOut();
            this.setTooltip();
          }

          // enabling delete button if there are values
          if (this.values.length > 0) this.choice = true;
        } else {
          // singular autocomplete always provides a single value
          const result = await this.getResourceName(this.context.model);
          this.autocomplete.text = result.name;

          // enabling delete button
          this.choice = true;
        }
      }
    },
    clearAutocomplete() {
      this.choice = false
      if (this.multiple) {
        this.values = [];
      }
      this.context.model = "";
      this.autocomplete.text = "";
      this.context.rootEmit("change");
    },
  },
  directives: {
    "click-outside": {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = (event) => {
          if (!(el === event.target || el.contains(event.target)))
            vnode.context[binding.expression](event);
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
  watch: {
    // context contains predefined values from parent form which need to be filled in for edit purpose
    context: {
      async handler() {
        await this.handleValues();

        this.annifChoicebtnClicked = true
      },
    },
  },
};
</script>

<style scoped>
.form-control {
  border-radius: 0 !important;
  border-right: none !important;
}

.custom-remove {
  height: 100%;
  display: block;
  width: 1.3em;
  background-color: #cecece38;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  text-indent: -1000px;
  border-top: 1px solid;
  border-right: 1px solid;
  border-bottom: 1px solid;
  border-color: #cecece;
}

.custom-remove::before {
  content: "";
  position: absolute;
  top: 47%;
  right: 5px;
  display: block;
  width: 0.65em;
  height: 0.2em;
  background-color: #fff;
  transform-origin: center center;
  transition: all 0.2s ease-in-out;
}

.custom-remove:hover::before {
  width: 0.75em;
  right: 10px !important;
  transform: rotate(45deg);

}

.custom-remove:hover::after {
  width: 0.75em;
  right: 10px !important;
  transform: rotate(-45deg);

}

.custom-remove::after {
  content: "";
  position: absolute;
  top: 47%;
  right: 5px;
  display: block;
  width: 0.65em;
  height: 0.2em;
  background-color: #fff;
  transform-origin: center center;
  transition: all 0.2s ease-in-out;
}

.custom-remove:hover {
  background-color: red;
  width: 2em;
}

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
  padding: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.04);
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
  margin-right: 45px !important;
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

.remBG {
  background-color: #cecece;
}
</style>
