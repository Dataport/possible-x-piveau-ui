<template>
    Generic title
    <h1>{{id}} </h1>
    <p>{{ description }}</p>
    <slot>

    </slot>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'


const props = defineProps({
  id: {
    type: String,
    required: false
  },
  description: {
    type:String,
    required:false
  }
})

</script>