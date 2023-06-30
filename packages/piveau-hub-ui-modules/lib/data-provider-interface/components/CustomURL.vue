<template>
    <div :class="`formulate-input-element formulate-input-element--${context.type}`" :data-type="context.type"
        v-on="$listeners" class="w-100">
        <div class="d-flex w-100 ">
            <FormulateInput type="url" :name="context.name" :placeholder="context.attributes.placeholder" v-model="urlInput"
                :validation="myUrl" :validation-rules="myUrlRules" :validation-messages="myUrlMessages" @input="handleInput" class="w-100">
            </FormulateInput>
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
            urlInput: '',
            myUrl: 'optional|myUrl',
            myUrlRules: { myUrl: () => /[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+/.test(this.urlInput) },
            myUrlMessages: { myUrl: 'Please enter a valid URL (e.g.: "https:// ..." or "www. ...")' }
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

        })

    },
    methods: {
        populateUrl() {
            if (this.context.model) {
                this.urlInput = this.context.model;
            }
        },
        handleInput(){
            if(this.urlInput.includes("https://") || this.urlInput.includes("http://")){
                
            }
            else{
                this.urlInput = "https://"+this.urlInput
            }
        }
    },
    watch: {

    },
};
</script>
  
<style scoped></style>
  