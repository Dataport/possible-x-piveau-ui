<template>
  <Datasets>
    <template #title>
      <span>
        <!-- Intentionally empty -->
      </span>
    </template>
    <template #content="{ loading, locale, datasets, datasetsCount }">
      <div class="row">
        <div class="col-12 col-lg-3" aria-hidden="true">
          <!-- Intentionally empty -->
        </div>
        <section class="col-12 col-lg-9">
          <h1 class="row col-12 page-title text-primary">{{ $t('message.header.navigation.data.datasets') }}</h1>
          <DatasetsFilters />
          <div class="datasets-found alert alert-primary mt-3 d-flex flex-row" role="status"
            :class="{ 'alert-danger': datasetsCount <= 0 && !loading }">
            <div>
              {{ loading ? $t('message.datasets.loadingMessage') : `${datasetsCount.toLocaleString('fi')}
                            ${$t('message.datasets.countMessage')}` }}
            </div>
            <div class="loading-spinner ml-3" v-if="loading"></div>
          </div>
        </section>
      </div>
      <div class="row">
        <section class="col-12 col-lg-3">
          <DatasetsFacets class="mt-3" />
        </section>
        <section class="col-12 col-lg-9">
          <DatasetList v-if="!loading" :datasets="datasets" :locale="locale || 'en'" />
        </section>
      </div>
    </template>
  </Datasets>
</template>

<script>
import { defineComponent } from 'vue';
import { Datasets, DatasetsFacets, DatasetList, DatasetsFilters } from '@piveau/piveau-hub-ui-modules'

export default defineComponent({
  inheritAttrs: false,
  components: {
    Datasets,
    DatasetsFacets,
    DatasetList,
    DatasetsFilters,
  }
})
</script>