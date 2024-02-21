<template>
    <div>
        <!-- <h5>({{ property }})</h5> -->

        <tr class="align-items-center" v-if="showValue(data, property)">

            <!-- <td class=" font-weight-bold" v-if="value.type !== 'special'">{{ $t(`${value.label}`) }}:</td> -->
            <URIProp :property="property" :value="value" :data="data">
                <p>{{ value.type }}</p>
            </URIProp>
            <URLProp :property="property" :value="value" :data="data"></URLProp>
            <StringProp :property="property" :value="value" :data="data" :dpiLocale="dpiLocale"></StringProp>
            <ConditionalProp :property="property" :value="value" :data="data"></ConditionalProp>
            <!-- SPECIAL -->
            <div class="w-100" v-if="value.type === 'special'">

                <div v-if="property != 'dct:creator' && property !== 'dcat:temporalResolution'">
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
    methods: {
        // Check if there's a valid value present
        showValue(property, value) {
            let listOfEmptyObjects = [];
            try {
                // console.log("Before if statements:  ", Object.keys(property[value][0]).length, isNil(Object.keys(property[value][0])), Object.keys(property[value][0]), property[value][0], value);
                if (Object.keys(property[value][0]).length < 2) {
                    if (property[value][0][Object.keys(property[value][0])] === undefined) {
                        return false
                    }
                    else return true
                }
                if (Object.keys(property[value][0]).length > 0) {
                    //    todo --- Page and Creator
                    if (value === "foaf:page") {
                        return false
                    }
                    if (value === "dct:creator") {
                        return false
                    }
                    for (let index = 0; index < Object.keys(property[value][0]).length; index++) {
                        if (Object.keys(property[value][0]).length <= 1 && property[value][0][Object.keys(property[value][0])[index]] === undefined) {
                            return false
                        }
                        if (Object.keys(property[value][0]).length > 1) {
                            listOfEmptyObjects.push(property[value][0][Object.keys(property[value][0])[index]] === undefined)
                            if (index + 1 === Object.keys(property[value][0]).length) {
                                if (Object.keys(property[value][0])[0] === '@language' && property[value][0]['@value'] === undefined || property[value][0]['@value'] === "") return false
                                // console.log(Object.keys(property[value][0]), listOfEmptyObjects.every(v => v === true));
                                if (!listOfEmptyObjects.every(v => v === true)) return true;

                                else return false
                            }
                        }
                    }
                }
            } catch (error) {
            }

        },
    }
}
</script>
