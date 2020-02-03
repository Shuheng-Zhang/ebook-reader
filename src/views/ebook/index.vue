<template>
  <div class="ebook" ref="ebook">
    <EbookTitle></EbookTitle>
    <EBookReader></EBookReader>
    <EbookMenu></EbookMenu>
    <EbookBookMark></EbookBookMark>
  </div>
</template>

<script>
import EbookTitle from "../../components/ebook/EbookTitle.vue";
import EBookReader from "../../components/ebook/EbookReader.vue";
import EbookMenu from "../../components/ebook/EbookMenu.vue";
import EbookBookMark from "../../components/ebook/EbookBookMark.vue";

import { ebookMixin } from "../../utils/mixin";
import { getReadTime, saveReadTime } from "../../utils/localStoreage";

export default {
  mixins: [ebookMixin],
  components: {
    EbookTitle,
    EBookReader,
    EbookMenu,
    EbookBookMark
  },
  methods: {
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName);
      if (!readTime) {
        readTime = 0;
      }

      this.task = setInterval(() => {
        readTime++;
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime);
        }
      }, 1000);
    },
    execMove(value) {
      this.$refs.ebook.style.top = `${value}px`;
    },
    cancelMove() {
      this.$refs.ebook.style.top = 0;
      this.$refs.ebook.style.transition = "all .2s linear";
      setTimeout(() => {
        this.$refs.ebook.style.transition = "";
      }, 200);
    }
  },
  watch: {
    offsetY(nv) {
      if (!this.menuVisible && this.bookAvailable) {
        if (nv > 0) {
          this.execMove(nv);
        } else if (nv === 0) {
          this.cancelMove();
        }
      }
    }
  },
  mounted() {
    this.startLoopReadTime();
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
