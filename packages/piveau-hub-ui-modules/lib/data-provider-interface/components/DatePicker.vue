/*
Custom DatePicker component (datetime-local) for vue-formulate.
Fixes the issue where the default datetime-local input is not supported well on Firefox
*/

<template>
  <div @click="newField">
    <div v-if="notRange">
      <vue-date-picker v-model="context.model" :type="type"
        :class="`formulate-input-element formulate-input-element--${context.type} d-block w-100`" :clearable="false"
        :show-second="false" :format="format" :value-type="valueType" @input="onInput" :default-value="new Date()"
        :editable="false" :disabled-date="disabledDates" />
    </div>
    <div v-else>
      <input v-model="context.model" hidden/>
      <vue-date-picker v-model="dateValues" :type="type"
        :class="`formulate-input-element formulate-input-element--${context.type} d-block w-100`" :clearable="false"
        :show-second="false" :format="format" :value-type="valueType" @input="onInput" :default-value="new Date()"
        range />
    </div>

  </div>
</template>

<script>
import { nextTick } from 'vue';
// https://github.com/mengxiong10/vue2-datepicker
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import { has } from 'lodash';

export default {
  name: "DatePicker",
  data() {
    return {
      disabledDates: this.compareWithIssued,
      notRange: true,
      counter: "",
      type: 'date',
      format: 'YYYY-MM-DD',
      valueType: 'YYYY-MM-DD',
      dateValues: [],
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
    
    if (this.context.attributes.identifier === "temporalRange") this.notRange = false;
    if (!this.context) {
      throw new Error(`DatePicker: context is required.
      Are you sure you use this component as a custom vue-formulate input?`);
    }
  },
  computed: {
  },
  mounted(){
   
    
  },
  methods: {
    onInput() {
      if (!this.notRange) this.context.model = {'dcat:startDate': this.dateValues[0], 'dcat:endDate': this.dateValues[1] };
      this.context.rootEmit('change');
      if (this.context.attributes.handler === "issued") this.validateIssued(this.context.model);
    },
    newField() {
      if (this.context.attributes.handler === "modified") this.compareWithIssued(this.context.model);
      // if (this.context.attributes.handler === "issued") this.validateIssued(this.context.model);
      this.context.rootEmit('change');

    },
    getCurrentStep() {
      return this.$router.history.current.path
    },
    setIndex() {
      if (this.index === "") { this.index = this.counter - 1 }
    },
    compareWithIssued(date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let currentPage = this.$route.params.page;
      let currentProperty = this.$route.params.property;
      let issued = ""

      console.log();
      try {
        issued = new Date(JSON.parse(localStorage.getItem("dpi_" + currentProperty))[currentPage]["dct:issued"]);
      } catch (error) {

      }
      if(this.context.attributes.handler === "modified") return date < today || date < issued || date > new Date(new Date().setFullYear(new Date().getFullYear() + 1));
      else return
    },
    validateIssued(date) {
      const today = new Date();
      
      
      if (new Date(date) < today + 1) {
        alert("The date of issued lies before the current date, is that intended?")
      }
      if (new Date(date) > today - 1) {
        alert("The date of issued lies after the current date, is that intended?")
      }
      
    },
    // compareStartEnd(date) {

    //   const today = new Date();
    //   today.setHours(0, 0, 0, 0);
    //   let currentPage = this.$route.params.page;
    //   let currentProperty = this.$route.params.property;
    //   let endDate, startDate = "";

    //   try {
    //     endDate = new Date(JSON.parse(localStorage.getItem("dpi_" + currentProperty))[currentPage][this.context.attributes.end][0]["dcat:endDate"]);
    //   } catch (error) {
    //   }
    //   try {
    //     startDate = new Date(JSON.parse(localStorage.getItem("dpi_" + currentProperty))[currentPage][this.context.attributes.start][0]["dcat:startDate"]);
    //   } catch (error) {
    //   }
    //   if (this.context.attributes.end != undefined) {
    //     return date < today || date > endDate;
    //   }

    //   if (this.context.attributes.start != undefined) {
    //     return date < startDate || date > endDate;
    //   }
    // },
    fillValues() {
      if (this.context.attributes.name === 'dct:temporal') {
        if (has(this.context.model, 'dcat:startDate') && has(this.context.model, 'dcat:endDate')) {
          this.dateValues = [this.context.model['dcat:startDate'], this.context.model['dcat:endDate']];
        }
      }
    }
  },
  watch: {
    context: {
      handler() {
        if (this.context.model !== "") {
          this.fillValues();
        }
      }
    }
  }

}
</script>

<style></style>
