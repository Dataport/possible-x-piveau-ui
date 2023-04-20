<template>
  <div>
    <!-- SINGULAR URIs -->
    <td v-if="value.type === 'singularURI'" class="">{{ nameOfProperty }}</td>

    <!-- MULTIPLE URIs -->
    <td v-if="value.type === 'multiURI'" class="flex-wrap d-flex multiURI">
      <div v-for="(el, index) in namesOfMulti" :key="index" class="border shadow-sm p-2 mb-1 mr-1">
        {{ el }}
      </div>
    </td>
    <!-- political geocoding URI -->
    <td v-if="value.type === 'multiURIspecial'">
      <div v-for="(el, index) in data[property]" :key="index">
        {{ el['dcatde:politicalGeocodingURI'] }}
      </div>
    </td>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { getTranslationFor } from "@/modules/utils/helpers";
export default {
  data() {
    return {
      nameOfProperty: "",
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
      // console.log(info[info.length - 1] + " " + info[info.length - 2] + " property:" + this.data[this.property]);
      this.displayURIName(this.value.voc, this.data[this.property])
      if (this.value.type == "multiURI") {
        for (let index = 0; index < this.data[this.property].length; index++) {
          const element = this.data[this.property][index];
          this.displayURIName(this.value.voc, element)
        }
      }
    }
    catch (error) {
      return
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

          // this is a temporary fix - it should be investiated why country has no vocabulary set!
          if (voc == "") { voc = "country" }

          await this.requestResourceName({ voc: voc, resource: URI }).then(
            (response) => {
              let result = vocMatch
                ? response.data.result.results
                  .filter((dataset) => dataset.resource === URI)
                  .map((dataset) => dataset.pref_label)[0].en
                : getTranslationFor(response.data.result.pref_label, this.$i18n.locale, []);
              preValues.name = result;
              preValues.resource = URI;
            }
          );
          if (this.value.type == "multiURI") {
            this.namesOfMulti.push(preValues.name)
          }
          this.nameOfProperty = preValues.name

          return preValues;
        }
        else {
          return
        }
      } catch (error) {
        return
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