declare module '*.vue' {
  import Vue from 'vue'

  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    $t: any;
    // $store: any;
    // $auth: any;
    // $axios: any;
    // veeFields: any;
    // $dialog: any;
    // $snackbar: any;
    // $toast: any;
  }
}

