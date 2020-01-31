<template>
  <div class="ebook">
    <EBookReader></EBookReader>
  </div>
</template>

<script>
import EBookReader from '../../components/ebook/EbookReader.vue'

export default {
  components: {
    EBookReader
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global.scss';
</style>
