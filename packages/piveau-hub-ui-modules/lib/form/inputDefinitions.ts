import Repeatable from "./Repeatable.vue";
import { FormKitLibrary } from "@formkit/core";
import { createInput } from '@formkit/vue';
import FormKitGroup from "./formKitGroup.vue";

import AutocompleteInput from "../data-provider-interface/components/AutocompleteInput.vue";
import FileUpload from "../data-provider-interface/components/FileUpload.vue";
import UniqueIdentifierInputNew from "../data-provider-interface/components/UniqueIdentifierInputNew.vue";

export default {
    repeatable: {
        type: 'list',
        component: Repeatable
    },
    id: {
        type: 'input',
        component: UniqueIdentifierInputNew,
        props:['titleValue']
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