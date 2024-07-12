<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getNode, isPlaceholder } from '@formkit/core'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
import { getCurrentInstance } from "vue";
import {
    has,
    isNil,
} from 'lodash-es';
import { FormKit } from '@formkit/vue';

const props = defineProps({
    context: Object
})

</script>
<template>
    <div class="formkitProperty">
        <h4>{{ props.context.label }}</h4>
        <div class="position-relative formkitCmpWrap">
            <FormKit class="autocompleteInputfield" :identifier="props.context.attrs.identifier"
                :name="props.context.node.name" 
                :help="props.context.help"
                :placeholder="props.context.attrs.placeholder"
                :validation="props.context.attrs.validationType"
                 />
        </div>
    </div>
</template>
<style></style>