<template>
  <div>
    <div class="mt-3">
      <div class="row">
        <div class="col-10 offset-1">
          <h2>{{ $t('message.datasetDetails.subnav.activityStream') }}</h2>
        </div>
        <div class="col-10 offset-1">
          <div class="activity-stream mt-4">
            <div class="p-2 mt-3">
              <span class="text-left">Dataset updated</span>
              <span class="float-right text-muted small">2 days ago</span>
            </div>
            <div class="p-2 mt-3">
            <span class="text-left">Dataset updated</span>
            <span class="float-right text-muted small">5 days ago</span>
          </div>
            <div class="p-2 mt-3">
              <span class="text-left">Dataset created</span>
              <span class="float-right text-muted small">5 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'datasetDetailsActivityStream',
    components: {
    },
    data() {
      return {
      };
    },
    computed: {
      ...mapGetters('datasetDetails', [
      ]),
    },
    methods: {
      ...mapActions('datasetDetails', [
        'loadDatasetDetails',
      ]),
    },
    created() {
      this.$nextTick(() => {
        this.$Progress.start();
        this.loadDatasetDetails(this.$route.params.ds_id)
          .then(() => {
            this.$Progress.finish();
          })
          .catch(() => {
            this.$Progress.fail();
          });
      });
    },
  };
</script>
