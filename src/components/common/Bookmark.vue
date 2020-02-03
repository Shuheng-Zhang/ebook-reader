<template>
  <div class="bookmark" :style="style" ref="bookmark"></div>
</template>

<script>
import { px2rem } from "../../utils/utils"

export default {
  components: {},
  data() {
    return {};
  },
  props: {
    width: Number,
    height: Number,
    color: String
  },
  computed: {
    style() {
      if (this.color) {
        return {
          borderColor: `${this.color} ${this.color} transparent ${this.color}`
        };
      } else {
        return {};
      }
    }
  },
  methods: {
    refreshWidthAndHeight() {
      if (this.width && this.height) {
        let w = this.width / 2;
        let h = this.height - 5;
        this.$refs.bookmark.style.borderWidth = `${px2rem(h)}rem ${px2rem(w)}rem ${px2rem(5)}rem ${px2rem(w)}rem`;
      }
    }
  },
  mounted() {
    this.refreshWidthAndHeight();
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.bookmark {
  width: 0;
  height: 0;
  border-width: px2rem(50) px2rem(10) px2rem(10) px2rem(10);
  border-style: solid;
  border-color: white white transparent white;
}
</style>
