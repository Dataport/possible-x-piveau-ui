<template>
    <div></div>
</template>
  
<script>
  export default {
    name: 'Auth',
    methods: {
        login() {
            this.$keycloak.loginFn({ redirectUri: this.loginRedirect });
        },
        logout() {
            this.$keycloak.logoutFn({ redirectUri: this.logoutRedirect });
        },
    },
    computed: {
        loginRedirect() {
            return this.$env.keycloak.loginRedirectUri
                ? `${window.location.origin}${this.$env.keycloak.loginRedirectUri}${window.location.search}`
                : `${window.location.href}`
        },
        logoutRedirect() {
            return this.$env.keycloak.logoutRedirectUri
                ? `${window.location.origin}${this.$env.keycloak.logoutRedirectUri}${window.location.search}`
                : `${window.location.href}`
        },
    },
    created() {
        if (this.$route.name === 'Login' && !this.$keycloak.authenticated) this.login();
        if (this.$route.name === 'Logout') this.logout();
    },
  };
</script>
  