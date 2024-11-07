<template>
  <div class="page">
    <section class="main_section">
      {{ resourceDetailsData }}
    </section>
  </div>
</template>
  
<script setup>
const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
});
console.log("*** Inside LegalParticipants.vue");
console.log("Props: ", props);
</script>
  
<style lang="scss" scoped>
.resource_banner {
  background-color: #1E2E4D;
  color: #fff;
  padding: .4rem .6rem;
  border-radius: .3rem;
  font-size: 1.1rem;
  font-weight: 600
}

.page {
  width: 100%;
}

.main_section {
  display: flex;
  gap: 1rem;

  .left {
    width: 60%;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .right {
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    hr {
      background-color: #fff;
    }
  }
}
</style>