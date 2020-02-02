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

import { ebookMixin } from '../../utils/mixin'
import { getReadTime, saveReadTime } from '../../utils/localStoreage'

export default {
  mixins: [ebookMixin],
  components: {
    EbookTitle,
    EBookReader,
    EbookMenu
  },
  methods: {
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }

      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  mounted() {
    this.startLoopReadTime()
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task)
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global.scss';
</style>
