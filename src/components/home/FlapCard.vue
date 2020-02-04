<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div
      class="flap-card-bg"
      :class="{ 'animation': runFlapCardAnimation }"
      v-show="runFlapCardAnimation"
    >
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
      <div class="point-wrapper">
        <div
          class="point"
          :class="{'animation': runPointAnimation }"
          v-for="item in pointList"
          :key="item"
        ></div>
      </div>
    </div>
    <div
      class="book-card"
      :class="{'animation': runBookCardAnimation}"
      v-show="runBookCardAnimation"
    >
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''" />
        </div>
        <div class="content-wrapper">
          <div class="title">{{data ? data.title : ''}}</div>
          <div class="author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from "../../utils/mixin";
import { FLAP_CARD_LIST, categoryText } from "../../utils/store";
export default {
  mixins: [storeHomeMixin],
  components: {},
  props: {
    data: Object
  },
  data() {
    return {
      flapCardList: FLAP_CARD_LIST,
      frontFlapCardIndex: 0,
      backFlapCardIndex: 1,
      intervalTime: 25,
      runFlapCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      runBookCardAnimation: false,
      ifShowBookCard: false
    };
  },
  methods: {
    close() {
      this.stopAnimation();
      this.setFlapCardVisible(false);
    },
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === "left" ? item.imgLeft : item.imgRight
      };
    },
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
    flapCardRotate() {
      const frontFlapCard = this.flapCardList[this.frontFlapCardIndex];
      const backFlapCard = this.flapCardList[this.backFlapCardIndex];
      frontFlapCard.rotateDegree += 10;
      frontFlapCard._g -= 5;
      backFlapCard.rotateDegree -= 10;
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5;
      }
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
        this.next();
      }
    },
    next() {
      const frontFlapCard = this.flapCardList[this.frontFlapCardIndex];
      const backFlapCard = this.flapCardList[this.backFlapCardIndex];
      frontFlapCard.rotateDegree = 0;
      backFlapCard.rotateDegree = 0;
      frontFlapCard._g = frontFlapCard.g;
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
      // 动态设置zIndex
      // 100 -> 96
      // 99 -> 100
      // 98 -> 99
      // 97 -> 98
      // 96 -> 97
      // (0 - 1 + 5) % 5 = 4
      // (1 - 1 + 5) % 5 = 0
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.frontFlapCardIndex + len) % len);
      });
      this.prepare();
    },
    prepare() {
      const backFlapCard = this.flapCardList[this.backFlapCardIndex];
      backFlapCard.rotateDegree = 180;
      backFlapCard._g = backFlapCard.g - 5 * 9;
      this.rotate(this.backFlapCardIndex, "back");
    },
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
      this.runBookCardAnimation = false;
      this.runFlapCardAnimation = false;
      this.runPointAnimation = false;
    },
    startFlapCardAnimation() {
      this.prepare();
      this.task = setInterval(() => {
        this.flapCardRotate();
      }, this.intervalTime);
    },
    startPointAnimation() {
      this.runPointAnimation = true;
      setTimeout(() => {
        this.runPointAnimation = false;
      }, 750);
    },
    stopAnimation() {
      if (this.task) {
        clearInterval(this.task);
      }
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      if (this.timeout2) {
        clearTimeout(this.timeout2);
      }
      this.reset();
    },
    runAnimation() {
      this.runFlapCardAnimation = true;
      this.timeout = setTimeout(() => {
        this.startFlapCardAnimation();
        this.startPointAnimation();
      }, 300);
      this.timeout2 = setTimeout(() => {
        this.stopAnimation();
        this.runBookCardAnimation = true;
      }, 2500);
    },
    categoryText() {
      if (this.data) {
        return categoryText(this.data.category, this);
      } else {
        return "";
      }
    }
  },
  watch: {
    // 当推荐面板展示时启动卡片翻转动画
    flapCardVisible(v) {
      if (v) {
        this.runAnimation();
      }
    }
  },
  created() {
    this.pointList = [];
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`);
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
@import "../../assets/styles/flapCard.scss";
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
    transform: scale(0);
    opacity: 0;
    &.animation {
      animation: flap-card-popup 0.3s ease-in both;
    }
    @keyframes flap-card-popup {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
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
    .point-wrapper {
      z-index: 1500;
      @include absCenter;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
    position: relative;
    width: 65%;
    // height: 70%;
    box-sizing: border-box;
    border-radius: px2rem(15);
    background: white;
    &.animation {
      animation: scale 0.3s ease-in both;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      margin-bottom: px2rem(30);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: px2rem(20);
        @include center;
        .img {
          width: px2rem(90);
          height: px2rem(130);
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        .title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipsis2(2);
        }
        .author {
          margin-top: px2rem(10);
          text-align: center;
        }
        .category {
          color: #999;
          font-size: px2rem(14);
          margin-top: px2rem(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        padding: px2rem(15) 0;
        text-align: center;
        color: white;
        font-size: px2rem(14);
        background: $color-blue;
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
