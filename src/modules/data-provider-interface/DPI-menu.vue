<template>
<div id="wrapper" data-cy="dpi-menu">
  <nav v-if="visible">
    <div>
      <h4 class="text-white">Data Provider Interface</h4>
    </div>

    <div style="margin-top:1%;">
      <dropup v-for="(group, index) in menuGroups"
        :key="`Group${index}`"
        :groupName="group.group"
        :groupItems="group.items"
        :show="$env.upload.buttons[group.group]"
        :isOperator="getUserData.roles.includes('operator')"
        :isCatalog="group.group === 'Catalogue' ? true : false">
      </dropup>
      <ul>
        <div class="btn-group dropup">
          <li v-for="(menuItem, index) in menuItems" :key="`Menu${index}`">
            <button type="button" class="btn btn-default">
              <!-- Menu items are either buttons or router-link -->
              <!-- depending if they have a 'to' or 'handler' property -->
              <component
                :is="menuItem.handler ? 'button' : 'router-link'"
                :class="{ 'disabled': menuItem.disabled }"
                :to="menuItem.to"
                @click.native="menuItem.handler ? menuItem.handler() : null"
              >
              {{menuItem.handler}}
                {{ menuItem.name }}
              </component>
            </button>
          </li>
        </div>
      </ul>
    </div>


    <div v-if="getUserData.userName">
      <small class="text-white">Logged in as {{ getUserData.userName }}</small><br>
        <button type="button" class="btn btn-default logout">
          <a href="#" @click="$keycloak && $keycloak.logoutFn('/')">Logout</a>
        </button>
    </div>
  </nav>

  <app-confirmation-dialog
    id="DPIMenuModal"
    :loading="modal.loading"
    :confirm="modal.confirm"
    @confirm="modal.confirmHandler"
  >
    {{ modal.message }}
  </app-confirmation-dialog>
</div>
</template>

<script>
import axios from 'axios';
import $ from 'jquery';
import { has, isEmpty } from 'lodash';
import { mapGetters, mapActions } from 'vuex';
import Dropup from './components/Dropup';

