export default {
  data() {
    return {
      windowHeight: document.documentElement.clientHeight,
      windowWidth: document.documentElement.clientWidth,
      magicHeight: 45 + 51, // The height of header + breadcrumb + padding top & bottom + pagination + X
      tableTnB: 32, // 表格头部与下面滚动条的高度
      cellHeight: 44, // 单元格高度
      contentHeight: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (window.addEventListener) window.addEventListener('resize', this.handleResize.bind(this))
      else if (window.attachEvent) window.attachEvent('resize', this.handleResize.bind(this))
      if (this.windowHeight >= 566) {
        let searchBarHeight = 0
        if (this.$refs.searchBar) searchBarHeight = this.$refs.searchBar.offsetHeight
        this.contentHeight = this.windowHeight - this.magicHeight - searchBarHeight
        console.log(this.contentHeight)
      } else {
        let searchBarHeight = 0
        if (this.$refs.searchBar) searchBarHeight = this.$refs.searchBar.offsetHeight
        this.contentHeight = 566 - this.magicHeight - searchBarHeight
      }  
    })
  },
  computed: {
    tableHeight() {
      if (this.contentHeight) {
        if (this.table.content && this.table.content.length == 0) return this.tableTnB + 58
        else if (this.table.content && this.table.content.length > 0){
          return this.contentHeight > this.tableTnB + this.cellHeight * (this.table.content.length) ? this.tableTnB + this.cellHeight * (this.table.content.length) : this.contentHeight
        } else return 500
      }
      else return 500
    }
  },
  methods: {
    handleResize(event) {
      this.windowHeight = document.documentElement.clientHeight
      this.windowWidth = document.documentElement.clientWidth
      if (this.windowHeight >= 566) {
        let searchBarHeight = 0
        if (this.$refs.searchBar) searchBarHeight = this.$refs.searchBar.offsetHeight
        console.log(searchBarHeight)
        this.contentHeight = this.windowHeight - this.magicHeight - searchBarHeight
      } else {
        let searchBarHeight = 0
        if (this.$refs.searchBar) searchBarHeight = this.$refs.searchBar.offsetHeight
        this.contentHeight = 566 - this.magicHeight - searchBarHeight
      }  
    }
  }
}
