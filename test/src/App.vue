<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <div>
    <pv-data-info-box msg="fsdfd" title="fsdfds" description="fsdfds"></pv-data-info-box>
  </div>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { PvDataInfoBox } from '@piveau/piveau-hub-ui-modules'

export default {
  name: 'App',
  components: {
    HelloWorld,
    PvDataInfoBox,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
