<template>
    <div class="mr-md-2 mt-0 ">
            <!-- Header -->
            <div class="dv-header mb-2 d-flex align-items-center w-100 justify-content-between">
                <span class="font-weight-bold ml-1"> {{ title }}</span>
                <i
                    class="tooltip-icon material-icons align-right text-dark pl-1"
                    data-toggle="tooltip"
                    data-placement="right">
                    help_outline
                </i>
            </div>

            <!-- Dropdown -->
            <div
              class="col-right mr-md-2 d-inline"
              role="group"
              aria-label="Dropdown"
            >
              <div class="btn-group dv-dropdown" role="group">
                <button
                  class="
                    list-group-item
                    col
                    w-100
                    d-flex
                    flex-row
                    justify-content-md-between
                    p-0
                    align-items-center
                    overflow-hidden
                  "
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                    <div class="pl-2 h-100 d-flex align-items-center">
                        <slot></slot>
                    </div>
                    <div class="dv-select__icon">
                        <i
                        class="material-icons"
                        focusable="false"
                        aria-hidden="true"
                        >
                        arrow_drop_down
                        </i>
                    </div>
                </button>
                <ul
                  class="dropdown-menu dv-dropdown-items"
                  aria-labelledby="btnGroupDrop1"
                >
                  <button
                    v-for="(label, index) in labels" :key="index"
                    class="dropdown-item pl-3"
                    @click="emitChoice(label)"

                  >
                  <label :for="'input-' + index"> 
                    <input
                    v-if="multiSelect"
                    :id="'input-' + index" type="checkbox"
                    class="mr-1"
                    :checked="checkedItems[label]"
                    @click.stop
                    aria-label="Checkbox">
                    {{ label }}
                  </label>
                  </button>
                </ul>
              </div>
            </div>
          </div>
  </template>
  
  <script>
  
  export default {
    name: "DistributionPreviewSelectHeader",
    props: {
        title: {
            type: String,
        },
        multiSelect: {
          type: Boolean,
          // default: false,
        },
        labels: {
            type: Array,
        },
        defaultLabel: {
          type: String,
        },
        updatePicked: Function,

    },
    data() {
      return {
        checkedItems: {},
      };
    },
    methods: {
        emitChoice(label){
          this.$emit('updatePicked', label);
        },
    },
    created() {
      this.labels.forEach(label => {
        label === this.defaultLabel ? this.$set(this.checkedItems, label, true) : this.$set(this.checkedItems, label, false);
      })
    },
  }
  </script>
  
  <style lang="scss" scoped>
    
    .dv-header {
        max-width: 200px;
    }

    .tooltip-icon{
        cursor: default;
        font-size: 15px;
    }
    
    .dv-dropdown {
        width: 200px;
        height: 48px;
        > button {
            border: 1px dashed var(--primary);
            border-radius: 4px;
        }
        .dropdown-menu {
            margin: 0;
        }
    }

    .dv-select__icon {
        align-items: center;
        display: flex;
        height: 100%;
        justify-content: center;
        position: absolute;
        right: 0;
        top: 0;
        width: 2.75rem;
        z-index: 0;
    }

    .dv-dropdown-items {
        border-radius: 4px !important;
        border: dashed 1px var(--primary) !important;
        width: 198px;
        padding: 0;
        overflow: auto
    }
  </style>
  