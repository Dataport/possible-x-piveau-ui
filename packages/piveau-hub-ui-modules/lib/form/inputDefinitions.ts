import Repeatable from "./Repeatable.vue";
import { FormKitLibrary } from "@formkit/core";
import { createInput } from '@formkit/vue';

import AutocompleteInput from "../data-provider-interface/components/AutocompleteInput.vue";
import FileUpload from "../data-provider-interface/components/FileUpload.vue";
import UniqueIdentifierInput from "../data-provider-interface/components/UniqueIdentifierInput.vue";

export default {
    repeatable: {
        type: 'list',
        component: Repeatable
    },
    // auto: {
    //     type: 'input',
    //     props: ['voc'],
    //     component: AutocompleteInput,
    // },
    auto:createInput(AutocompleteInput, {props: ['voc'],}),
    fileupload: createInput(FileUpload, {}),
    id: createInput(UniqueIdentifierInput, {}),
    // cc: createInput(ComplexConditionalInput, {}),


} as FormKitLibrary;