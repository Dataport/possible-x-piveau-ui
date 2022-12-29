<template>
  <dropdown
            :title="$t('message.tooltip.datasetDetails.distributions.linkedData')"
            :message="$t('message.metadata.linkedData')"
  >
    <resource-details-linked-data-button
      v-for="format in formats"
      class="dropdown-item"
      resources="distributions"
      :key="format.id"
      :format="format.id"
      :text="format.label"
      :resources-id="distribution.id" />
  </dropdown>
</template>

<script>
import Dropdown from "../../../widgets/Dropdown";
import ResourceDetailsLinkedDataButton from "../../../widgets/ResourceDetailsLinkedDataButton";

export default {
  name: "LinkedDataButtonsDropdown",
  components: {
    Dropdown,
    ResourceDetailsLinkedDataButton
  },
  props: [
    "distributions",
    "distribution"
  ],
  data: () => ({
    formats:
      [
        {id: "rdf", label: "RDF/XML"},
        {id: "ttl", label: "Turtle"},
        {id: "n3", label: "Notation3"},
        {id: "nt", label: "N-Triples"},
        {id: "jsonld", label: "JSON-LD"}
      ]
  })
}
</script>

<style scoped>

</style>
