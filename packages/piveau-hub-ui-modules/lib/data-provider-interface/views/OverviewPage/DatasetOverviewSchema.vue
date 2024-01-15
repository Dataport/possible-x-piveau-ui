<template>
    <div class="dataset-overview-interaction-bar">
        <h2>Language Chooser</h2>
    </div>
    <details>{{ values }}</details>
    <div v-for="key in Object.keys(values)" :key="key">
        <div v-if="key === 'mandatory'">
            <div v-for="keyInMandatory in Object.keys(values[key])" :key="keyInMandatory">
                {{ this.buildField(keyInMandatory, values, key).title }}
                {{ this.buildField(keyInMandatory, values).value }}
            </div>

        </div>
        <!-- <div v-if="key === 'advised'">
            <span>{{ values[key] }}</span>
        </div>
        <div v-if="key === 'recommended'">
            <span>{{ values[key] }}</span>
        </div>
        <div v-if="key === 'distribution'">
            <span>{{ values[key] }}</span>
        </div> -->

    </div>
</template>
<script>
import { defineComponent } from 'vue';
export default defineComponent({
    props: {
        values: {
            required: true,
            type: Object,
        }
    }, data() {

    }, methods: {
        buildField(property, objectOfProperties, step) {

            if (objectOfProperties[step] != undefined) {
                if (objectOfProperties[step][property] != undefined) {
                    if (objectOfProperties[step][property][0] != undefined) {
                        if (objectOfProperties[step][property][0]['@value'] != undefined) {
                            console.log(objectOfProperties[step][property][0]['@value']);
                            // return { "title": property, "value": objectOfProperties[step][property][0]['@value'] }

                        }



                    }

                }
            }
            else return { "title": property, "value": "test" }


        }
    }
});
</script>
<style></style>