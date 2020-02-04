import { mapGetters, mapActions } from 'vuex'
import { themeList, addCSS, removeAllCSS, getReadTimeByMinutes } from './book'
import { saveLocation, getBookmark } from '../utils/localStoreage'

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
      'isBookmark',
      'highlightTarget'
    ]),
    themeList() {
      return themeList(this);
    },
    getSectionName() {
      return this.section ? this.navigation[this.section].label : ''
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
      'setIsBookmark',
      'setHighlightTarget'
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
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi);
        this.setProgress(Math.floor(progress * 100));
        console.log(currentLocation)
        // this.setSection(currentLocation.start.index)
        // 解决进度条标题与目录标题匹配问题
        for (let i = 0; i < this.navigation.length; i++) {
          if (this.navigation[i].href === currentLocation.start.href) {
            this.setSection(i)
            break;
          }
        }
        // 缓存当前阅读进度
        saveLocation(this.fileName, startCfi)

        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
      }
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
    },
    // 隐藏标题栏和菜单栏
    hideTitleAndMenu() {
      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },
    // 获取阅读时间
    getReadTimeText() {
      return this.$t("book.haveRead").replace(
        "$1",
        getReadTimeByMinutes(this.fileName)
      );
    }
  }
}

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible'
    ])
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible'
    ]),
    showBookDetail(book) {
      console.log('show book detail')
    }
  }
}
