<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{ text }}</div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <Bookmark :color="color" :width="15" :height="35"></Bookmark>
    </div>
  </div>
</template>

<script>
import Bookmark from "../common/Bookmark";
import { realPx } from "../../utils/utils";
import { ebookMixin } from "../../utils/mixin";

import { getBookmark, saveBookmark } from "../../utils/localStoreage";

const BOOKMARK_COLOR_BLUE = "#346cbc";
const BOOKMARK_COLOR_WHITE = "#ffffff";

export default {
  mixins: [ebookMixin],
  components: {
    Bookmark
  },
  computed: {
    height() {
      return realPx(35);
    },
    threshold() {
      return realPx(55);
    },
    fixedStyle() {
      return {
        position: "fixed",
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`
      };
    }
  },
  data() {
    return {
      text: "",
      color: BOOKMARK_COLOR_WHITE,
      isFixed: false
    };
  },
  methods: {
    // 添加书签
    addBookmark() {
      this.bookmarkList = getBookmark(this.fileName);
      if (!this.bookmarkList) {
        this.bookmarkList = [];
      }
      const currentLocation = this.currentBook.rendition.currentLocation();
      const cfiBase = currentLocation.start.cfi.replace(/!.*/, "");
      const cfiStart = currentLocation.start.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      const cfiEnd = currentLocation.end.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      const cfiRange = `${cfiBase}!,${cfiStart},${cfiEnd})`;

      this.currentBook.getRange(cfiRange).then(range => {
        const rangeText = range.toString().replace(/\s\s/g, "");
        this.bookmarkList.push({
          cfi: currentLocation.start.cfi,
          text: rangeText
        });
        saveBookmark(this.fileName, this.bookmarkList);
      });
    },
    // 移除书签
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      const cfi = currentLocation.start.cfi;
      this.bookmarkList = getBookmark(this.fileName);
      if (this.bookmarkList) {
        saveBookmark(
          this.fileName,
          this.bookmarkList.filter(item => item.cfi !== cfi)
        );
        this.setIsBookmark(false);
      }
    },
    // 书签状态1 下拉到达书签高度前
    beforeBookmarkHeight() {
      if (this.isBookmark) {
        this.text = this.$t("book.pulldownDeleteMark");
        this.color = BOOKMARK_COLOR_BLUE;
        this.isFixed = true;
      } else {
        this.text = this.$t("book.pulldownAddMark");
        this.color = BOOKMARK_COLOR_WHITE;
        this.isFixed = false;
      }
    },
    // 书签状态2 下拉临界前
    beforeThreshold(v) {
      this.$refs.bookmark.style.top = `${-v}px`;

      this.beforeBookmarkHeight();

      const iconDown = this.$refs.iconDown;
      if (iconDown.style.transform === "rotate(180deg)") {
        iconDown.style.transform = "rotate(0deg)";
      }
    },
    // 书签状态3 下拉临界
    afterThreshold(v) {
      this.$refs.bookmark.style.top = `${-v}px`;

      if (this.isBookmark) {
        this.text = this.$t("book.releaseDeleteMark");
        this.color = BOOKMARK_COLOR_WHITE;
        this.isFixed = false;
      } else {
        this.text = this.$t("book.releaseAddMark");
        this.color = BOOKMARK_COLOR_BLUE;
        this.isFixed = true;
      }

      const iconDown = this.$refs.iconDown;
      if (
        iconDown.style.transform === "" ||
        iconDown.style.transform === "rotate(0deg)"
      ) {
        iconDown.style.transform = "rotate(180deg)";
      }
    },
    // 书签状态4 重置归位
    reset() {
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`;
        this.$refs.iconDown.style.transform = "rotate(0deg)";
      }, 200);

      if (this.isFixed) {
        this.setIsBookmark(true);
        this.addBookmark();
      } else {
        this.setIsBookmark(false);
        this.removeBookmark();
      }
    }
  },
  watch: {
    offsetY(nv) {
      // 当电子书解析未完成
      // 当菜单栏显示
      // 当设置面板显示
      // 不进行书签动作监听
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return;
      }

      if (nv >= this.height && nv < this.threshold) {
        console.log("2nd phase");
        this.beforeThreshold(nv);
      } else if (nv >= this.threshold) {
        console.log("3rd phase");
        this.afterThreshold(nv);
      } else if (nv > 0 && nv < this.height) {
        this.beforeBookmarkHeight();
      } else if (nv === 0) {
        this.reset();
      }
    },
    isBookmark(isBookmark) {
      if (isBookmark) {
        this.color = BOOKMARK_COLOR_BLUE
        this.isFixed = true;
      } else {
        this.color = BOOKMARK_COLOR_WHITE
        this.isFixed = false;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.ebook-bookmark {
  position: absolute;
  top: px2rem(-35);
  left: 0;
  z-index: 200;
  width: 100%;
  height: px2rem(35);
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    display: flex;
    .ebook-bookmark-down-wrapper {
      font-size: px2rem(14);
      color: white;
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-bookmark-text {
      font-size: px2rem(14);
      color: white;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: px2rem(15);
  }
}
</style>
