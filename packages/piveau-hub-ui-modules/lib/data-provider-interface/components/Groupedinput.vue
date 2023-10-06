<template>
    <div :class="`formkit-input-element formkit-input-element--${context.type}`" :data-type="context.type" v-bind="$attrs" class="w-100">
        <hr>
        <div class="d-flex w-100">
            <FormKit type="text" :options="context.options" :name="context.name" :label="$t('message.dataupload.type')"
            :placeholder="context.attributes.placeholder" class="col-6"></FormKit>
            <FormKit type="select" :options="context.help" :name="context" :label="$t('message.dataupload.datasets.language.label')"
            :placeholder="context.attributes.placeholder" class="col-6"></FormKit>
        </div>
       
    </div>
</template>
  
<script>
/* eslint-disable,arrow-parens,no-param-reassign, no-lonely-if, no-await-in-loop */
import { mapActions } from "vuex";



export default {
    ...mapActions("dpiStore", [
      "requestFirstEntrySuggestions",
      "requestAutocompleteSuggestions",
      "requestResourceName",
    ]),
    props: {
        context: {
            type: Object,
            required: true,
        },
        data: {},
    },
    data() {
        return {};
    },
    computed: {},
    async mounted() {},
    methods: {
        ...mapActions("dpiStore", [
            "requestFirstEntrySuggestions",
            "requestAutocompleteSuggestions",
            "requestResourceName",
        ]),
    },
    directives: {},
    watch: {},
};
</script>
  
<style scoped></style>
  