<template>
  <div id="piveau-footer" :style="{ background: headerFooterBackground }">
    <footer-bottom v-bind="$attrs" v-on="$listeners"><slot /></footer-bottom>
  </div>
</template>

<script>
import FooterBottom from './FooterBottom.vue';

export default {
  name: 'PiveauFooter',
  components: {
    footerBottom: FooterBottom,
  },
  inheritAttrs: false,
  props: {
    headerFooterBackground: {
      default: '#6610f2',
    },
  },
};
</script>

<style lang="scss">
  @import '../styles/footer.scss';

  #piveau-footer {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    text-align: left;
  }
</style>
