<template>
  <nav>
    <ul class="menu m-0 list-inline list-unstyled navbar-nav mr-auto">
      <li
        class="mr-2 list-inline-item nav-item text-nowrap"
      >
        <app-link
          class="nav-link"
          :to="{ path: `/datasets/${getID}`, query: Object.assign({}, { locale: $route.query.locale }) }"
          :title="$t('message.tooltip.datasetDetails.dataset')"
          :exact="true"
        >
              <span :title="$t('message.tooltip.datasetDetails.dataset')"
                    data-toggle="tooltip"
                    data-placement="top">
                      {{ $t('message.datasetDetails.subnav.dataset') }}
              </span>
        </app-link>
      </li>
      <li
        class="mr-2 list-inline-item nav-item text-nowrap"
      >
        <app-link
          class="nav-link"
          :to="{ path: `/datasets/${getID}/categories`, query: Object.assign({}, { locale: $route.query.locale }) }"
        >
            <span :title="$t('message.tooltip.datasetDetails.categories')"
                  data-toggle="tooltip"
                  data-placement="top">
                  {{ $t('message.datasetDetails.subnav.categories') }}
            </span>
        </app-link>
      </li>
      <li
        class="mr-2 list-inline-item nav-item text-nowrap"
      >
        <app-link
          class="nav-link"
          :to="{ path: `/datasets/${getID}/similarDatasets`, query: Object.assign({}, { locale: $route.query.locale }) }"
        >
              <span :title="$t('message.tooltip.datasetDetails.similarDatasets')"
                    data-toggle="tooltip"
                    data-placement="top">
                    {{ $t('message.datasetDetails.subnav.similarDatasets') }}
              </span>
        </app-link>
      </li>
      <li
        class="mr-2 list-inline-item nav-item text-nowrap"
      >
        <app-link
          class="nav-link"
          :to="{ path: `/datasets/${getID}/quality`, query: Object.assign({}, { locale: $route.query.locale }) }"
        >
              <span :title="$t('message.tooltip.datasetDetails.quality')"
                    data-toggle="tooltip"
                    data-placement="top">
                    {{ $t('message.datasetDetails.subnav.quality') }}
              </span>
        </app-link>
      </li>
      <!--<li class="mr-2 list-inline-item nav-item text-nowrap"-->
      <!--<app-link class="nav-link" :to="{ path: `/datasets/${getID}/activityStream`, query: Object.assign({}, $route.query) }">-->
      <!--{{ $t('message.datasetDetails.subnav.activityStream') }}-->
      <!--</app-link>-->
      <!--</li>-->
    </ul>
  </nav>
</template>

<script>
import AppLink from "@/modules/widgets/AppLink";
import {mapGetters} from "vuex";
export default {
  name: "DatasetDetailsNavigationPages",
  components: {AppLink},
  computed: {
    ...mapGetters('datasetDetails', [
      'getID'
    ])
  }
}
</script>

<style scoped lang="scss">
.nav-link {
  text-decoration: underline;
}
</style>
