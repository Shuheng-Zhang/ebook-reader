<template>
  <div>
    <div class="serach-bar" :class="{'hiding-title': !titleVisible, 'hide-shadow': !shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{ $t('home.title') }}</span>
          </div>
          <div class="title-icon-shake-wrapper">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper" :class="{'hiding-title': !titleVisible}" @click="back">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hiding-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hiding-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input
            type="text"
            class="input"
            :placeholder="$t('home.hint')"
            v-model="searchText"
            @click="showHotSearch"
          />
        </div>
      </div>
    </div>
    <HotSearchList v-show="hotSearchVisible" ref="hotSearchList"></HotSearchList>
  </div>
</template>

<script>
import { storeHomeMixin } from "../../utils/mixin";
import HotSearchList from "./HotSearchList";
export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data() {
    return {
      searchText: "",
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    };
  },
  methods: {
    showTitle() {
      this.titleVisible = true;
    },
    hideTitle() {
      this.titleVisible = false;
    },
    showShadow() {
      this.shadowVisible = true;
    },
    hideShadow() {
      this.shadowVisible = false;
    },
    showHotSearch() {
      // 隐藏标题栏并展示热门搜索
      this.hideTitle();
      this.hideShadow();
      this.hotSearchVisible = true;
      this.$nextTick(() => {
        this.$refs.hotSearchList.reset();
      });
    },
    hideHotSearch() {
      this.hotSearchVisible = false;
    },
    back() {
      this.hideHotSearch();
      if (this.offsetY > 0) {
        this.hideTitle();
        this.showShadow();
      } else {
        this.showTitle();
        this.hideShadow();
      }
    }
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.hideTitle();
        this.showShadow();
      } else {
        this.showTitle();
        this.hideShadow();
      }
    },
    hotSearchOffsetY(hotSearchOffsetY) {
      if (hotSearchOffsetY > 0) {
        this.showShadow();
      } else {
        this.hideShadow();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.serach-bar {
  position: relative;
  z-index: 150;
  width: 100%;
  height: px2rem(94);
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.15);
  &.hiding-title {
    height: px2rem(52);
  }
  &.hide-shadow {
    box-shadow: none;
  }
  .search-bar-title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    .title-text-wrapper {
      height: px2rem(42);
      width: 100%;
      @include center;
    }
    .title-icon-shake-wrapper {
      position: absolute;
      top: 0;
      right: px2rem(15);
      height: px2rem(42);
      @include center;
    }
  }
  .title-icon-back-wrapper {
    position: absolute;
    top: 0;
    left: px2rem(15);
    z-index: 200;
    height: px2rem(42);
    @include center;
    transition: height $animationTime $animationType;
    &.hiding-title {
      height: px2rem(52);
    }
  }
  .search-bar-input-wrapper {
    position: absolute;
    left: 0;
    top: px2rem(42);
    display: flex;
    width: 100%;
    height: px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    transition: top $animationTime $animationType;
    &.hiding-title {
      top: 0;
    }
    .search-bar-blank {
      flex: 0 0 0;
      width: 0;
      transition: all $animationTime $animationType;
      &.hiding-title {
        flex: 0 0 px2rem(31);
        width: px2rem(31);
      }
    }
    .search-bar-input {
      flex: 1;
      width: 100%;
      background: #f4f4f4;
      border-radius: px2rem(20);
      padding: px2rem(5) px2rem(15);
      box-sizing: border-box;
      border: px2rem(1) solid #eeeeee;
      @include left;
      .icon-search {
        color: #999999;
      }
      .input {
        width: 100%;
        height: px2rem(22);
        border: none;
        background: transparent;
        margin-left: px2rem(10);
        font-size: px2rem(12);
        color: #666666;
        &:focus {
          outline: none;
        }
        &::-webkit-input-placeholder {
          color: #cccccc;
        }
      }
    }
  }
}
</style>
