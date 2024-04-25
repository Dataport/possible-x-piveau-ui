<template>
    <div v-if="value.type === 'conditional'">
       
    </div>
</template>

<script>
import AppLink from "../../../../widgets/AppLink";
import URIProp from './URIProp.vue';
import { has, isNil, isEmpty } from 'lodash';

export default {
    props: {
        property: String,
        value: Object,
        data: undefined,
    },
    components: {
        URIProp,
        AppLink,
    },
    methods: {
        showValue(property, value) {
            return has(property, value) && !isNil(property[value]) && !isEmpty(property[value]);
        },
    }

}
</script>
