<template>
  <div class="ebook">
    <EbookTitle></EbookTitle>
    <EBookReader></EBookReader>
    <EbookMenu></EbookMenu>
  </div>
</template>

<script>
import EbookTitle from '../../components/ebook/EbookTitle.vue'
import EBookReader from '../../components/ebook/EbookReader.vue'
import EbookMenu from '../../components/ebook/EbookMenu.vue'

export default {
  components: {
    EbookTitle,
    EBookReader,
    EbookMenu
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global.scss';
</style>
