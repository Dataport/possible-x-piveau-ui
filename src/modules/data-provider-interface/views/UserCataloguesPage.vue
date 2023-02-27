<template>
    <div class="d-flex flex-column bg-transparent container-fluid justify-content-between content">
    <h1 class="small-headline">My Catalogues</h1>
    <ul class="list-group col-md-6 m-auto">
      <li v-for="(catalog, index) in getUserCatalogs" :key="index" class="list-group-item">
        <app-link :to="{ name: 'CatalogueDetails', query: { showcatalogdetails: true, locale: $route.query.locale }, params: { ctlg_id: catalog.rsname}}">{{ catalog.rsname }}</app-link>
        <span class="float-right">
          <!-- Temporarily disabled -->
          <!-- <button type="button" class="btn btn-secondary" @click="handleEdit(catalog.rsname)">Edit</button> -->
          <!-- <button type="button" class="btn btn-danger">Delete</button> -->
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppLink from "@/modules/widgets/AppLink";

export default {
  components: {
    AppLink
  },
  name: 'MyCatalogues',
  props: [],
  data() {
    return {
    };
  },
  computed: {
    ...mapGetters('auth', [
      'getUserCatalogs',
    ]),
  },
  methods: {
    // handleEdit(catalog) {
    //   this.$router.push({ name: 'DataProviderInterface-Edit', params: { catalog, property: 'catalogues' }, query: { locale: this.$route.query.locale }}).catch(() => {});
    // },
  },
  created() {},
};
</script>
