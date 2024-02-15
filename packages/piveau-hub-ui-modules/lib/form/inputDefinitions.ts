import Repeatable from "./Repeatable.vue";
import { FormKitLibrary } from "@formkit/core";
import { createInput } from '@formkit/vue';
import FormKitGroup from "./formKitGroup.vue";

import AutocompleteInput from "../data-provider-interface/components/AutocompleteInput.vue";
import FileUpload from "../data-provider-interface/components/FileUpload.vue";
import UniqueIdentifierInput from "../data-provider-interface/components/UniqueIdentifierInput.vue";

export default {
    repeatable: {
        type: 'list',
        component: Repeatable
    },
    id: {
        type: 'input',
        component: UniqueIdentifierInput,
    },
    auto: {
        type: 'group',
        component: AutocompleteInput
    },
    fileupload: {
        type: 'group',
        component:FileUpload
    },

} as FormKitLibrary;