<template>
  <div class="position-relative d-inline-block ml-1 text-nowrap mb-1">
      <button @click="open=true" class="dsd-action-button d-flex justify-content-between btn btn-sm btn-primary p-0 pl-2 w-100 rounded-lg btn-color dropdown-button"
              type="button"
              aria-haspopup="true"
              aria-expanded="false">
        <span data-toggle="tooltip"
          :title="title"
          data-placement="top">
          {{ message }}
        </span>
        <i class="d-inline text-nowrap material-icons small-icon float-right align-bottom">keyboard_arrow_down</i>
      </button>
    <div v-if="open" v-on-clickaway="away" class="dropdownMenu" :class="{ bglight: bgLight }">
     <slot></slot>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { mixin as clickaway } from 'vue-clickaway';

export default {
  mixins: [clickaway],
  name: 'Dropdown',
  props: ['title', 'message', 'bgLight'],
  methods: {
    away() {
      this.open = false;
    },
  },
  data() {
    return {
      open: false,
    };
  },
};
</script>

<style lang="scss" scoped>
  .material-icons.small-icon {
    font-size: 20px;
  }
  .dropdownMenu {
    z-index: 1000;
    max-width: 13rem;
    padding: 0.5rem 0;
    margin: 0.125rem 0;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: 0.25rem;
    transform-origin: top right;
    position: absolute;
    right: 0;
  }
  button:hover {
    background-color: #196fd2;
    border-color: #196fd2;
  }
  .bglight {
    background:#f8f9fa;
  }
</style>
