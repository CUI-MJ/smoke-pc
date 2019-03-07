export default {
  data() {
    return {
      list: [],
      searchParams: {
        page: 0,
        size: 10
      },
      isLoading: false
    }
  },
  computed: {
    pagination: function() {
      return {
        currentPage: this.$data[this.$_dataContainer].number ? this.$data[this.$_dataContainer].number + 1 : 1,
        pageSize:  this.$data[this.$_dataContainer].size || 10,
        pageSizes: [10, 20, 50],
        total: this.$data[this.$_dataContainer].totalElements || 0
      }
    }
  },
  methods: {
    $_initListPage({ api, dataContainer, searchBar, byId, byVuex, action}) {
      this.$_api = api
      this.$_dataContainer = dataContainer
      this.$_searchBar = searchBar
      this.$_byId = byId
      this.$_byVuex = byVuex
      this.$_action = action
      this.refresh()
    },
    $_getData() {
      this.isLoading = true
      if (!this.$_byVuex && this.$_api) {
        this.$_api.apply(null, arguments).then(res => {
          this.$data[this.$_dataContainer] = res
          this.isLoading = false
        }).catch(_ => {
          this.isLoading = false
        })
      }
      if(this.$_byVuex && this.$_action){
        this.$store.dispatch(this.$_action,arguments[0]).then((res) => {
          this.$data[this.$_dataContainer] = res
          this.isLoading = false
        }).catch(_ => {
          this.isLoading = false
        })
      }
    },
    search() {
      this.$data[this.$_dataContainer].size = 10
      this.$data[this.$_dataContainer].number = 0
      let searchParams = Object.assign({}, this.$data[this.$_searchBar] ? this.$data[this.$_searchBar] : {})
      this.searchParams = Object.assign(searchParams, {
        page: this.$data[this.$_dataContainer].number || 0,
        size: this.$data[this.$_dataContainer].size || 10
      })
      this.refresh()
    },
    refresh() {
      if (this.$_byId) {
        this.$_getData(this.$data.id, this.searchParams)
      } else {
        this.$_getData(this.searchParams)
      }
    },
    reset() {
      Object.keys(this.$data[this.$_searchBar]).forEach(key => {
        this.$data[this.$_searchBar][key] = null
      })
      this.searchParams = {
        page: 0,
        size: 10
      }
      this.refresh()
    },
    changePageSize(val) {
      this.searchParams.page = 0
      this.searchParams.size = val
      this.refresh()
    },
    changePageNumber(val) {
      this.searchParams.page = val - 1
      this.refresh()      
    }
  }
}
