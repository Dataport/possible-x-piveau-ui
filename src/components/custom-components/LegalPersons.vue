<template>
  <div>
    <div>
      {{ resourceDetailsData }}
    </div>
  </div>
</template>
  
<script setup>
const props = defineProps({
  selectedResource: String,
  resourceDetailsData: Object,
});
</script>
  
<style scss scoped>
.resource_banner {
  /* background-color: #314D84; */
  background-color: #1E2E4D;
  color: #fff;
  padding: .4rem .6rem;
  border-radius: .3rem;
  font-size: 1.1rem;
  font-weight: 600
}

.sub_nav {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  a{
    color: #99772C;
    text-decoration: underline;
  }

}

.main_section {
  display: flex;
  gap: 1rem;

  .left {
    width: 65%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .right {
    width: 35%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    hr {
      background-color: #fff;
    }
  }
}

.tag_container {
  display: flex !important;
  flex-wrap: wrap;
  gap: .5rem;

  .tag {
    background-color: #314D84;
    color: #fff;
    padding: .4rem .6rem;
    border-radius: .3rem
  }
}

.label {
  font-weight: 700;
}

.info-box {
  background-color: #1E2E4D;
  color: #fff;
  padding: .0rem 0rem;
  border-radius: .6rem;

  .info {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    div{
     
    }
  }

  a {
    color: #fff;
    text-decoration: underline;
    word-wrap: normal;
  }
}

.endpoint {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.left,
.right {
  h5 {
    border: 1px solid #fff;
    border-top-left-radius: .6rem;
    border-top-right-radius: .6rem;

  }

  .info {
    padding: 1rem
  }
}

.right {
  hr {
    display: none;
  }

  h5 {
    padding: 1rem;
  }
}

.policy_tag{
  .label{
    background-color: #D99809;
    color: #fff;
    padding: .4rem .6rem;
    border-radius: .3rem;
  
  }
}
</style>