<template>
  <div class="pagination-container d-flex flex-row justify-content-between flex-wrap">
    <!-- PAGINATION -->
    <ul v-if="usePagination" class="d-flex pagination align-self-center mb-0">
      <li class="page-item page-item-previous" :class="{ 'disabled': !clickedPageValid(getPage - 1) }" @click="pageClickedHandler(getPage - 1)">
        <i class="page-link material-icons" v-if="usePaginationArrows">keyboard_arrow_left</i>
        <button class="page-link prev-button">{{ $t('message.pagination.previousPage') }}</button>
      </li>
      <li class="page-item"
          v-for="(page, i) in getPagesDisplayed(getPage, getPageCount)"
          :key="i"
          :class="{ 'active': page === getPage}"
          @click="pageClickedHandler(page)">
        <button class="page-link page-button">{{ page.toLocaleString('fi') }}</button>
      </li>
      <li class="page-item page-item-next" :class="{ 'disabled': !clickedPageValid(getPage + 1) }" @click="pageClickedHandler(getPage + 1)">
        <button class="page-link next-button">{{ $t('message.pagination.nextPage') }}</button>
        <i class="page-link material-icons" v-if="usePaginationArrows">keyboard_arrow_right</i>
      </li>
    </ul>
    <!-- ITEMS PER PAGE -->
      <div v-if="useItemsPerPage" class="d-flex flex-row flex-wrap align-items-center items-per-page">
        <div class="d-inline align-middle mr-2">{{ $t('message.pagination.itemsPerPage') }}</div>
        <div class="col-right mr-2 d-inline" role="group" :aria-label="$t('message.pagination.itemsPerPage')" >
          <div class="btn-group items-per-page-dropdown" role="group">
            <button
              class="value-display list-group-item col d-flex flex-row justify-content-between p-0 align-items-center h-100"
              id="itemsPerPageDropdown" type="button" data-toggle="dropdown" aria-expanded="false">
              <div class="pl-2 d-flex align-items-center">
                {{ itemsPerPage }}
              </div>
              <div class="items-per-page-icon ecl-select__icon text-white">
                <i class="material-icons">keyboard_arrow_down</i>
              </div>
            </button>
            <ul class="dropdown-menu ec-ds-dropdown-items" aria-labelledby="itemsPerPageDropdown">
              <button
                class="dropdown-item"
                @click="setPageLimit(item)"
                v-for="(item, index) in defaultItemsPerPageOptions"
                :key="index">{{ item }}</button>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'pagination',
  components: {},
  props: {
    itemsPerPage: {
      type: Number,
      default: () => 0,
    },
    getPage: {
      type: Number,
      default: () => 1,
    },
    getPageCount: {
      type: Number,
      default: () => 1,
    },
  },
  data() {
    return {
      pagesDisplayed: [],
      usePagination: this.$env.routing.pagination.usePagination,
      usePaginationArrows: this.$env.routing.pagination.usePaginationArrows,
      useItemsPerPage: this.$env.routing.pagination.useItemsPerPage,
      defaultItemsPerPageOptions: this.$env.routing.pagination.defaultItemsPerPageOptions,
    };
  },
  computed: {},
  methods: {
    /**
     * @description Determines displayed pagenumbers and delimiters in the pagination.
     * @param currentPage {number} The currently active page.
     * @param lastPage {number} The number of the last page (also the pageCount).
     * @returns {array}
     */
    getPagesDisplayed(currentPage, lastPage) {
      const current = currentPage;
      const last = lastPage;
      const delta = currentPage < 1000 ? 2 : 1;
      const left = current - delta;
      const right = current + delta + 1;
      const range = [];
      const rangeWithDots = [];
      let l;

      for (let i = 1; i <= last; i += 1) {
        if (i === 1 || i === last || (i >= left && i < right)) {
          range.push(i);
        }
      }

      for (const i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
      return rangeWithDots;
    },
    pageClickedHandler(page) {
      if (this.clickedPageValid(page)) this.setPage(page, this.itemsPerPage);
    },
    clickedPageValid(page) {
      return typeof page === 'number' && page > 0 && page <= this.getPageCount;
    },
    changePageTo(page, limit) {
      this.$router.replace({ query: Object.assign({}, this.$route.query, { page, limit }) }).catch(error => { console.error(error); });
      this.scrollTo(0, 0);
    },
    setPage(page, itemsPerPage) {
      this.$emit('setPage', page);
      this.changePageTo(page, itemsPerPage);
    },
    setPageLimit(limit) {
      this.$emit('setPageLimit', limit);
      this.changePageTo(1, limit);
    },
    scrollTo(x, y) {
      window.scrollTo(x, y);
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
.page-item {
  display: flex;

  &.disabled {
    color: rgba(0,0,0,0.7);
  }

  .page-link {
    line-height: normal;
  }
}

.items-per-page {
  display: inline;
  margin-left: auto;

  .items-per-page-dropdown {
    width: 100px;
    height: 48px;
  }

  .items-per-page-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 2.75rem;
    background-color: var(--primary);
    .material-icons {
      font-size: 30px;
    }
  }
}
</style>
