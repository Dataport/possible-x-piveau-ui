<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  context: Object
})

const counter = ref([])

//Need to handle the data like this. The values seem to take their time while loading into the DOM.
setTimeout(() => {
  if (props.context.value.length === 0) {
    counter.value.push('init')
  }
  else {
    for (let index = 0; index < props.context.value.length; index++) {
      if (props.context.value[index] != null) {
        counter.value.push(props.context.value[index]['@value'])
      }
    }
  }
});

// Pushing a blank to the context object and refreshing the counter
const addItem = () => {
  counter.value.push('new_index')
}
// remove Item - ToDo need to make sure the localhost notices the splice
const removeItem = (index) => {
  counter.value.splice(index, 1)
}
</script>

<template>
  <div class="repeatable formkitProperty" :class="[props.context.attrs.identifier]"
    v-for="key, repeatableIndex in counter" :key="key">
    <h4>{{ props.context.label }}</h4>
    <div class="horizontal-wrapper">
      <div class="repeatableWrap">
        <div class="interactionHeaderRepeatable my-1">
          <i18n-t keypath="message.dataupload.info.repeatable" scope="global" tag="p">
            <template v-slot:add>
              <a class="add" @click="addItem">+ {{ $t('message.dataupload.info.add') }}</a>
            </template>
            <template v-slot:remove>
              <a class="remove" @click="removeItem(repeatableIndex)" :data-key="key">- {{
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
<style scoped>
.add,
.remove {
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 5px;
  transition: all 200ms ease-in-out;
}

.add {
  border: 1px solid lightseagreen;
  &:hover {
    text-decoration: none;
    color: white;
    background-color: lightseagreen;
  }
}

.remove {
  border: 1px solid lightcoral;

  &:hover {
    text-decoration: none;
    color: white;
    background-color: lightcoral;
  }
}
</style>
