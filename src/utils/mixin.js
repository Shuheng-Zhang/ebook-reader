import { mapGetters, mapActions } from 'vuex'
import { themeList, addCSS, removeAllCSS } from './book'

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
    }
  }
}
