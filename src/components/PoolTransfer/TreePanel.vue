<template>
  <div class="elx-transfer">
    <div class="elx-transfer-panel">
      <div class="elx-transfer-panel__header">
        <div style="float:left;">
          <el-checkbox v-model="allChecked" :indeterminate="isIndeterminate">{{ title }}</el-checkbox>
        </div>
        <!-- <div v-if="query" style="float:right;padding-right:15px;">{{ searchCount}}</div> -->
        <div style="float:right;padding-right:15px;">{{checkSummary}}</div>
      </div>
      <div :class="['elx-transfer-panel__body']">
        <el-input v-if="searchMethod" class="elx-transfer-panel__filter" v-model="query" size="small" :placeholder="placeholder" @mouseenter.native="inputHover = true" @mouseleave.native="inputHover = false">
          <i slot="prefix" :class="['el-input__icon', 'el-icon-' + inputIcon]" @click="clearQuery"></i>
        </el-input>
        <tom-tree 
          class="tree__container"
          v-show="!filterData && data.length > 0"
          ref="tree"
          :data="data" 
          :node-key="treeNodeKey"
          :props="props"
          show-checkbox 
          @tree-updated="treeUpdated"
          @check-changed="checkChanged"
          @half-check-changed="halfCheckChanged"
          @expanded="nodeExpanded"></tom-tree>
        <div v-show="filterData">
          <el-checkbox-group v-model="checked" v-show="filterData && filterData.length > 0" class="elx-transfer-panel__list">
            <el-checkbox class="elx-transfer-panel__item" v-for="data in filterData" :disabled="data.disabled" :key="data[props.id]" :label="data[props.id]" :title="data[props.label]">{{data[props.label]}}</el-checkbox>
          </el-checkbox-group>
          <p class="elx-transfer-panel__empty" v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
        </div>
        <p class="elx-transfer-panel__empty" v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import Locale from 'element-ui/src/mixins/locale'
