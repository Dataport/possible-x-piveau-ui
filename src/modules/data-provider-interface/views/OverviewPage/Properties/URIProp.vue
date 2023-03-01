<template>
  <div>
    <!-- SINGULAR URIs -->
    <td v-if="value.type === 'singularURI'">{{ data[property] }}</td>

    <!-- MULTIPLE URIs -->
    <td v-if="value.type === 'multiURI'">

      <div v-for="(el, index) in data[property]" :key="index">
        {{ el }}
      </div>
    </td>
    <!-- political geocoding URI -->
    <td v-if="value.type === 'multiURIspecial'">
      <div v-for="(el, index) in data[property]" :key="index">
        {{ el['@id'] }}
      </div>
    </td>
  </div>
</template>

<script>
export default {
  props: {
    property: String,
    value: Object,
    data: Object,
  },
}
</script>