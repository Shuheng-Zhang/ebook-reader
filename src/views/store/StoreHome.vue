<template>
  <div class="store-home">
    <SearchBar></SearchBar>
    <FlapCard></FlapCard>
    <Scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
      <div>scroll</div>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "../../components/common/Scroll";
import SearchBar from "../../components/home/SearchBar";
import FlapCard from "../../components/home/FlapCard"
import { storeHomeMixin } from "../../utils/mixin"
export default {
  mixins: [storeHomeMixin],
  components: {
    Scroll,
    SearchBar,
    FlapCard
  },
  data() {
    return {
      scrollTop: 94
    };
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
      if (offsetY > 0) {
        this.scrollTop = 52;
      } else {
        this.scrollTop = 94
      }
      this.$refs.scroll.refresh()
    }
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.store-home {
  width: 100%;
  height: 100%;
}
</style>
