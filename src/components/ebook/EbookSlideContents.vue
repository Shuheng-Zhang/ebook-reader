<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          class="slide-contents-search-input"
          type="text"
          v-model="searchText"
          :placeholder="$t('book.searchHint')"
          @click="showSearchPage"
          @keyup.enter.exact="execSearch"
        />
      </div>
      <div
        class="slide-contents-search-cancel"
        v-show="searchVisiable"
        @click="hideSearchPage"
      >{{ $t('book.cancel') }}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisiable">
      <div class="slide-contents-book-img-wrapper">
        <img class="slide-contents-book-img" :src="cover" />
      </div>
      <div class="slide-contents-book-info-wrapper">
        <div class="slide-contents-book-title">
          <span class="slide-contents-book-title-text">{{ title }}</span>
        </div>
        <div class="slide-contents-book-author">
          <span class="slide-contents-book-author-text">{{ author}}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{ progress + '%' }}</span>
          <span class="progress-text">{{ $t('book.haveRead2') }}</span>
        </div>
        <div class="slide-contents-book-time">{{ getReadTimeText() }}</div>
      </div>
    </div>
    <Scroll
      class="slide-contents-list"
      v-show="!searchVisiable"
      :top="156"
      :bottom="48"
      ref="scroll"
    >
      <div class="slide-contents-item" v-for="(item, index) in navigation" :key="index">
        <span
          class="slide-contents-item-label"
          :style="contentItemStyle(item)"
          :class="{ 'selected': section === index }"
          @click="displayTargetContent(item.href)"
        >{{ item.label }}</span>
        <span class="slide-contents-item-page"></span>
      </div>
    </Scroll>
    <Scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisiable">
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="displayTargetContent(item.cfi, true)"
      ></div>
    </Scroll>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import Scroll from "../common/Scroll";
import { px2rem } from "../../utils/utils";

export default {
  mixins: [ebookMixin],
  components: {
    Scroll
  },
  data() {
    return {
      searchVisiable: false,
      searchList: null,
      searchText: "",
      title: "",
      author: ""
    };
  },
  methods: {
    hideSearchPage() {
      this.searchVisiable = false;
      this.searchText = "";
      this.serachList = null;
    },
    showSearchPage() {
      this.searchVisiable = true;
    },
    // 计算目录项层级
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      };
    },
    // 内容搜索（全文搜索）
    contentTextSearch(q) {
      console.log("do search");
      return Promise.all(
        this.currentBook.spine.spineItems.map(item =>
          item
            .load(this.currentBook.load.bind(this.currentBook))
            .then(item.find.bind(item, q))
            .finally(item.unload.bind(item))
        )
      ).then(results => Promise.resolve([].concat.apply([], results)));
    },
    // 执行内容搜索
    execSearch() {
      if (this.searchText && this.searchText.length > 0) {
        this.contentTextSearch(this.searchText).then(list => {
          this.searchList = list;
          this.searchList.map(item => {
            item.excerpt = item.excerpt.replace(
              this.searchText,
              `<span class="content-search-text">${this.searchText}</span>`
            );
            return item;
          });
        });
      }
    },
    // 显示目标内容
    displayTargetContent(target, highlight = false) {
      this.display(target, () => {
        this.hideTitleAndMenu();
        if (highlight) {
          this.currentBook.rendition.annotations.highlight(target);
          this.setHighlightTarget(target);
        }
      });
    }
  },
  updated() {
    // 加载电子书标题信息
    if (this.metadata && this.metadata.title) {
      this.title = this.metadata.title;
    }

    // 加载电子书作者信息
    if (this.metadata && this.metadata.creator) {
      this.author = this.metadata.creator;
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      @include center;
      .slide-contents-search-icon {
        width: px2rem(28);
        font-size: px2rem(12);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title {
        // width: px2rem(153.75);
        font-size: px2rem(14);
        line-height: px2rem(16);
        // 解决大屏幕标题不缩放（显示不全）的问题
        @include left;
        .slide-contents-book-title-text {
          @include ellipsis2(2);
        }
      }
      .slide-contents-book-author {
        // width: px2rem(153.75);
        font-size: px2rem(12);
        margin-top: px2rem(5);
        line-height: px2rem(14);
        // 解决大屏幕作者信息不缩放（显示不全）的问题
        @include left;
        .slide-contents-book-author-text {
          @include ellipsis2(1);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(14);
        }
        .progress-text {
          font-size: px2rem(12);
        }
      }
      .slide-contents-book-time {
        font-size: px2rem(12);
        margin-top: px2rem(5);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
      }
      .slide-contents-item-page {
      }
    }
  }
  .slide-search-list {
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
