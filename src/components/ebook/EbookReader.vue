<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import Epub from "epubjs";
import { ebookMixin } from "../../utils/mixin";
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize
} from "../../utils/localStoreage.js";

export default {
  mixins: [ebookMixin],
  methods: {
    // 初始化字号配置数据
    initFontSize() {
      let fontSize = getFontSize(this.fileName);
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize);
      } else {
        this.rendition.themes.fontSize(fontSize);
        this.setDefaultFontSize(fontSize);
      }
    },
    // 初始化字体配置数据
    initFontFamily() {
      let font = getFontFamily(this.fileName);
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        this.rendition.themes.font(font);
        this.setDefaultFontFamily(font);
      }
    },
    // 初始化电子书
    initEpub() {
      // 匹配电子书路径
      const url = "http://localhost:8085/epub/" + this.fileName + ".epub";

      // 解析电子书并渲染
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      console.log(this.book);
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight,
        method: "default" // 微信兼容
      });
      // 展示电子书内容
      this.rendition.display().then(() => {
        // 从离线存储中获取并应用配置数据
        this.initFontSize();
        this.initFontFamily();
      });

      // 使用 rendition.on() 方法动态绑定事件到 iframe
      // 手势操作事件处理
      this.rendition.on("touchstart", event => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", event => {
        const offSetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;

        if (time < 500 && offSetX > 40) {
          this.prevPage(); // 上一页
        } else if (time < 500 && offSetX < -40) {
          this.nextPage(); // 下一页
        } else {
          this.toggleTitleAndMenu(); // 显示标题栏和菜单栏
        }

        // event.preventDefault(); // 禁用默认事件调用
        event.stopPropagation(); // 禁止事件传播
      });

      // 加载阅读器渲染用字体文件
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          )
        ]).then(() => {
          console.log("字体加载完成.");
        });
      });
    },
    // 上一页
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
        this.hideTitleAndMenu();
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
        this.hideTitleAndMenu();
      }
    },
    // 显示标题栏和菜单栏
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1);
        this.setFontFamilyVisible(false);
      }
      this.setMenuVisible(!this.menuVisible);
    },
    // 隐藏标题栏和菜单栏
    hideTitleAndMenu() {
      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    }
  },
  mounted() {
    this.setFileName(this.$route.params.filename.split("|").join("/")).then(
      () => {
        this.initEpub();
      }
    );
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
</style>
