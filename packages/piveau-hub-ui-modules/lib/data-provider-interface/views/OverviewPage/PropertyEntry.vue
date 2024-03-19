<template>
    <div>
        <!-- <h5>({{ property }})</h5> -->

        <tr class="align-items-center" v-if="isSet">

            <!-- <td class=" font-weight-bold" v-if="value.type !== 'special'">{{ $t(`${value.label}`) }}:</td> -->
            <URIProp :property="property" :value="value" :data="data">
                <p>{{ value.type }}</p>
            </URIProp>
            <URLProp :property="property" :value="value" :data="data"></URLProp>
            <StringProp :property="property" :value="value" :data="data" :dpiLocale="dpiLocale"></StringProp>
            <ConditionalProp :property="property" :value="value" :data="data"></ConditionalProp>
            <!-- SPECIAL -->
            <div class="w-100" v-if="value.type === 'special'">

                <div v-if="property != 'dct:creator' && property != 'dcat:temporalResolution'">
                    <div v-for="(elem, index) in data[property]" :key="index">
                        <SpecialProp :property="property" :value="value" :data="elem" :dpiLocale="dpiLocale"></SpecialProp>
                    </div>
                </div>
                <div v-else>
                    <SpecialProp :property="property" :value="value" :data="data[property]" :dpiLocale="dpiLocale">
                    </SpecialProp>
                </div>

            </div>
            
        </tr>
    </div>
</template>

<script>
import URIProp from './Properties/URIProp.vue';
import URLProp from './Properties/URLProp.vue';
import StringProp from './Properties/StringProp.vue';
import SpecialProp from './Properties/SpecialProp.vue';
import ConditionalProp from './Properties/ConditionalProp';
import generalHelper from '../../utils/general-helper';

import { has, isNil, isEmpty } from 'lodash';

export default {
    components: {
        URIProp,
        URLProp,
        StringProp,
        SpecialProp,
        ConditionalProp,
    },
    props: {
        profile: String,
        data: Object,
        property: String,
        value: Object,
        dpiLocale: String,
        distId: Number,
    },
    computed: {
        isSet() {
            return generalHelper.propertyHasValue(this.data[this.property]);
        }
    }
}
</script>
