<template>
  <app-link
    class="nav-link dsd-nav-page"
    :to="{ path, query: Object.assign({}, { locale: $route.query.locale }) }"
    :exact="exact"
  >
    <span :title="tooltip"
          data-toggle="tooltip"
          data-placement="top">
            {{ title }}
    </span>
  </app-link>
</template>

<script>
import AppLink from "../../widgets/AppLink";
export default {
  name: "DatasetDetailsNavigationPage",
  components: {AppLink},
  props: {
    title: String,
    tooltip: String,
    path: String,
    exact: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
.nav-link {
  text-decoration: underline;
}
</style>
