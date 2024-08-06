<template>
    Generic title
    <!-- <h1>{{name}} </h1> -->
    <slot>

    </slot>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useResourcesStore } from '../../store/resourcesStore'

import { defineProps } from 'vue'

// Define the props the component expects
// const props = defineProps({
//   name: {
//     type: String,
//     required: true
//   }
// })

</script>