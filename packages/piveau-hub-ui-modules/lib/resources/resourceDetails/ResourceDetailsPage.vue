<template>
    <div>
        <h1>{{ id }}</h1>
    </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const id = route.params?.resource_id;
</script>