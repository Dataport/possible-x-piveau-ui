<template>
  <div class="repeatable formkitProperty" :class="[context.attrs.identifier]" v-for="key, repeatableIndex in items"
    :key="key">
    <h4>{{ context.label }}</h4>

    <div class="horizontal-wrapper">
      <details>{{ items }}</details>
      <div class="repeatableWrap">
        <div class="interactionHeaderRepeatable my-1">
          <i18n-t keypath="message.dataupload.info.repeatable" scope="global" tag="p">
            <template v-slot:add>
              <a class="add" @click="addItem">{{ $t('message.dataupload.info.add') }}</a>
            </template>
            <template v-slot:remove>
              <a class="remove" @click="removeItem(repeatableIndex)" :data-key="key">{{
                $t('message.dataupload.info.remove') }}</a>
            </template>
          </i18n-t>
        </div>

        <div class="formkitWrapRepeatable">
          <slot></slot>
              </div>
      </div>
    </div>
  </div>
</template>

<script>
import { token } from "@formkit/utils";

export default {
  props: {
    context: Object,
  },
  data() {
    return {
      items: [this.newId()], 
    }
  },
  methods: {
    newId() {
      console.log(this.context.value);
      return `${this.context.attrs.identifier}_${token()}`;
    },
    addItem() {
      this.items.push(this.newId());
    },
    removeItem(index) {
      this.items.splice(index, 1);
    }
  }
}
</script>

