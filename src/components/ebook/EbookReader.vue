<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @click="onMaskClick"
      @touchmove="execMove"
      @touchend="cancelMove"
      @mousedown.left="onMouseLeftEnter"
      @mousemove.left="onMouseLeftMove"
      @mouseup.left="onMouseLeftUp"
    ></div>
  </div>
</template>

<script>
import Epub from "epubjs";
import { ebookMixin } from "../../utils/mixin";
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation
} from "../../utils/localStoreage.js";
import { flatten } from "../../utils/book";

export default {
  mixins: [ebookMixin],
  methods: {
    // 初始化主题样式
    initTheme() {
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
        saveTheme(this.fileName, defaultTheme);
      }
      this.setDefaultTheme(defaultTheme);
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style);
      });
      this.rendition.themes.select(defaultTheme);
    },
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
    // 初始化电子书渲染器
    initRendition() {
      // 解析电子书并渲染
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight,
        method: "default" // 微信兼容
      });
      // 获取当前电子书阅读位置并展示电子书内容
      const location = getLocation(this.fileName);
      this.display(location, () => {
        // 从离线存储中获取并应用配置数据
        this.initTheme();
        this.initFontSize();
        this.initFontFamily();

        this.initGlobalStyle();
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
    // 初始化阅读器手势
    initGesture() {
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
    },
    // 蒙板点击事件
    onMaskClick(event) {
      // 规避PC端鼠标下拉操作时的点击事件
      if (this.mouseStat && (this.mouseStat === 2 || this.mouseStat === 3)) {
        return;
      }
      const offSetX = event.offsetX;
      console.log("offSetX", offSetX);
      let width = window.innerWidth;
      console.log("windwo width", width);
      if (offSetX > 0 && offSetX < width * 0.3) {
        this.prevPage();
      } else if (offSetX > 0 && offSetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleTitleAndMenu();
      }
    },
    // 执行下拉动作
    execMove(event) {
      let offsetY = 0;
      if (this.firstOffsetY) {
        offsetY = event.changedTouches[0].clientY - this.firstOffsetY;
        this.setOffsetY(offsetY);
      } else {
        this.firstOffsetY = event.changedTouches[0].clientY;
      }
      event.preventDefault();
      event.stopPropagation();
    },
    // 结束下拉动作并重置相关数值
    cancelMove(event) {
      this.setOffsetY(0);
      this.firstOffsetY = null;
    },
    // 兼容PC端手势事件
    // 状态1 鼠标点击
    onMouseLeftEnter(event) {
      this.mouseStat = 1;
      this.mouseStartTime = event.timeStamp;
      event.preventDefault();
      event.stopPropagation();
    },
    // 状态2 鼠标点击后移动
    onMouseLeftMove(event) {
      if (this.mouseStat === 1) {
        this.mouseStat = 2;
      } else if (this.mouseStat === 2) {
        let offsetY = 0;
        if (this.firstOffsetY) {
          offsetY = event.clientY - this.firstOffsetY;
          this.setOffsetY(offsetY);
        } else {
          this.firstOffsetY = event.clientY;
        }
      }
      event.preventDefault();
      event.stopPropagation();
    },
    // 状态3 鼠标释放
    onMouseLeftUp(event) {
      if (this.mouseStat === 2) {
        this.setOffsetY(0);
        this.firstOffsetY = null;
        this.mouseStat = 3;
      } else {
        this.mouseStat = 4;
      }

      // 优化PC端鼠标事件
      // 鼠标点击时的轻微移动亦认定为点击事件
      const t = event.timeStamp - this.mouseStartTime;
      if (t < 200) {
        this.mouseStat = 4;
      }

      event.preventDefault();
      event.stopPropagation();
    },
    // 解析电子书
    paresBook() {
      // 获取电子书元数据
      this.book.loaded.metadata.then(metadata => {
        console.log(metadata);
        this.setMetadata(metadata);
      });
      // 获取封面
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url);
        });
      });
      // 获取电子书目录数据
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc);
        function find(item, level = 0) {
          return !item.parent
            ? level
            : find(
              navItem.filter(parentItem => parentItem.id === item.parent)[0],
              ++level
            );
        }
        navItem.forEach(item => {
          item.level = find(item);
        });
        this.setNavigation(navItem);
      });
    },
    // 初始化电子书
    initEpub() {
      // 匹配电子书路径
      const url =
        process.env.VUE_APP_RES_URL + "/epub/" + this.fileName + ".epub";

      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      console.log(this.book);

      this.initRendition();
      // this.initGesture();
      // 解析电子书内容
      this.paresBook();

      // 分页
      this.book.ready.then(() => {
        return this.book.locations
          .generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          )
          .then(locations => {
            this.setBookAvailable(true);
            this.refreshLocation();
          });
      });
    },
    // 上一页
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
          // 关闭高亮
          if (this.highlightTarget) {
            this.rendition.annotations.remove(this.highlightTarget, 'highlight');
            this.setHighlightTarget(null);
          }
        });
        this.hideTitleAndMenu();
      }
    },
    // 下一页
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
          // 关闭高亮
          if (this.highlightTarget) {
            this.rendition.annotations.remove(this.highlightTarget, 'highlight');
            this.setHighlightTarget(null);
          }
        });
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
.ebook-reader {
  width: 100%;
  height: 100;
  overflow: hidden;
  .ebook-reader-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 150;
    background: transparent;
  }
}
</style>
