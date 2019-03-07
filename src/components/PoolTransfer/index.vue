<template>
  <el-row :gutter="100" class="el-transfer tree-transfer">
    <el-col :span="12">
      <tree-panel
        ref="leftPanel"
        :data="availableData"
        :title="titles[0]"
        :placeholder="filterPlaceholder"
        :tree-node-key="treeProps['tree-node-key']"
        :props="treeProps['props']"
        :searchMode="searchMode"
        :searchMethod="searchMethod"
        v-model="leftChecked"
        :count="leftCount"
        :checkCountFilter="checkCountFilter"
      >
        <slot name="left-footer"></slot>
      </tree-panel>
    </el-col>
    <el-col :span="12">
      <tree-panel
        ref="rightPanel"
        :data="selectedData"
        :title="titles[1]"
        :placeholder="filterPlaceholder"
        :tree-node-key="treeProps['tree-node-key']"
        :props="treeProps['props']"
        :searchMode="searchMode"
        :searchMethod="searchMethod"
        v-model="rightChecked"
        :count="rightCount"
        :checkCountFilter="checkCountFilter"
      >
        <slot name="right-footer"></slot>
      </tree-panel>
    </el-col>
    <div class="el-transfer__buttons tree-transfer-buttons">
      <el-button type="primary" :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']" @click.native="addToLeft" :disabled="rightChecked.length ===0">
        <i class="el-icon-arrow-left"></i>
        <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
      </el-button>
      <el-button type="primary" :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']" @click.native="addToRight" :disabled="leftChecked.length === 0">
        <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
        <i class="el-icon-arrow-right"></i>
      </el-button>
    </div>
  </el-row>
</template>
<script>
import TreePanel from './TreePanel'
import Tree from './../TomTree/model/tree'
export default {
  name: 'PoolTransfer',
  components: {
    TreePanel
  },
  props: {
    data: {
      type: Array,
      default () {
        return [];
      }
    },
    titles: {
      type: Array,
      default () {
        return [];
      }
    },
    filterPlaceholder: {
      type: String,
      default: ''
    },
    value: {
      type: Array,
      default () {
        return [];
      }
    },
    treeProps: {
      type: Object,
      default () {
        return {}
      }
    },
    buttonTexts: {
      type: Array,
      default () {
        return [];
      }
    },
    searchMode: String, // 计划支持两种模式，一种本地，一种远程，本地搜索需设置searchKeys
    searchKeys: { // searchKeys
      type: Array,
      default () {
        return ['name']
      }
    },
    searchMethod: Function,
    countFilter: Function,
    checkCountFilter: Function
  },
  data() {
    return {
      loading: false,
      leftChecked: [],
      rightChecked: [],
      selectIds: [],
      dataTree: null,
      allValue: [],  // 全选节点的node-key集合
      halfValue: []  //半选节点的node-key集合
    }
  },
  computed: {
    hasButtonTexts() {
      return this.buttonTexts.length === 2;
    },
    availableData() {
      return this.data.filter(n => {
        if (this.value.indexOf(n[this.treeProps.props.id]) > -1 && this.halfValue.indexOf(n[this.treeProps.props.id]) == -1) return false
        if (this.allValue.indexOf(n[this.treeProps.props.id]) > -1) return false
        return true
      })
    },
    leftCount() {
      return this.availableData.filter(n => {
        if (this.countFilter) return this.countFilter.call(null, n)
        else return true
      }).length
    },
    selectedData() {
      return this.data.filter(n => this.value.indexOf(n[this.treeProps.props.id]) > -1 || this.halfValue.indexOf(n[this.treeProps.props.id]) > -1 || this.allValue.indexOf(n[this.treeProps.props.id]) > -1)
    },
    rightCount() {
      return this.selectedData.filter(n => {
        if (this.countFilter) return this.countFilter.call(null, n)
        else return true
      }).length
    }
  },
  watch: {
    value(val, oldVal) {
      console.log('value changed', val, oldVal)
      console.timeEnd('how long????')
      console.time('computed')
      let { allValue, halfValue } = this.computeHalfValue(val)
      this.halfValue = halfValue
      this.allValue = allValue
      console.timeEnd('computed')
    },
    data(val) {
      console.log('sourcedata changed', val)
      this.dataTree.setData(val)
      console.log('sourcetree updated', this.dataTree)     
    }
  },
  methods: {
    addToLeft() {
      this.loading = true
      setTimeout(() => {
        let currentValue = this.value.slice()
        if (this.rightChecked.length) {
          this.rightChecked.forEach(id => {
            // 不要添加重复ID
            if (currentValue.indexOf(id) > -1) currentValue.splice(currentValue.indexOf(id), 1)
          })
        }
        this.$refs.rightPanel.clearCheck()
        this.loading = false
        this.$emit('input', currentValue)
      }, 200)
    },
    addToRight() {
      this.loading = true
      setTimeout(() => {
        let currentValue = this.value.slice()
        if (this.leftChecked.length) {
          this.leftChecked.forEach(id => {
            // 不要添加重复ID
            if (currentValue.indexOf(id) == -1) currentValue.push(id)
          })
        }
        this.$refs.leftPanel.clearCheck()
        console.log('addtoright')
        console.log(this.leftChecked)
        this.loading = false
        this.$emit('input', currentValue)
      }, 200)
    },
    computeHalfValue(ids) {
      console.time('computeHalfValue')
      let halfValue = []
      let allValue = []
      let noneValue = []
      console.log('ids', ids)
      ids.forEach(id => {
        let parentId = this.dataTree.nodesMap[id] && this.dataTree.nodesMap[id].parentId
        if (parentId && this.dataTree.nodesMap[parentId]) {
          let unselectedChildren = this.dataTree.nodesMap[parentId].children.filter(n => ids.indexOf(n[this.treeProps.props.id]) === -1)
          console.log('unselected children', unselectedChildren)
          if (unselectedChildren.length) {
            if (halfValue.indexOf(parentId) === -1) halfValue.push(parentId)
          } else {
            if (allValue.indexOf(parentId) === -1) allValue.push(parentId)
            // allValue.push(parentId)
          } 
        }
      })
      console.log(allValue, halfValue, noneValue)
      console.timeEnd('computeHalfValue')
      return { halfValue, allValue }      
    },
    convertValueToIds(values) {
      
      return values
    }
  },
  created() {
    this.dataTree = new Tree(this.data, {
      props: this.treeProps.props
    })
    console.log('sourcetree', this.dataTree)
  }
}
</script>
<style>
.tree-transfer {
  overflow: hidden;
  width: auto!important;
  height: auto!important;
}
.tree-transfer .elx-transfer-panel{
  width: 100%;
}
.tree-transfer-buttons {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -41px 0 0 -50px;
}
</style>