export default {
  name: 'DPI-menu',
  components: {
    Dropup
  },
  props: [],
  data() {
    return {
      visible: true,
      modal: {
        show: false,
        loading: false,
        error: null,
        message: '',
        confirm: '',
        confirmHandler: () => null,
      },
    };
  },
  computed: {
    ...mapGetters('datasetDetails', [
      'getCatalog',
      'getID',
      'getLoading',
      'getTitle',
      'getDescription',
    ]),
    ...mapGetters('auth', [
      'getUserData',
    ]),
    ...mapGetters('dpiStore', [
      'getNavSteps',
    ]),
    menuGroups() {
      return [
        {
          group: 'Dataset',
          items: [
            {
              key: 'create-dataset',
              name: 'Create Dataset',
              to: {
                name: 'DataProviderInterface-Input',
                query: { locale: this.$route.query.locale, edit: false }, // if edit is false -> reset is triggered
                params: { property: 'datasets', page: this.getNavSteps.datasets[0] },
              },
            },
            {
              name: 'Delete Dataset',
              disabled: !this.isLocatedOnAuthorizedDatasetPage,
              handler: () => {
                this.modal = {
                  ...this.modal,
                  ...{
                    message: 'Are you sure you want to delete this dataset? This can not be reverted.',
                    confirm: 'Delete dataset (irreversible)',
                    confirmHandler: () => this.handleDelete({ id: this.getID, property: 'datasets', catalog: this.getCatalog.id }),
                  },
                };
                $('#DPIMenuModal').modal({ show: true });
              },
            },
            {
              key: 'edit-dataset',
              name: 'Edit Dataset',
              onlyAuthorizedDatasetPage: true,
              disabled: !this.isLocatedOnAuthorizedDatasetPage,
              to: {
                name: 'DataProviderInterface-Edit',
                params: {
                  catalog: this.getCatalog.id || 'undefined',
                  property: 'datasets',
                  id: this.getID || 'undefined',
                },
                query: {
                  draft: false,
                  locale: this.$route.query.locale,
                },
              },
            },
            {
              key: 'draft-dataset',
              name: 'Set to draft',
              disabled: !this.isLocatedOnAuthorizedDatasetPage,
              handler: () => {
                this.modal = {
                  ...this.modal,
                  ...{
                    message: 'Are you sure you want to mark this dataset as draft?',
                    confirm: 'Set to draft',
                    confirmHandler: () => this.handleMarkAsDraft({
                      id: this.getID, catalog: this.getCatalog.id, title: this.getTitle, description: this.getDescription,
                    }),
                  },
                };
                $('#DPIMenuModal').modal({ show: true });
              },
            },
            {
              key: 'register-dataset',
              name: 'Register DOI',
              disabled: !this.isLocatedOnAuthorizedDatasetPage,
              handler: () => {
                this.modal = {
                  ...this.modal,
                  ...{
                    message: 'Are you sure you want to register a DOI? This can not be reverted.',
                    confirm: 'Register DOI (irreversible)',
                    confirmHandler: () => this.handleRegisterDoi({ id: this.getID, catalog: this.getCatalog.id, type: this.$env.doiRegistrationService.persistentIdentifierType || 'mock' }),
                  },
                };
                $('#DPIMenuModal').modal({ show: true });
              },
            },
          ],
        },
        {
          group: 'Catalogue',
          items: [
            {
              name: 'Create Catalogue',
              to: { 
                name: 'DataProviderInterface-Home',
                query: { locale: this.$route.query.locale, edit: false },
                params: { property: 'catalogues' } 
              },
            },
            {
              name: 'Delete Catalogue',
              disabled: !this.isLocatedOnAuthorizedCatalogPage,
              handler: () => {
                this.modal = {
                  ...this.modal,
                  ...{
                    message: 'Are you sure you want to delete this catalogue? This can not be reverted!',
                    confirm: 'Delete catlogue (irreversible)',
                    confirmHandler: () => this.handleDelete({ id: this.$route.query.catalog, property: 'catalogues', catalog: this.$route.query.catalog }),
                  },
                };
                $('#DPIMenuModal').modal({ show: true });
              }
            },
            {
              name: 'Edit Catalog',
              onlyAuthorizedDatasetPage: true,
              disabled: !this.isLocatedOnAuthorizedCatalogPage,
              to: {
                name: 'DataProviderInterface-Edit',
                params: {
                  catalog: this.$route.query.catalog ? this.$route.query.catalog : 'undefined',
                  property: 'catalogues',
                  id: this.getID || 'undefined',
                },
                query: {
                  draft: false,
                  locale: this.$route.query.locale,
                }
              }
            },
          ],
        },
      ];
    },
    menuItems() {
      return [
        {
          name: 'Draft Datasets',
          to: { name: 'DataProviderInterface-Draft', query: { locale: this.$route.query.locale } },
        },
        {
          name: 'My Catalogues',
          to: { name: 'DataProviderInterface-UserCatalogues', query: { locale: this.$route.query.locale } },
        },
        {
          name: 'User profile',
          to: { name: 'DataProviderInterface-UserProfile', query: { locale: this.$route.query.locale } },
        },
      ];
    },
    isLocatedOnAuthorizedDatasetPage() {
      // Never return true while loading
      if (this.getLoading) return false;

      // Is the user located on the correct page?
      const isOnDatasetDetailsPage = this.$route.name === 'DatasetDetailsDataset';
      if (!isOnDatasetDetailsPage) return false;
      const datasetId = isOnDatasetDetailsPage && this.$route.params.ds_id;

      // Does user have permission on dataset (based on current datasetDetails state)?
      const permissions = this.getUserData && this.getUserData.permissions;
      const catalogId = this.getCatalog && this.getCatalog.id;
      const hasPermission = permissions.find(permission => permission.rsname === catalogId);

      // Does the user have permission on the current dataset details page?
      return hasPermission
        && isOnDatasetDetailsPage
        && datasetId === this.getID;
    },
    isLocatedOnAuthorizedCatalogPage() {
      // never return true while loading
      if (this.getLoading) return false;

      // is the user located on the correct page?
      const onDatasetPage = this.$route.name === 'Datasets';
      const queryCatalogProperty = has(this.$route.query, 'catalog') && !isEmpty(this.$route.query.catalog);
      const catalogDetailsShown = has(this.$route.query, 'showcatalogdetails') && this.$route.query.showcatalogdetails === 'true';
      const isOnRightPage = onDatasetPage && queryCatalogProperty && catalogDetailsShown;
      if (!(isOnRightPage)) return false;

      const permissions = this.getUserData && this.getUserData.permissions;
      const catalogId = this.$route.query.catalog;
      const hasPermission = permissions.find(permission => permission.rsname === catalogId);
      
      // does user have permission on current catalogue
      return hasPermission && isOnRightPage;
    }
  },
  methods: {
    ...mapActions('auth', [
      'updateUserData',
    ]),
    ...mapActions('snackbar', [
      'showSnackbar',
    ]),
    setupKeycloakWatcher() {
      if (this.$keycloak && this.$keycloak.authenticated) {
        // Set up watcher here since we this.$keycloak might not be available.
        // If this.$keycloak is ensured, move this watcher out of this created hook.
        this.$watch('$keycloak.token', async (newToken) => {
          if (!newToken) return;

          let rtpToken = this.$keycloak.rtpToken;
          if (!rtpToken) {
            const rtpTokenFn = this.$keycloak.getRtpToken;
            if (rtpTokenFn) {
              const res = (await rtpTokenFn({ autoRefresh: true }));
              rtpToken = res;
            }
          }

          this.updateUserData({
            authToken: newToken,
            rtpToken: rtpToken,
            hubUrl: this.$env.api.hubUrl,
          });
        }, { immediate: true });

        this.$watch('$keycloak.rtpToken', (newRtpToken) => {
          if (!newRtpToken) return;

          this.updateUserData({
            authToken: this.$keycloak.token,
            rtpToken: newRtpToken,
            hubUrl: this.$env.api.hubUrl,
          });
        });
      }
    },
    async handleConfirm(action, argsObj, { successMessage, errorMessage }) {
      this.modal.loading = true;
      try {
        // Sleep for 250ms for better UX
        this.$Progress.start();
        await new Promise(resolve => setTimeout(resolve, 250));

        this.$Progress.set(25);
        await this.$store.dispatch(action, argsObj);

        // Successful DOI registration
        this.showSnackbar({
          message: successMessage,
          variant: 'success',
        });
        await new Promise(resolve => setTimeout(resolve, 250));

        this.$Progress.finish();
      } catch (ex) {
        this.$Progress.fail();
        // eslint-disable-next-line no-console
        console.error(ex);

        const maybeErrorStatusMsg = ex.response && ex.response.data && ex.response.data.message;

        let customErrorMessage = typeof errorMessage === 'string' && errorMessage;
        customErrorMessage = typeof errorMessage === 'function' && errorMessage(ex);
        customErrorMessage = typeof errorMessage === 'object' && errorMessage.prefix && `${errorMessage.prefix}${maybeErrorStatusMsg && ` — ${maybeErrorStatusMsg}`}`;

        const errorMsg = customErrorMessage || maybeErrorStatusMsg || ex.message || 'An error occurred';
        // show snackbar
        this.showSnackbar({
          message: errorMsg,
          variant: 'error',
        });
      } finally {
        this.modal.loading = false;
        $('#DPIMenuModal').modal('hide');
      }
    },
    async handleRegisterDoi({ id, catalog, type = 'eu-ra-doi' }) {
      await this.handleConfirm(
        'auth/createPersistentIdentifier',
        { id, catalog, type },
        {
          successMessage: this.$te('message.snackbar.doiRegistration.success') ? this.$t('message.snackbar.doiRegistration.success') : 'Successfully registered DOI',
          errorMessage: { prefix: this.$te('message.snackbar.doiRegistration.error') ? this.$t('message.snackbar.doiRegistration.error') : 'DOI registration failed' },
        },
      );
    },
    async handleMarkAsDraft({
      id, catalog, title, description,
    }) {
      await this.handleConfirm('auth/putDatasetToDraft', {
        id, catalog, title, description,
      }, {
        successMessage: this.$te('message.snackbar.markAsDraft.success') ? this.$t('message.snackbar.markAsDraft.success') : 'Dataset successfully marked as draft',
        errorMessage: { prefix: this.$te('message.snackbar.doiRegistration.error') ? this.$t('message.snackbar.doiRegistration.error') : 'Failed to mark dataset as draft' },
      });

      this.$router.push({ name: 'DataProviderInterface-Draft', query: { locale: this.$route.query.locale }}).catch(() => {});
    },
    async handleDelete({ id, property, catalog }) {
      // todo: create user dataset api (and maybe integrate to store)
      // For now, do request manually using axios
      this.modal.loading = true;
      this.$Progress.start();
      try {
        let endpoint;
        if (property === 'datasets') {
          endpoint = `${this.$env.api.hubUrl}datasets/${id}?useNormalizedId=true&catalogue=${catalog}`;
        } else if (property === 'catalogues') {
          endpoint = `${this.$env.api.hubUrl}catalogues/${id}`
        }

        await axios.delete(endpoint, {
          headers: {
            'Content-Type': 'text/turtle',
            Authorization: `Bearer ${this.getUserData.rtpToken}`,
          },
        });

        let successMessage;
        if (property === 'datasets') {
          successMessage = this.$te('message.snackbar.deleteDataset.success') ? this.$t('message.snackbar.deleteDataset.success') : 'Dataset successfully deleted';
        } else if (property === 'catalogues') {
          successMessage = this.$te('message.snackbar.deleteCatalog.success') ? this.$t('message.snackbar.deleteCatalog.success') : 'Catalog successfully deleted';
        }
        

        this.showSnackbar({
          message: successMessage,
          variant: 'success',
        });
        this.$Progress.finish();

        // Redirect to Home
        this.$router.push({ name: 'Datasets', query: { locale: this.$route.query.locale, refresh: true }}).catch(() => {});
      } catch (ex) {
        this.$Progress.fail();

        let errorMessage;

        if (property === 'datasets') {
          errorMessage = this.$te('message.snackbar.deleteDataset.error') ? this.$t('message.snackbar.deleteDataset.error') : 'Failed to delete dataset';
        } else if (property === 'catalogues') {
          errorMessage = this.$te('message.snackbar.deleteCatalog.error') ? this.$t('message.snackbar.deleteCatalog.error') : 'Failed to delete catalog';
        }

        this.showSnackbar({
          message: `${errorMessage}${ex.response?.data ? ` — ${ex.response?.data}` : ex.message}`,
          variant: 'error',
        });
      } finally {
        this.modal.loading = false;
        $('#DPIMenuModal').modal('hide');
      }
    },
  },
  created() {
    this.setupKeycloakWatcher();
  },
};
</script>

<style lang="scss" scoped>
#wrapper {
  background: #196fd2;
  width: 100%;
  position: sticky;
  bottom: 0;
  z-index: 999;
}

nav {
  max-width: 1400px;
  display: flex;
  flex-direction: row;
  margin: 0 auto;
  justify-content: space-between;
  font-size: 1rem;
  align-items: center;
}

ul {
  float: right;
  li {
    display: inline;
    a {
      color: white;
    }
  }
}

button a {
  color: white;
}

.logout {
  display: block;
  margin: 0 auto;
  border: 1px solid white;
  padding: 0.1rem 1.5rem;
}
</style>
