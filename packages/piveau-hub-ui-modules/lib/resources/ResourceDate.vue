<template>
  <span
    class="d-inline-block"
    :title="getDate"
  >
    <span :class="{ 'date-incorrect': isIncorrectDate() }" class="mr-1">{{ getDate }}</span>
    <font-awesome-icon
      v-if="isIncorrectDate()"
      class="date-incorrect-exclamation-triangle"
      :icon="['fas', 'exclamation-triangle']"
    />
  </span>
</template>

<script lang="ts" setup>
import { computed, onMounted, nextTick } from 'vue';
import dayjs from 'dayjs';
import dateFilters from '../filters/dateFilters';

const props = defineProps(['date']);

function filterDateFormatEU(date: any) {
  return typeof date === 'object'
    ? dateFilters.formatEU(date)
    : date;
};

function isIncorrectDate() {
  // Falsy dates are considered as intentionally blank and are correct.
  if (!props.date) return false;
  const m = dayjs(String(props.date));
  if (!m.isValid()) {
    return true;
  }

  // Dates in the future are incorrect.
  if (dayjs().diff(m) < 0) {
    return true;
  }

  return false;
};

const getDate = computed((): string => {
  return isIncorrectDate()
    ? 'This date is incorrect or incomplete, please contact the data provider.'
    : filterDateFormatEU(props.date)
});

onMounted(() => {
  nextTick(() => {
    isIncorrectDate();
  });
});
</script>