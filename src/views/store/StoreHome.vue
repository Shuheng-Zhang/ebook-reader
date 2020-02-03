<template>
<div class='store-home'>
  <SearchBar></SearchBar>
</div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar'
export default {
  components: {
    SearchBar
  },
  data() {
    return {

    };
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
@import '../../assets/styles/global.scss';
.store-home {
  width: 100%;
  height: 100%;
}
</style>
