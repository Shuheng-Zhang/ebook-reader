<template>
  <div>
    <transition name="slide-up">
      <div class="menu-wrapper" v-show="menuVisible" :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0}">
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <EbookSettingFont></EbookSettingFont>
    <EbookSettingFontPopup></EbookSettingFontPopup>
    <EbookSettingTheme></EbookSettingTheme>
    <EbookSettingProgress></EbookSettingProgress>
    <EbookSlide></EbookSlide>
  </div>
</template>

<script>
import EbookSettingFont from "./EbookSettingFont";
import EbookSettingFontPopup from './EbookSettingFontPopup';
import EbookSettingTheme from './EbookSettingTheme';
import EbookSettingProgress from './EbookSettingProgress.vue'
import EbookSlide from './EbookSlide.vue';

import { ebookMixin } from "../../utils/mixin";

export default {
  mixins: [ebookMixin],
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  methods: {
    showSetting(key) {
      console.log(`show setting ${key}`);
      this.setSettingVisible(key);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
.menu-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: px2rem(48);
  z-index: 200;
  background-color: #fff;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  display: flex;
  font-size: px2rem(20);
  &.hide-box-shadow {
    box-shadow: none;
  }
  .icon-wrapper {
    flex: 1;
    @include center;
    .icon-progress {
      font-size: px2rem(24);
    }
    .icon-bright {
      font-size: px2rem(22);
    }
  }
}
</style>
