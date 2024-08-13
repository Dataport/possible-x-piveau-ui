<template>
    <h1>{{ props.id }} </h1>
    <h2>{{ props.name }}</h2>
    <p>{{ props.description }}</p>
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
  name: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required:false
  }
})

</script>