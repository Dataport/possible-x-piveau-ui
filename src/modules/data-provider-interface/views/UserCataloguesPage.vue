<template>
  <div class="d-flex flex-column bg-transparent container-fluid justify-content-between content">
    <h1 class="small-headline">My Catalogues</h1>
    <ul class="list-group col-md-6 m-auto">
      <li v-for="(catalog, index) in getUserCatalogs" :key="index" class="list-group-item">
        <app-link
          :to="{ name: 'CatalogueDetails', query: { locale: $route.query.locale }, params: { ctlg_id: catalog.rsname } }">{{
            catalog.label }}</app-link>
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
import axios from 'axios'

export default {
  components: {
    AppLink
  },
  name: 'MyCatalogues',
  props: [],
  data() {
    return {
      info: {},
      catalogues: []
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
    async init() {

      await axios
        .get('https://piveau-hub-search-data-europa-eu.apps.osc.fokus.fraunhofer.de/search?filter=catalogue&limit=100')
        .then(response => (this.info = response))
      this.info.data.result.results.forEach((e) => {

        this.catalogues.push({ title: Object.values(e.title)[0], id: e.id })

        // if(e.title.en != undefined) this.catalogues.push({title:e.title.en, id:e.id})
        // else {
        //   this.catalogues.push({title:Object.values(e.title)[0], id:e.id})
        // }

      });
      this.findcatalogues()
      // need to forceupdate to display the filtered catalogues
      this.$forceUpdate();
    },
    findcatalogues() {
      for (let i = 0; i < Object.keys(this.getUserCatalogs).length; i++) {
        for (let a = 0; a < Object.keys(this.catalogues).length; a++) {
          if (this.getUserCatalogs[i].rsname == this.catalogues[a].id) {
            this.getUserCatalogs[i].label = this.catalogues[a].title;
            break
          }
          else{
            this.getUserCatalogs[i].label = this.getUserCatalogs[i].rsname;
          } 
        }
      }
    }
  },
  created() {
    this.init()

  },
  mounted() {

  },

};
</script>
