<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <div>
      <pv-data-info-box :to="'/'"></pv-data-info-box>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

import { PvDataInfoBox } from 'piveau-hub-ui-modules'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    PvDataInfoBox,
  }
}
</script>
