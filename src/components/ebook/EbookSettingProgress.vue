<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{ getReadTimeText() }}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper" @click="prevSection">
            <span class="icon-back"></span>
          </div>
          <input
            class="progress"
            type="range"
            min="0"
            max="100"
            step="0.1"
            @change="onProgressChange($event.target.value)"
            @input="onProgressInput($event.target.value)"
            :value="progress"
            :disable="!bookAvailable"
            ref="progress"
          />
          <div class="progress-icon-wrapper" @click="nextSection">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{ getSectionName }}</span>
          <span>({{ bookAvailable ? progress + '%' : '加载中...' }})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
export default {
  mixins: [ebookMixin],
  data() {
    return {};
  },
  methods: {
    // 显示当前进度页面
    displayProgress() {
      const cfi = this.currentBook.locations.cfiFromPercentage(
        this.progress / 100
      );
      this.display(cfi);
    },
    // 更新进度条背景颜色填充
    updateProgressBackground() {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    },
    // 进度条拖动释放后调用
    onProgressChange(progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress();
        this.updateProgressBackground();
      });
    },
    // 进度条拖动时调用
    onProgressInput(progress) {
      this.setProgress(progress).then(() => {
        this.updateProgressBackground();
      });
    },
    // 跳转并显示指定页
    displaySection() {
      const sectionInfo = this.navigation[this.section];
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href);
      }
    },
    // 跳转到上一章
    prevSection() {
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection();
        });
      }
    },
    // 跳转到下一章
    nextSection() {
      if (
        this.section < this.navigation.length - 1 &&
        this.bookAvailable
      ) {
        console.log(this.section)
        this.setSection(this.section + 1).then(() => {
          this.displaySection();
          console.log(this.section)
        });
      }
    }
  },
  // 处理进度条初始化时进度颜色不正确的问题
  updated() {
    this.updateProgressBackground();
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  z-index: 220;
  width: 100%;
  height: px2rem(90);
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  background-color: white;
  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .read-time-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: px2rem(40);
      @include center;
      font-size: px2rem(12);
    }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .progress-icon-wrapper {
        font-size: px2rem(20);
      }
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: px2rem(2);
        // background: -webkit-linear-gradient(#999999, #999999) no-repeat, #dddddd;
        // background-size: 0 100% !important;
        margin: 0 px2rem(10);
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background-color: #ffffff;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #dddddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(10);
      width: 100%;
      color: #333333;
      font-size: px2rem(12);
      // text-align: center;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      @include center;
      .progress-section-text {
        @include ellipsis;
      }
    }
  }
}
</style>
