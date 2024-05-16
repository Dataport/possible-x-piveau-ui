<template>
  <td class=" font-weight-bold" v-if="value.type !== 'special'">{{ $t(`${value.label}`) }}:
  </td>
  <!-- SINGULAR URIs -->
  <td v-if="value.type === 'singularURI'" class=""> {{ nameOfProperty }}</td>
  <!-- MULTIPLE URIs -->
  <td v-if="value.type === 'multiURI'" class="flex-wrap d-flex multiURI">
    <div v-for="(el, index) in namesOfMulti" :key="index" class="border shadow-sm p-2 mb-1 mr-1">
      {{ el['name'] }}
    </div>
  </td>
  <!-- SPECIAL CASES -->
  <td v-if="value.type === 'special' && nameOfProperty != 'Unchanged Value'" class="font-weight-bold">{{ $t(`${value.label}`) }}:</td>
  <td v-if="value.type === 'special' && nameOfProperty != 'Unchanged Value'" class=""> {{ nameOfProperty }}</td>
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
    async getUriName(voc, res) {

      const specification = this.$env.content.dataProviderInterface.specification;

      if (res != undefined) {
        let vocMatch =
          this.voc === "iana-media-types" ||
          this.voc === "spdx-checksum-algorithm";

        let name;
        await this.requestResourceName({ voc: voc, uri: res, specification: specification }).then(
          (response) => {
            if (this.property === 'dcatde:politicalGeocodingURI') {
              if (response != undefined) {
                let result = vocMatch
                  ? response.data.result.results
                    .filter((dataset) => dataset.resource === res)
                    .map((dataset) => dataset.alt_label)[0].en
                  : getTranslationFor(response.data.result.alt_label, this.$i18n.locale, []);
                name = result;
              }
            } else {
              if (response != undefined) {
                let result = vocMatch
                  ? response.data.result.results
                    .filter((dataset) => dataset.resource === res)
                    .map((dataset) => dataset.pref_label)[0].en
                  : getTranslationFor(response.data.result.pref_label, this.$i18n.locale, []);
                name = result;
              }
            }
          }
        );
        return name
      }
    },

    async displayURIName(voc, URI) {
      try {
        if (voc != undefined) {
          if (voc == "") {
            var arr = URI.split('/');
            voc = arr[arr.length - 2]
            if (this.property === 'dcatde:politicalGeocodingURI') {
              let geocodingVoc = ""
              voc.split(/(?=[A-Z])/).forEach(element => {
                geocodingVoc += '-' + element.toLowerCase()
              });
              voc = 'political-geocoding' + geocodingVoc
            }
          }
          if (this.value.type === "multiURI") {

            let resolvedURI = { name: await this.getUriName(voc, URI), resource: URI }

            if (this.namesOfMulti.find(({ name }) => name === resolvedURI.name) === undefined) {
              if (resolvedURI.name != undefined) {
                this.namesOfMulti.push(resolvedURI)
              }
            }
          }

          this.nameOfProperty = await this.getUriName(voc, URI)
        }
        // else {
        //   this.nameOfProperty = this.data[this.property][0]['name']
        //   return
        // }
      } catch (error) {
        this.nameOfProperty = await this.getUriName(voc, URI)
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
