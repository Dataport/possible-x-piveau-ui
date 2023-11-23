<template>
  <FormKit type="list">
    <FormKit
      v-for="key in items"
      :key="key"
      :id="key"
      type="text"
      :label="label"
      :help="help"
      :sections-schema="{
        suffix: {
          $el: 'a',
          attrs: {
            class: '$classes.remove',
            'data-key': '$id',
            href: '#',
            onClick: removeItem
          },
          children: 'Remove'
        }
      }"
    />
    <hr>
  </FormKit>
  <button type="button" @click="addItem">+ Add {{ label }}</button>
</template>
  
<script>
export default {
  props: {
    label: {
      required: true,
      type: String,
    },
    help: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      items: [],
      itemCount: 0,
    };
  },
  methods: {
    addItem() {
      this.items.push(this.itemCount);
      this.itemCount += 1
    },
    removeItem(e) {
      const key = e.target.getAttribute('data-key');
      console.log(key)
      console.log(this.items)
      this.items = this.items.filter(item => item !== key);
      console.log(this.items)
    }
  },
  mounted() {
    this.addItem();
  }
};
</script>