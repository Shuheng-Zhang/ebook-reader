import { mapGetters, mapActions } from 'vuex'
import { themeList, addCSS, removeAllCSS } from './book'
import { saveLocation } from '../utils/localStoreage'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themeList() {
      return themeList(this);
    }
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle() {
      removeAllCSS()
      switch (this.defaultTheme) {
        case "Default":
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break;
        case "Eye":
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`);
          break;
        case "Gold":
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`);
          break;
        case "Night":
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`);
          break;
        default:
          addCSS(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`);
          break;
      }
    },
    // 刷新当前进度
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation();
      const startCfi = currentLocation.start.cfi
      const progress = this.currentBook.locations.percentageFromCfi(startCfi);
      this.setProgress(Math.floor(progress * 100));
      this.setSection(currentLocation.start.index)
      // 缓存当前阅读进度
      saveLocation(this.fileName, startCfi)
    },
    // 展示电子书内容页面
    display(target, callback) {
      if (target) {
        this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (callback) {
            callback()
          }
        })
      } else {
        this.rendition.display().then(() => {
          this.refreshLocation()
          if (callback) {
            callback()
          }
        })
      }
    }

  }
}
