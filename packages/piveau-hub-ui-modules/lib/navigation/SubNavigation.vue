<template>
  <nav class="col-12 navbar navbar-expand-lg navbar-light px-4 pb-3 mt-0 sub-navigation">
    <button class="navbar-toggler px-1" type="button" data-toggle="collapse" data-target="#subNavigation" aria-controls="subNavigation" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <h1 class="d-inline-block d-lg-none col-10 col-md-11 title mb-0 text-break">{{ title }}</h1>
    <div class="col-12 collapse navbar-collapse px-0" id="subNavigation">
      <slot/>
    </div>
  </nav>
</template>

<script>
import $ from 'jquery';

export default {
  props: {
    to: {
      default: '',
      required: false,
    },
    title: {
      type: String,
      default: '',
      required: false,
    },
  },
  computed: {
  },
  methods: {
  },
  beforeUnmount() {
    $('.tooltip').remove();
  },
};
</script>

