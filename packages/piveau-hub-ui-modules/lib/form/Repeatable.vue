<template>
  <div>
    <div class="horizontal-wrapper"
         v-for="key in items"
         :key="key">
      <slot>
        <FormKit
            type="text"
            label="Email Address"
            help="edit me to get started"
        />
      </slot>
      <div class="formkit-remover-wrapper">
        <div class="formkit-remover ball"
             @click="removeItem"
              :data-key="key">
          <span>x</span>
        </div>
      </div>
    </div>
  </div>
  <hr>
  <div @click="addItem" class="ball formkit-adder"><span>+</span></div>
</template>

<script>
  import {token} from "@formkit/utils";

  export default {
    props: {
      name: String,
      children: Array,
      context: Object,
    },
    data() {
      return {
        values: [],
        items: [this.newId()]
      }
    },
    methods: {
      newId() {
        return `${this.name}_${token()}`;
      },
      addItem() {
        this.items.push(this.newId());
      },
      removeItem(e) {
        const key = e.target.getAttribute('data-key');
        const index = this.items.indexOf(key);
        if (index >= 0) {
          this.items.splice(index, 1);
        }
      }
    }
  }
</script>



<style lang="scss">
  .horizontal-wrapper {
    display: flex;
    flex-direction: row;
  }

  .formkit-remover-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1rem;
  }

  .ball {
    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
    height: 2.5rem;
    width: 2.5rem;
    font-size: 1.6em;
    font-weight: bold;
    cursor: pointer;
    border-radius: 50%;
  }

  .formkit-remover {
    background-color: #ccc;
    color: white;
    height: 2rem;
    width: 2rem;
    span {
      pointer-events: none;
      position: relative;
      bottom: 0.1rem;
    }
  }

  .formkit-adder {
    background-color: darkseagreen;
    color: white;
    font-size: 2em;
    margin: 1rem;
    line-height: 100%;
    span {
      position: relative;
      bottom: 0.13rem;
    }
  }

  button {
    align-self: flex-start;
  }
</style>
