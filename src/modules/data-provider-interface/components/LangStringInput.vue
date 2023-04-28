<template>
    <div :class="`formulate-input-element formulate-input-element--${context.type}`" :data-type="context.type"
        v-on="$listeners" class="w-100">

        <div class="d-flex w-100 langStringWrap">
            <a class="p-1 pl-3 d-flex align-items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                    class="bi bi-globe-americas" viewBox="0 0 16 16">
                    <path
                        d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0ZM2.04 4.326c.325 1.329 2.532 2.54 3.717 3.19.48.263.793.434.743.484-.08.08-.162.158-.242.234-.416.396-.787.749-.758 1.266.035.634.618.824 1.214 1.017.577.188 1.168.38 1.286.983.082.417-.075.988-.22 1.52-.215.782-.406 1.48.22 1.48 1.5-.5 3.798-3.186 4-5 .138-1.243-2-2-3.5-2.5-.478-.16-.755.081-.99.284-.172.15-.322.279-.51.216-.445-.148-2.5-2-1.5-2.5.78-.39.952-.171 1.227.182.078.099.163.208.273.318.609.304.662-.132.723-.633.039-.322.081-.671.277-.867.434-.434 1.265-.791 2.028-1.12.712-.306 1.365-.587 1.579-.88A7 7 0 1 1 2.04 4.327Z" />
                </svg>
                <select v-model="locale">
                    <option v-for="lang in Object.keys(languages)" :key="lang" :value="lang">{{ languages[lang] }}</option>
                </select>
            </a>
            <FormulateInput type="text" :options="context.options" :name="context.name"
                :placeholder="context.attributes.placeholder" class="">
            </FormulateInput>

            <!-- <FormulateInput type="select" :options="context.help" :name="context"
                :label="$t('message.dataupload.datasets.language.label')" :placeholder="context.attributes.placeholder"
                class="col-6"></FormulateInput> -->
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
        subject: {
            type: Boolean,
            required: false,
        },
        annifTheme: {
            type: Boolean,
            required: false,
        },
        multiple: {
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
            languages: {
                bg: 'Български',
                cs: 'čeština',
                da: 'dansk',
                de: 'Deutsch',
                el: 'Ελληνικά',
                en: 'English',
                es: 'español',
                et: 'eesti',
                fr: 'français',
                ga: 'Gaeilge',
                hr: 'Hrvatski',
                hu: 'Magyar',
                it: 'italiano',
                lt: 'lietuvių',
                lv: 'latviešu',
                mt: 'Malti',
                nl: 'Nederlands',
                pl: 'polski',
                pt: 'português',
                ro: 'română',
                sk: 'slovenčina',
                sl: 'slovenščina',
                fi: 'suomi',
                sv: 'svenska',
            }
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
    async mounted() {
        console.log(this.context);
    },
    methods: {
        ...mapActions("dpiStore", [
            "requestFirstEntrySuggestions",
            "requestAutocompleteSuggestions",
            "requestResourceName",
        ]),
    },
    directives: {

    },
    watch: {

    },
};
</script>
  
<style scoped>
select {
    -webkit-appearance: none;
    appearance: none;
    border: none;
    padding-left: 0.5rem;
}

.langStringWrap a {
    border: 1px solid #cecece;
    border-radius: 5px 0 0 5px;
}
</style>
  