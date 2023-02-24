<template>
  <div>
    <!-- SINGULAR URL -->
    <td v-if="value.type === 'singularURL'">
        <app-link :to="data[property]">
            {{ data[property] }}
            </app-link>
    </td>

    <!-- MULTI URLs -->
    <td v-if="value.type === 'multiURL'">
        <div v-for="(el, index) in data[property]" :key="index">
            <!-- regular multiple URLs -->
            <app-link v-if="showValue(el, '@id')" :to="el['@id']">
            {{ el['@id'] }}
            </app-link>
            <!-- IS USED BY -->
            <app-link v-if="showValue(el, 'dext:isUsedBy')" :to="el['dext:isUsedBy']">
                {{ el['dext:isUsedBy'] }}
            </app-link>
        </div>
    </td>
  </div>
</template>

<script>
import AppLink from "@/modules/widgets/AppLink";
import { has, isNil, isEmpty } from 'lodash';

export default {
    props: {
        property: String,
        value: Object,
        data: Object,
    },
    components: {
        AppLink,
    },
    methods: {
        showValue(property, value) {
            return has(property, value) && !isNil(property[value]) && !isEmpty(property[value]);
        },
    }
}
</script>