import ElInput from 'element-ui/lib/input'
import ElCheckbox from 'element-ui/lib/checkbox'
import ElCheckboxGroup from 'element-ui/lib/checkbox-group'
import TomTree from './../TomTree'
import debounce from 'lodash/debounce'
export default {
  name: 'TreePanel',
  components: {
    TomTree,
    ElInput,
    ElCheckbox,
    ElCheckboxGroup
  },
  mixins: [Locale],
  props: {
    data: {
      type: Array,
      default () {
        return [];
      }
    },
    placeholder: String,
    title: String,
    props: Object,
    searchMode: String, // 计划支持两种模式，一种本地，一种远程，本地搜索需设置searchKeys
    searchKeys: { // searchKeys
      type: Array,
      default () {
        return ['name']
      }
    },
    searchMethod: Function,
    treeNodeKey: {
      type: String,
      default: 'id'
    },
    searchResult: Array,
    value: {
      type: Array,
      default () {
        return [];
      }
    },
    count: Number,
    checkCountFilter: Function
  },
  data() {
    return {
      query: '',
      inputHover: false,
      checked: [],
      halfChecked: [],
      totalCount: null,
      filterData: null,
    }
  },
  watch: {
    query: debounce(function(val) {
      console.log(val)
      if (val === '') {
        this.filterData = null
        this.totalCount = this.data.length
      } else {
        this.$refs.tree.clearCheck()
        if (this.searchMode === 'local') {
          this.filterData = this.data.filter(node => {
            return this.searchMethod.call(null, node, val)
          })
          this.totalCount = this.filterData.length
          console.log(this.filterData)
        } else if (this.searchMode === 'remote') {
          this.$emit('search', val)
        }
      }
    }, 200),
    checked(val) {
      this.$emit('input', val)
    //   this.$refs.tree.clearCheck()
    //   this.$emit('searchChecked', val)
    },
    searchResult(val) {
      //Todo: update total count
      if (val) this.totalCount = val.length
    },
    data(val) {
      if (this.query) {
        this.$refs.tree.clearCheck()
        if (this.searchMode === 'local') {
          this.filterData = val.filter(node => {
            return this.searchMethod.call(null, node, this.query)
          })
          this.totalCount = this.filterData.length
          console.log(this.filterData)
        } else if (this.searchMode === 'remote') {
          this.$emit('search', this.query)
        }       
      }
    }
  },
  computed: {
    hasNoMatch() {
      return this.query.length > 0 && this.filterData && this.filterData.length === 0;
    },
    inputIcon() {
      return this.query.length > 0 && this.inputHover ?
        'circle-close' :
        'search';
    },
    allChecked: {
      get: function() {
        return this.totalCount !== 0 && this.checked.length === this.totalCount
      },
      set: function(newVal) {
        if (newVal) {
          if (this.query === '') {
            this.$refs.tree.checkAll()
          } else {
            this.filterData.map(node => {
              node.checked = true
              this.checked.push(node[this.props.id])
            })
          }
        }
        else {
          if (this.query === '') {
            this.$refs.tree.clearCheck()
          } else {
            this.filterData.map(node => {
              node.checked = false
              this.checked.splice(this.checked.indexOf(node[this.props.id]), 1)
            })
          }
        }
        // this.$emit('input', this.checked)
      }
    },
    isIndeterminate() {
      console.log(this.checked)
      const checkedLength = this.checked.length;
      return checkedLength > 0 && checkedLength < this.totalCount
    },
    searchCount() {
      return this.filterData && this.filterData.length || 0
    },
    checkedCount() {
      return this.checked.filter(id => {
        if (this.checkCountFilter) return this.checkCountFilter.call(null, id)
        else return true
      }).length
    },
    checkSummary() {
      let count = this.query ? this.searchCount : this.count
      if (this.checkedCount) return `${this.checkedCount}/${count}`
      else return count
    }
  },
  methods: {
    treeUpdated() {
      this.totalCount = this.$refs.tree.totalCount
      this.$emit('tree-updated')
    },
    handleAllCheckedChange() {
      if (this.allChecked) this.$refs.tree.checkAll()
      else this.$refs.tree.clearCheck()
    },
    clearQuery(force) {
      if (force) {
        this.query = ''
      }
      if (this.inputIcon === 'circle-close') {
        this.query = '';
      }
      this.checked = []
    },
    append(data, pid) {
      this.$nextTick(()=>{
        this.$refs.tree.append(data, this.$refs.tree.getNode(pid))
      })
    },
    nodeExpanded(data) {
      this.$emit('node-expanded', data)
    },
    checkChanged(data) {
      console.log('tree check change', data)
      this.checked = data
      this.$emit('input', data)
      this.$emit('check-changed', data)
    },
    halfCheckChanged(data) {
      this.halfChecked = data
      this.$emit('half-check-changed', data)
    },
    clearCheck() {
      this.checked = []
      this.halfChecked = []
      this.$refs.tree.clearCheck()
    },
    getTree() {
      return this.$refs.tree
    }
  }
}
</script>
<style>
.elx-transfer {
    font-size: 14px;
}
.elx-transfer-panel {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    display: inline-block;
    vertical-align: middle;
    width: 200px;
    max-height: 100%;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
}
.elx-transfer-panel__body {
    height: 246px;
}
.elx-transfer-panel .elx-transfer-panel__header {
    height: 40px;
    line-height: 40px;
    background: #f5f7fa;
    margin: 0;
    padding-left: 15px;
    border-bottom: 1px solid #ebeef5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #000;
}
.elx-transfer-panel__body.is-with-footer {
    padding-bottom: 40px;
}
.elx-transfer-panel__list {
    text-align: left;
    margin: 0;
    padding: 6px 0;
    list-style: none;
    height: 246px;
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
}
.elx-transfer-panel__item {
    height: 30px;
    line-height: 30px;
    padding-left: 15px;
    display: block;
}
.elx-transfer-panel__item.el-checkbox {
    color: #606266;
    margin: 0;
}
.elx-transfer-panel__item .el-checkbox__input {
    position: absolute;
    top: 8px;
}
.elx-transfer-panel__item.el-checkbox .el-checkbox__label {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 24px;
    line-height: 30px;
}
.elx-transfer-panel .el-checkbox__inner {
    height: 14px;
    width: 14px;
    border-radius: 3px;
}
.elx-transfer-panel__filter {
    text-align: center;
    margin: 15px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: block;
    width: auto;
}
.elx-transfer-panel__filter .el-input__inner {
    height: 32px;
    width: 100%;
    font-size: 12px;
    display: inline-block;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 16px;
    padding-right: 10px;
    padding-left: 30px;
}
.elx-transfer-panel__empty {
    margin: 0;
    height: 30px;
    line-height: 30px;
    padding: 6px 15px 0;
    color: #909399;
    text-align: center;
}
.tree__container {
    height: 199px !important;
}
</style>
