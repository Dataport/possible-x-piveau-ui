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

<script>
import dayjs from 'dayjs';
import dateFilters from '../filters/dateFilters';

export default {
  props: ['date'],
  computed: {
    getDate() {
      return this.isIncorrectDate()
        ? 'This date is incorrect or incomplete, please contact the data provider.'
        : this.filterDateFormatEU(this.date);
    },
  },
  methods: {
    filterDateFormatEU(date) {
      return typeof date === 'object'
        ? dateFilters.formatEU(date)
        : date;
    },
    // Checks date plausibility. Returns true, if the date is not plausible.
    isIncorrectDate() {
      // Falsy dates are considered as intentionally blank and are correct.
      if (!this.date) return false;
      const m = dayjs(String(this.date));
      if (!m.isValid()) {
        // this.setDateIncorrect();
        return true;
      }

      // Dates in the future are incorrect.
      if (dayjs().diff(m) < 0) {
        // this.setDateIncorrect();
        return true;
      }

      return false;
    },
  },
  mounted() {
    console.log(this.date);
    this.$nextTick(() => {
      // To force event emit
      this.isIncorrectDate();
    });
  },
};
</script>

<style lang="scss" scoped>
.date-incorrect {
  color: #a1a1a1;
}

.date-incorrect-exclamation-triangle {
  color: #ffaa00;
}
</style>
