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
            // console.log(property,value);
            if (property === undefined) { return false }
            if (value === "dct:modified" || value === "dct:issued") return false
            if (value === "dct:creator") {
                if (isNil(property["dct:creator"]['foaf:name']) &&
                    isNil(property["dct:creator"]['foaf:mbox']) &&
                    isNil(property["dct:creator"]['foaf:homepage'])) {
                    return false
                }
                return true
            }
            if (value === "dcat:temporalResolution") {
                // console.log(property[value], Object.keys(property[value]).length);
                try {
                    if (Object.keys(property[value]).length > 0) {
                        if (isNil(property[value]['Day']) && isNil(property[value]['Hour']) &&
                            isNil(property[value]['Minute']) && isNil(property[value]['Year']) &&
                            isNil(property[value]['Month']) && isNil(property[value]['Second'])) {
                            return false
                        }
                        else {
                            return true
                        }
                    }
                    else return false
                } catch (error) {

                }
            }
            try {

                // console.log(Object.keys(property[value][0]).length, isNil(Object.keys(property[value][0])), Object.keys(property[value][0]), property[value][0], value);

                if (Object.keys(property[value][0]).length < 2) {
                    if (property[value][0][Object.keys(property[value][0])] === undefined ||
                        Object.keys(property[value][0])[0] === '@language') {
                        return false
                    }
                    else return true
                }
                if (Object.keys(property[value][0]).length > 0) {
                    if (value === "foaf:page") {

                        for (let index = 0; index < Object.keys(property[value][0]).length; index++) {

                            if (Object.keys(property[value][0])[index] === 'dct:format' && isNil(property[value][0][index])) {
                                return false
                            }
                            if (property[value][0][Object.keys(property[value][0])[index]][0]['@value'] === undefined ||
                                property[value][0][Object.keys(property[value][0])[index]][0]['@value'] === "") {
                                return false
                            }
                            else return true
                        }
                    }
                    for (let index = 0; index < Object.keys(property[value][0]).length; index++) {
                        if (Object.keys(property[value][0]).length <= 1 &&
                            property[value][0][Object.keys(property[value][0])[index]] === undefined) {
                            return false
                        }
                        if (Object.keys(property[value][0]).length > 1) {
                            listOfEmptyObjects.push(property[value][0][Object.keys(property[value][0])[index]] === undefined)
                            if (index + 1 === Object.keys(property[value][0]).length) {
                                if (Object.keys(property[value][0])[0] === '@language' && property[value][0]['@value'] === undefined ||
                                    property[value][0]['@value'] === "") return false
                                if (!listOfEmptyObjects.every(v => v === true)) return true;
                                else return false
                            }
                        }
                    }
                }
            } catch (error) {
            }     
            if (property[value] != null && value !== 'dct:publisher' && value !== 'dcat:temporalResolution') {
                // console.log(property[value], value, Object.keys(property[value]).length === 0);
                if (Object.keys(property[value]).length === 0) {
                    return false
                } else return true
            }
        },
    }
}
</script>
