import Repeatable from "./Repeatable.vue";
import { FormKitLibrary } from "@formkit/core";
import { createInput } from '@formkit/vue';


import {
    AutocompleteInput,
    FileUpload,
    UniqueIdentifierInput,
    // ComplexConditionalInput,
} from '@piveau/piveau-hub-ui-modules';

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