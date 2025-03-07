import Repeatable from "./Repeatable.vue";
import FormKitGroup from "./FormKitGroup.vue";
import { FormKitLibrary } from "@formkit/core";
import AutocompleteInput from "../data-provider-interface/components/AutocompleteInput.vue";
import FileUpload from "../data-provider-interface/components/FileUpload.vue";
import UniqueIdentifierInput from "../data-provider-interface/components/UniqueIdentifierInput.vue";
import SpatialInput from "../data-provider-interface/components/SpatialInput.vue";
import ConditionalInput from "../data-provider-interface/components/ConditionalInput.vue";
import SimpleSelect from "../data-provider-interface/components/SimpleSelect.vue";
import SimpleInput from "../data-provider-interface/components/SimpleInput.vue";

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
        component: FileUpload
    },
    spatialinput: {
        type: 'group',
        component: SpatialInput
    },
    formkitGroup: {
        type: 'group',
        component: FormKitGroup
    },
    simpleConditional: {
        type: 'group',
        component: ConditionalInput
    },
    simpleSelect: {
        type: 'input',
        component: SimpleSelect,
    },
    simpleInput: {
        type: 'input',
        component: SimpleInput,
    },


} as FormKitLibrary;