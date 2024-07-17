<template>
    <div class="bg-primary text-white align-self-start p-5">
        Add facets for {{ $t(`message.header.navigation.data.${resource}`) }} here
    </div>
</template>

<script>
export default {
    name: "ResourceFacets",
    components: {},
    props: ['resource'],
    data() {
        return {};
    },
    created() {},
    methods: {},
}
</script>

<style lang="scss" scoped>
</style>
  