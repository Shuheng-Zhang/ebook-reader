<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg">
      <div
        class="flap-card"
        v-for="(item, index) in flapCardList"
        :key="index"
        :style="{zIndex: item.zIndex}"
      >
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="semiCircleStyle(item, 'left')"
            ref="left"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="semiCircleStyle(item, 'right')"
            ref="right"
          ></div>
        </div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from "../../utils/mixin";
import { FLAP_CARD_LIST } from "../../utils/store";
export default {
  mixins: [storeHomeMixin],
  components: {},
  data() {
    return {
      flapCardList: FLAP_CARD_LIST,
      frontFlapCardIndex: 0,
      backFlapCardIndex: 1,
      intervalTime: 25
    };
  },
  methods: {
    // 关闭卡片所在面板
    close() {
      this.setFlapCardVisible(false);
      this.stopFlapCardAnimation()
    },
    // 设置半圆样式
    semiCircleStyle(item, direction) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: direction === "left" ? item.imgLeft : item.imgRight
      };
    },
    // 旋转
    // index - 卡片内容的序号
    // type - 卡片的正面（front）或背面（back）
    rotate(index, type) {
      const item = this.flapCardList[index];
      let dom;
      if (type === "front") {
        dom = this.$refs.right[index];
      } else {
        dom = this.$refs.left[index];
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
      dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`;
    },
    // 准备旋转
    // 获取背面卡片并设置旋转角度和初始颜色
    prepareRotate() {
      const backFlapCard = this.flapCardList[this.backFlapCardIndex];
      backFlapCard.rotateDegree = 180;
      backFlapCard._g = backFlapCard.g - 5 * 9;
      this.rotate(this.backFlapCardIndex, "back");
    },
    // 旋转卡片
    flapCardRotate() {
      const frontFlapCard = this.flapCardList[this.frontFlapCardIndex];
      const backFlapCard = this.flapCardList[this.backFlapCardIndex];
      frontFlapCard.rotateDegree += 10;
      frontFlapCard._g -= 5; // 颜色不断加深
      backFlapCard.rotateDegree -= 10;
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5; // 颜色不断变浅
      }
      // 当前正面半圆转动到90度时，下一个半圆将附着到当前半圆的背面
      if (
        frontFlapCard.rotateDegree === 90 &&
        backFlapCard.rotateDegree === 90
      ) {
        backFlapCard.zIndex += 2;
      }
      this.rotate(this.frontFlapCardIndex, "front");
      this.rotate(this.backFlapCardIndex, "back");
      if (
        frontFlapCard.rotateDegree === 180 &&
        backFlapCard.rotateDegree === 0
      ) {
        this.nextRotate();
      }
    },
    // 下一次旋转
    nextRotate() {
      const frontFlapCard = this.flapCardList[this.frontFlapCardIndex];
      const backFlapCard = this.flapCardList[this.backFlapCardIndex];
      frontFlapCard.rotateDegree = 0;
      frontFlapCard._g = frontFlapCard.g;
      backFlapCard.rotateDegree = 0;
      backFlapCard._g = backFlapCard.g;

      this.rotate(this.frontFlapCardIndex, "front");
      this.rotate(this.backFlapCardIndex, "back");

      this.frontFlapCardIndex++;
      this.backFlapCardIndex++;
      const len = this.flapCardList.length;
      if (this.frontFlapCardIndex >= len) {
        this.frontFlapCardIndex = 0;
      }
      if (this.backFlapCardIndex >= len) {
        this.backFlapCardIndex = 0;
      }

      // 动态计算zIndex，使卡片不断重叠以达到翻转效果
      // 100 -> 96
      // 99 -> 100
      // 98 -> 99
      // 97 -> 98
      // 96 -> 97
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.frontFlapCardIndex + len) % len);
      });
      this.prepareRotate();
    },
    // 重置卡片颜色、z-index和旋转角度
    // 重置卡片索引
    reset() {
      this.frontFlapCardIndex = 0;
      this.backFlapCardIndex = 1;
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index;
        item._g = item.g;
        item.rotateDegree = 0;
        this.rotate(index, "front");
        this.rotate(index, "back");
      });
    },
    // 启动卡片翻转动画
    startFlapCardAnimation() {
      this.prepareRotate();
      this.task = setInterval(() => {
        this.flapCardRotate();
      }, this.intervalTime);
    },
    // 停止卡片翻转动画
    stopFlapCardAnimation() {
      if (this.task) {
        clearInterval(this.task);
      }
      this.reset();
    }
  },
  watch: {
    // 当推荐面板展示时启动卡片翻转动画
    flapCardVisible(v) {
      if (v) {
        this.startFlapCardAnimation();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.flap-card-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  @include absCenter;
  @include center;
  .flap-card-bg {
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: #ffffff;
    .flap-card {
      @include absCenter;
      width: px2rem(48);
      height: px2rem(48);
      .flap-card-circle {
        display: flex;
        width: 100%;
        height: 100%;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(24) 0 0 px2rem(24);
          background-position: center right;
          transform-origin: right;
          backface-visibility: hidden; // 当元素转动到背面时隐藏
        }
        .flap-card-semi-circle-right {
          border-radius: 0 px2rem(24) px2rem(24) 0;
          background-position: center left;
          transform-origin: left;
          backface-visibility: hidden;
        }
      }
    }
  }
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(30);
    z-index: 1100;
    width: 100%;
    @include center;
    .icon-close {
      width: px2rem(45);
      height: px2rem(45);
      border-radius: 50%;
      background: #333333;
      font-size: px2rem(25);
      color: #ffffff;
      @include center;
    }
  }
}
</style>
