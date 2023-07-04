/*
Custom DatePicker component (datetime-local) for vue-formulate.
Fixes the issue where the default datetime-local input is not supported well on Firefox
*/

<template>
  <div>
    <vue-date-picker v-model="context.model" :type="type"
      :class="`formulate-input-element formulate-input-element--${context.type} d-block w-100`" :editable="true"
      :show-second="false" :format="format" :value-type="valueType" @input="onInput" :default-value="new Date()"
      :disabled-date=compareStartEnd />
  </div>
</template>

<script>
// https://github.com/mengxiong10/vue2-datepicker
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';


export default {
  name: "DatePicker",
  data() {
    return {

      type: 'date',
      format: 'YYYY-MM-DD',
      valueType: 'YYYY-MM-DD',
    };
  },
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  components: {
    VueDatePicker: DatePicker,
  },
  created() {
    if (!this.context) {
      throw new Error(`DatePicker: context is required.
      Are you sure you use this component as a custom vue-formulate input?`);
    }
  },
  methods: {
    onInput() {
      this.context.rootEmit('change');
    },
    getCurrentStep() {
      return this.$router.history.current.path
    },
    compareStartEnd(date) {

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let currentPage = this.$route.params.page;
      let currentProperty = this.$route.params.property;
      let endDate, startDate = "";

      try {
        endDate = new Date(JSON.parse(localStorage.getItem("dpi_" + currentProperty))[currentPage][this.context.attributes.end][0]["dcat:endDate"]);
      } catch (error) {
      }
      try {
        startDate = new Date(JSON.parse(localStorage.getItem("dpi_" + currentProperty))[currentPage][this.context.attributes.start][0]["dcat:startDate"]);
      } catch (error) {
      }
      if (this.context.attributes.end != undefined) {
        return date < today || date > endDate;
      }

      if (this.context.attributes.start != undefined) {
        return date < startDate || date > endDate;
      }
    },
  },
}
</script>

<style></style>
