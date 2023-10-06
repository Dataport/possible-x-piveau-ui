<!-- TODO i18n integration -->
<template>
    <div :class="`formkit-input-element formkit-input-element--${context.type}`" :data-type="context.type" v-bind="$attrs" class="w-100">
        <div class="d-flex w-100 ">
            <!--{{context.slotProps.component.min}}-->
            <FormKit :name="context.name" :placeholder="context.attributes.placeholder" v-model="urlInput"
                :validation="validateNumber" :validation-rules="validateNumberRules"
                :validation-messages="validateNumberMessages" class="w-100">
            </FormKit>
        </div>

    </div>
</template>
  
<script>
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
        subject: {
            type: Boolean,
            required: false,
        },
        value: {
            type: String,
            default: 'en',
        },
        data: {},
    },
    data() {
        return {
            validation_format: '',
            urlInput: '',
            validateNumber: this.chooseValidationFormat(),
            validateNumberRules: this.chooseValidationRule(),
            validateNumberMessages: this.chooseValidationMessage(),

        };
    },
    computed: {

        locale: {
            get() {
                return this.value;
            },
            set(newLocale) {
                this.$emit('input', newLocale);
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.populateUrl();
            this.chooseValidationFormat();
        })
    },
    created() {
    
    },
    methods: {
        populateUrl() {
            if (this.context.model) this.urlInput = this.context.model;
        },
        chooseValidationFormat() {
            if (this.context.name === "Year") return 'optional|year';
            if (this.context.name === "Month") return 'optional|month';
            if (this.context.name === "Day") return 'optional|day';
            if (this.context.name === "Hour") return 'optional|hour';
            if (this.context.name === "Minute") return 'optional|minute';
            if (this.context.name === "Second") return 'optional|minute';

        }, chooseValidationRule() {
            if (this.context.name === "Year") return { year: () => /^(19[5-9]\d|20[0-4]\d|2100)$/.test(this.urlInput) };
            if (this.context.name === "Month") return { month: () => /(^0?[1-9]$)|(^1[0-2]$)/.test(this.urlInput) };
            if (this.context.name === "Day") return { day: () => /^([0-2]?[1-9]|3[01]|10|20)$/.test(this.urlInput) };
            if (this.context.name === "Hour") return { hour: () => /^([0-9]|1[0-9]|2[0-3])$/.test(this.urlInput) };
            if (this.context.name === "Minute") return { minute: () => /^([0-9]|[1-5]\d|60|all)$/.test(this.urlInput) };
            if (this.context.name === "Second") return { minute: () => /^([0-9]|[1-5]\d|60|all)$/.test(this.urlInput) };

        },
        chooseValidationMessage() {
            return {
                year: 'This is not a valid year (range 1950 - 2050)',
                month: 'This is not a valid month (1-12)',
                day: 'This is not a valid day (1-31)',
                hour: 'The hour is not a valid (0-23)',
                minute: 'The minute is not a valid (0-59)',
                second: 'The second is not a valid (0-59)'
            }

        }
    },
    watch: {

    },
};
</script>
  
<style scoped></style>
  