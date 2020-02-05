<template>
  <div class="store-home">
    <SearchBar></SearchBar>
    <FlapCard :data="randon"></FlapCard>
    <Scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{backgroundImage: `url('${banner}')`}"></div>
      </div>
      <GuessYouLike class="guess-you-like" :data="guessYouLike"></GuessYouLike>
      <Recommend class="recommend" :data="recommend"></Recommend>
      <Featured
        class="featured"
        :data="featured"
        :titleText="$t('home.featured')"
        :btnText="$t('home.seeAll')"
      ></Featured>
      <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
        <CategoryBook :data="item"></CategoryBook>
      </div>
      <Category class="category" :data="categories"></Category>
    </Scroll>
  </div>
</template>

<script>
import Scroll from "../../components/common/Scroll";
import SearchBar from "../../components/home/SearchBar";
import FlapCard from "../../components/home/FlapCard";

import GuessYouLike from "../../components/home/GuessYouLike";
import Recommend from "../../components/home/Recommend";
import Featured from "../../components/home/Featured";
import CategoryBook from "../../components/home/CategoryBook";
import Category from "../../components/home/Category";
import { storeHomeMixin } from "../../utils/mixin";

import { home } from "../../api/store";

export default {
  mixins: [storeHomeMixin],
  components: {
    Scroll,
    SearchBar,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
  },
  data() {
    return {
      scrollTop: 94,
      randon: null,
      banner: null,
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    };
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
      if (offsetY > 0) {
        this.scrollTop = 52;
      } else {
        this.scrollTop = 94;
      }
      this.$refs.scroll.refresh();
    }
  },
  mounted() {
    home().then(resp => {
      if (resp && resp.status === 200) {
        const data = resp.data;
        console.log("resp data", data);
        const randomIndex = Math.floor(Math.random() * data.random.length);
        this.randon = data.random[randomIndex];
        this.banner = data.banner;
        this.guessYouLike = data.guessYouLike;
        this.recommend = data.recommend;
        this.featured = data.featured;
        this.categoryList = data.categoryList;
        this.categories = data.categories;
      }
    });
  }
};
</script>

<style lang='scss' scoped>
@import "../../assets/styles/global.scss";
.store-home {
  width: 100%;
  height: 100%;
  .banner-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: px2rem(150);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .guess-you-like {
  }
  .recommend {
    margin-top: px2rem(20);
  }
  .featured {
    margin-top: px2rem(20);
  }
  .category-list-wrapper {
    margin-top: px2rem(20);
  }
  .category {
    margin-top: px2rem(20);
  }
}
</style>
