<template>
  <td class=" font-weight-bold" v-if="value.type !== 'special'">{{ $t(`${value.label}`) }}:</td>
  <!-- SINGULAR URIs -->
  <!-- <a>{{ nameOfProperty}}</a> -->
  <td v-if="value.type === 'singularURI'" class="">{{ nameOfProperty }}</td>

  <!-- MULTIPLE URIs -->
  <td v-if="value.type === 'multiURI'" class="flex-wrap d-flex multiURI">
    <!-- <details>{{namesOfMulti}}</details> -->
    <div v-for="(el, index) in namesOfMulti" :key="index" class="border shadow-sm p-2 mb-1 mr-1">
      {{ el['name'] }}
    </div>
  </td>
  <!-- political geocoding URI -->
  <td v-if="value.type === 'multiURIspecial'">
    <div v-for="(el, index) in data[property]" :key="index">
      {{ el['dcatde:politicalGeocodingURI'] }}
    </div>
  </td>
  <!-- Spatial -->
  <td v-if="value.type === 'multiURISpatial'">
    <div v-for="(el, index) in data[property]" :key="index">
      {{ el['name'] }}
    </div>
  </td>
</template>

<script>
import { mapActions } from 'vuex';
import { getTranslationFor } from "../../../../utils/helpers";
export default {
  data() {
    return {
      nameOfProperty: "Unchanged Value",
      namesOfMulti: []
    }

  },
  props: {
    property: String,
    value: Object,
    data: Object,
  },
  created() {
    try {
      // console.log(typeof this.data[this.property], 'type', this.data[this.property]);
      if (this.data[this.property]) {
        this.displayURIName(this.value.voc, this.data[this.property]['resource'])
      }
      this.displayURIName(this.value.voc, this.data[this.property][0]['resource'])
      if (this.value.type == "multiURI") {
        for (let index = 0; index < this.data[this.property].length; index++) {
          const element = this.data[this.property][index]['resource'];
          this.displayURIName(this.value.voc, element)
        }
      }
    }
    catch (error) {

    }
  },
  methods: {
    ...mapActions("dpiStore", [
      "requestResourceName",
    ]),
    getTranslationFor,
    // Try to avoid that the function gets called whenever the page gets changed - performance wise this is not optimal
    async displayURIName(voc, URI) {
  
      let preValues = { name: "", resource: "" };

      let vocMatch =
        this.voc === "iana-media-types" ||
        this.voc === "spdx-checksum-algorithm";
      try {

        if (voc !== undefined) {
          // this is a temporary fix - it should be investiated why country(e.g.) has no vocabulary set!
          if (voc == "") {
            var arr = URI.split('/');
            voc = arr[arr.length - 2]
          }

          // Request is not working properly anymore - ToDo 

          // await this.requestResourceName({ voc: voc, resource: URI }).then(
          //   (response) => {
          //     let result = vocMatch
          //       ? response.data.result.results
          //         .filter((dataset) => dataset.resource === URI)
          //         .map((dataset) => dataset.pref_label)[0].en
          //       : getTranslationFor(response.data.result.pref_label, this.$i18n.locale, []);
          //     preValues.name = result;
          //     preValues.resource = URI;

          //   }
          // );
          // console.log(preValues);
          if (this.value.type === "multiURI") {

            // New function to gather values from multiURIs -ToDo return to the requestResourceName function because this way
            this.namesOfMulti = this.data[this.property];
            // console.log(this.namesOfMulti);
            // 

            // this.namesOfMulti.push(preValues.name)
          }

          // this.nameOfProperty = preValues.name
          this.nameOfProperty = this.data[this.property][0]['name']
          return preValues;
        }
        else {
          this.nameOfProperty = this.data[this.property][0]['name']
          return
        }
      } catch (error) {
        // console.log(error);
        this.nameOfProperty = URI
      }

    }

  }

}

</script>
<style>
div:has(>.multiURI) {
  width: 75%;
}
</style>
