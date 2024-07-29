<template>
  <!-- TODO Add a Mobile Version of that overview (pref with Icons)-->
  <div class="d-flex flex-column bg-transparent container-fluid justify-content-between content draftsWrapper">
    <h1 class="small-headline text-center">Draft datasets</h1>
    <div class="d-flex align-items-center justify-content-center">
      <table class="table w-75">
        <thead>
          <tr>
            <th scope="col">Dataset ID</th>
            <th scope="col">Catalogue ID</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ id, catalog } in getUserDrafts" :key="`draft@${id}`" :data-cy="`draft@${id}`">
            <td>{{ id }}</td>
            <td>{{ catalog }}</td>
            <td class="buttonWrapper">
              <button type="button" class="btn btn-secondary">
                <app-link class="dropdown-toggle text-nowrap text-decoration-none" fragment="#" role="button"
                  id="linkedDataDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <span :title="$t('message.metadata.linkedData')" data-toggle="tooltip" data-placement="top">
                    {{ $t('message.metadata.linkedData') }}
                  </span>
                </app-link>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="linkedDataDropdown">
                  <app-link :to="createLinkedMetricsURL(id, catalog, 'rdf')" target="_blank" class="dropdown-item">
                    <div class="px-2 py-1">RDF/XML</div>
                  </app-link>
                  <app-link :to="createLinkedMetricsURL(id, catalog, 'ttl')" target="_blank" class="dropdown-item">
                    <div class="px-2 py-1">Turtle</div>
                  </app-link>
                  <app-link :to="createLinkedMetricsURL(id, catalog, 'n3')" target="_blank" class="dropdown-item">
                    <div class="px-2 py-1">Notation3</div>
                  </app-link>
                  <app-link :to="createLinkedMetricsURL(id, catalog, 'nt')" target="_blank" class="dropdown-item">
                    <div class="px-2 py-1">N-Triples</div>
                  </app-link>
                  <app-link :to="createLinkedMetricsURL(id, catalog, 'jsonld')" target="_blank" class="dropdown-item">
                    <div class="px-2 py-1">JSON-LD</div>
                  </app-link>

                </div>
              </button>
              <button type="button" class="btn btn-secondary" @click="handleEdit(id, catalog)">Edit</button>
              <button type="button" class="btn btn-primary" @click="handleConfirmPublish(id, catalog)">Publish</button>
              <button type="button" class="btn btn-primary" @click="handleConfirmDuplication(id, catalog)">Duplicate
                this
                dataset</button>
              <button type="button" class="btn btn-danger" @click="handleConfirmDelete(id, catalog)">Delete</button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <app-confirmation-dialog id="modal" confirm="Confirm" :loading="modalProps.loading" @confirm="modalProps.confirm">
      {{ modalProps.message }}
      <input v-if="isDuplication" placeholder="Set new ID" type="text" class="m-3 formkit-input d-inline newIdField"
        v-model="duplicatedID" required>
      <p v-if="isDuplication">Only lowercase characters and "-" are allowed</p>
    </app-confirmation-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import $ from 'jquery';
import AppLink from "../../widgets/AppLink.vue";


export default {
  props: [],
  components: {
    AppLink
  },
  data() {
    return {
      values: {},
      isDuplication: false,
      duplicatedID: '',
      modalProps: {
        loading: false,
        message: 'Are you sure you want to delete this draft?',
        confirm: () => null,
      },
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getUserDrafts',
    ]),
  },
  methods: {
    ...mapActions('auth', [
      'setIsDraft',
      'updateUserDrafts',
    ]),
    ...mapActions('snackbar', [
      'showSnackbar',
    ]),
    createLinkedMetricsURL(id, catalog, format) {
      return {
        path: `/dpi/draft/${id}.${format}`,
        query: {
          useNormalizedId: true,
          locale: this.$route.query.locale,
          catalogue: catalog,
        },
      };
    },
    handleEdit(id, catalog) {
      this.setIsDraft(true);
      this.$router.push({ name: 'DataProviderInterface-Edit', params: { catalog, property: 'datasets', id }, query: { locale: this.$route.query.locale } }).catch(() => { });
    },
    async handleDelete(id, catalog) {
      await this.doRequest('auth/deleteUserDraftById', { id, catalog });
      $('#modal').modal('hide');
      this.showSnackbar({
        message: 'Draft successfully deleted',
        variant: 'success',
      });
    },
    async handleDuplication(id, catalog) {

      $('#modal').modal('hide');
      let newId = this.duplicatedID;
      let url = this.$env.api.baseUrl
      this.isDuplication = false;

      console.log(url);
      await this.doRequest('auth/duplicateDataset', { id, newId, catalog, url });
    },
    async handlePublish(id, catalog) {
      await this.doRequest('auth/publishUserDraftById', { id, catalog });
      $('#modal').modal('hide');
      this.showSnackbar({
        message: 'Draft successfully published',
        variant: 'success',
      });
      this.$router.push({ name: 'DatasetDetailsDataset', params: { ds_id: id }, query: { locale: this.$route.query.locale } }).catch(() => { });
      setTimeout(() => {
        this.$router.go();
      });
    },
    handleConfirmPublish(id, catalog) {
      this.isDuplication = false;
      this.modalProps.message = 'Are you sure you want to publish this draft?';
      this.modalProps.confirm = () => this.handlePublish(id, catalog);
      $('#modal').modal('show');
    },
    handleConfirmDelete(id, catalog) {
      this.isDuplication = false;
      this.modalProps.message = 'Are you sure you want to delete this draft?';
      this.modalProps.confirm = () => this.handleDelete(id, catalog);
      $('#modal').modal('show');
    },
    handleConfirmDuplication(id, catalog) {
      this.isDuplication = true;
      this.modalProps.message = 'If you want to duplicate this draft, please define a new ID for it:';
      this.modalProps.confirm = () => this.handleDuplication(id, catalog);
      $('#modal').modal('show');
    },
    async doRequest(action, { id, newId, catalog, url }) {
      this.$Progress.start();
      this.modalProps.loading = true;
      try {
        await this.$store.dispatch(action, { id, newId, catalog, url });
        this.$Progress.finish();
      } catch (ex) {
        // Show snackbar
        this.showSnackbar({
          message: ex.message,
          color: 'error',
        });
        this.$Progress.fail();
      } finally {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.modalProps.loading = false;
      }
    },
  },
  created() {
    this.updateUserDrafts();
  },
};
</script>

<style lang="scss" scoped>
@media (min-width: 1140px) {
  .draftsWrapper {
    min-width: 75vw;
  }
}

.nav-link {
  text-decoration: underline;
}

.active {
  text-decoration: none;
  font-weight: 700;
}

.dropdown-item {
  &:active {
    background-color: #868e96;
  }
}

#linkedDataDropdown {
  color: #FFFFFF;
}

.buttonWrapper button {
  margin: 0.2rem;
}

.newIdField {
  margin: 1rem 0 !important;

  box-shadow: none;
  border-radius: 0;
  border-bottom: 1px solid #001D85;
  transition: all 100ms ease-in-out;
}
</style>
