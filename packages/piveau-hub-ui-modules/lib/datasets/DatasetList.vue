<template>
  <component :is="as">
    <template v-for="dataset in computedDatasets">
      <slot :data="{
        dataset: dataset
      }">
        <pv-data-info-box
          :key="dataset.id"
          :to="`/datasets/${dataset.id}`"
          :src="dataset.src"
          :dataset="dataset.dataset"
          :description-max-length="1000"
          :data-cy="`dataset@${dataset.id}`"
          class="mt-3"
        />
      </slot>
    </template>
  </component>
</template>

<script lang="ts" setup>
import PvDataInfoBox from '../PvDataInfoBox/PvDataInfoBox.vue'

import { useDataInfoBox } from '../composables/useDataInfoBox';

const props = withDefaults(defineProps<{
  as?: string;
  datasets: any;
  locale: string;
}>(), {
  as: 'div'
})

const computedDatasets = useDataInfoBox({ 
  datasets: props.datasets,
  locale: props.locale
 })
</script>

<style lang="scss" scoped>

</style>