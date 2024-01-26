<script setup>
import { ref } from 'vue'
import { createInput } from '@formkit/vue'
import OverviewPage from './OverviewPage.vue'

const props = defineProps({
    values: Object,
})

const values = ref({})
const ovp = createInput(OverviewPage, {
})
</script>

<template>
        <FormKit :type="ovp" id="overviewFormkit" :formValues="props.values" />
    <pre wrap>{{ props.values }}</pre>
</template>
<script>

</script>
<style></style>