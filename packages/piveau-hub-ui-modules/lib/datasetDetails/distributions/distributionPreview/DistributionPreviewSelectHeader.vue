<template>
    <div class="mr-md-2 mt-0 ">
            <!-- Header -->
            <div class="dpsh-header mb-2 d-flex align-items-center w-100 justify-content-between">
                <span class="font-weight-bold ml-1"> {{ title }}</span>
                <i v-if="tooltipText"
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
              <div class="btn-group dpsh-dropdown" role="group">
                <button
                  class="
                    dpsh-button
                    list-group-item
                    col
                    w-100
                    d-flex
                    flex-row
                    justify-content-md-between
                    p-0
                    align-items-center
                    overflow-hidden
                    text-truncate
                  "
                  type="button"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                    <div class="pl-2 h-100 d-flex align-items-center">
                        {{ displayedLabel }}
                    </div>
                    <div class="dpsh-select__icon">
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
                  class="dropdown-menu dpsh-dropdown-items btnGroupDrop"
                  aria-labelledby="btnGroupDrop"
                >
                <div v-if="multiSelect">
                  <button
                    v-for="(label, index) in labels" :key="index"
                    class="dropdown-item pl-3"
                    :class="{ 'picked': checkedItems[label] }">
                    <label :for="'input-' + index"> 
                      <input
                      v-if="multiSelect"
                      :id="'input-' + index" type="checkbox"
                      class="mr-1"
                      :checked="checkedItems[label]"
                      @click="emitChoice(label)"
                      aria-label="Checkbox"
                     >
                      {{ label }}
                    </label>
                  </button>
                </div>
                <div v-else>
                  <button
                    v-for="(label, index) in labels" :key="index"
                    class="dropdown-item pl-3"
                    @click="emitChoice(label)"
                  >
                    {{ label }}
                  </button>
                </div>
                </ul>
              </div>
            </div>
            <!-- <button v-if="multiSelect" class="btn dpsh-add-btn" type="button" role="group" data-toggle="dropdown" data-target="">+ add multiple values</button> -->

          </div>
  </template>
  
  <script>
  
  export default {
    name: "DistributionPreviewSelectHeader",
    props: {
        title: {
          type: String,
        },
        tooltipText: {
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
          // in case of multiSelect, this is the label that should be selected (checked) by default
          type: String,
        },
        updatePicked: Function,

    },
    data() {
      return {
        checkedItems: {},
        displayedLabel: ''
      };
    },
    methods: {
        emitChoice(label){
          this.displayedLabel = label;
          this.checkedItems[label] = !this.checkedItems[label];
          this.$emit('updatePicked', label);
        },
    },
    created() {
      if(this.multiSelect) {
        this.labels.forEach(label => {
          label === this.defaultLabel ? this.$set(this.checkedItems, label, true) : this.$set(this.checkedItems, label, false);
        })
      }
      this.displayedLabel = this.defaultLabel ? this.defaultLabel : this.labels[0]
    },
  }
  </script>
  
  <style lang="scss" scoped>
    .dpsh-button {
      // white-space: nowrap;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // flex-wrap: nowrap;
      // width: 150px;
    }

    .dpsh-header {
        max-width: 200px;
    }

    .tooltip-icon{
        cursor: default;
        font-size: 15px;
    }
    
    .dpsh-dropdown {
        width: 200px;
        height: 48px;
        > button {
            border: 1px dashed var(--primary-light);
            border-radius: 4px;
        }
        .dropdown-menu {
            margin: 0;
        }
    }

    .dpsh-select__icon {
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

    .dpsh-dropdown-items {
        border-radius: 4px !important;
        border: dashed 1px var(--primary-light) !important;
        width: 198px;
        padding: 0;
        overflow: auto;

        & .dropdown-item.picked {
          background-color: var(--primary-light);
          color: white;
        }
    }
    // .dpsh-dropdown-items div button label input {
      // accent-color: transparent;
    // }

    .dpsh-add-btn {
        height: 48px;
        align-self: end;
        background-color: var(--primary-light);
        color: white;

        &:hover {
            color: white;
        }
    }
  </style>
  