<template>
  <div>
    <!-- MULTISTRING -->
    <td v-if="value.type === 'multiString'">
        <div v-for="(el, index) in data[property]" :key="index">
            {{ Object.values(el)[0] }}
        </div>
    </td>

    <!-- SINGULAR STRING -->
    <td v-if="value.type === 'singularString'">{{ data[property] }} <span v-if="property === 'dcat:spatialResolutionInMeters'">Meters</span></td>

    <!-- DATES-->
    <td v-if="value.type === 'date'">{{ filterDateFormatEU(data[property]) }}</td>

    <!-- MULTILINGUAL -->
    <td v-if="value.type === 'multiLingual'">
        <div v-for="(el, index) in data[property].filter(elem => elem['@language'] === this.dpiLocale)" :key="index">
            {{ el['@value'] }}
        </div>
    </td>
  </div>
</template>

<script>
import dateFilters from "@/modules/filters/dateFilters";

export default {
    props: {
        property: String,
        value: Object,
        data: Object,
        dpiLocale: String,
    },
    methods: {
        filterDateFormatEU(date) {
            return dateFilters.formatEU(date);
        },
    }
    
}
</script>