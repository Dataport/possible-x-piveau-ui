<template>
  <div class="p-0 py-3 text-center text-sm-left alert alert-secondary alert-dismissible fade show"
       role="alert">
    <div class="row">
      <div class="col-1 m-auto text-center">
        <i class="material-icons">info</i>
      </div>
      <div class="col-10">
        <p class="mb-0">{{ text }}</p>
      </div>
      <div class="col-1">
        <button class="close pt-0"
                type="button"
                data-dismiss="alert"
                aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PvBanner",
  props: {
    text: String
  }
}
</script>

