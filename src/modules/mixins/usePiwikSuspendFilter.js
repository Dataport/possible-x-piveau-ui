// Mixin to install a suspend filter on the piwik tracker
// to re-order events
// https://gitlab.fokus.fraunhofer.de/piveau/organisation/piveau-scrum-board/-/issues/2098

import Vue from 'vue';

let once = false;

export default Vue.extend({
  created () {
    if (once) {
      return;
    }
    once = true;

    if (this.$route.name === 'DatasetDetailsDataset') {
      this.$piwik.suspendFilter(([data]) => {
      const isOneOfInitialEvent = ['stg.start', 'stg.domReady'].includes(data.event);
      const isDatasetMetadataEvent = data.event_type === 'send_dataset_metadata';
      return isOneOfInitialEvent || isDatasetMetadataEvent;
      });
    }
  }
});

