<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import Epub from 'epubjs';
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["fileName"])
  },
  methods: {
    // 初始化电子书
    initEpub() {
      // 匹配电子书路径
      const url = "http://localhost:8085/epub/" + this.fileName + ".epub";

      // 解析电子书并渲染
      this.book = new Epub(url);
      console.log(this.book)
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight,
        method: 'default' // 微信兼容
      })
      // 展示电子书内容
      this.rendition.display()
    }
  },
  mounted() {
    this.$store.dispatch("setFileName", this.$route.params.filename.split("|").join("/")).then(() => {
      this.initEpub();
    });
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
</style>
