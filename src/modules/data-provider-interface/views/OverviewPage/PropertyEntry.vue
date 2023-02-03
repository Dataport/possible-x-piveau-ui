<template>
    <div>
        <tr v-if="showValue(data, property)">
            <td class="w-25 font-weight-bold">{{ $t(`${value.label}`)}}:</td>

            <URIProp :property="property" :value="value" :data="data"></URIProp>
            <URLProp :property="property" :value="value" :data="data"></URLProp>
            <StringProp :property="property" :value="value" :data="data" :dpiLocale="dpiLocale"></StringProp>

            <!-- SPECIAL -->
            <td v-if="value.type === 'special'">
                <div v-for="(elem, index) in data[property]" :key="index">
                    <SpecialProp :property="property" :value="value" :data="elem" :dpiLocale="dpiLocale"></SpecialProp>
                </div>
            </td>
        </tr>
    </div>
</template>

<script>
import AppLink from "@/modules/widgets/AppLink";
import URIProp from './Properties/URIProp.vue';
import URLProp from './Properties/URLProp.vue';
import StringProp from './Properties/StringProp.vue';
import SpecialProp from './Properties/SpecialProp.vue';

import { has, isNil, isEmpty } from 'lodash';

export default {
    components: {
        AppLink,
        URIProp,
        URLProp,
        StringProp,
        SpecialProp,
    },
    props: {
        profile: String,
        data: Object,
        property: String,
        value: Object,
        dpiLocale: String,
        distId: Number,
    },
    methods: {
        showValue(property, value) {
            return has(property, value) && !isNil(property[value]) && !isEmpty(property[value]);
        },
    }
}
</script>