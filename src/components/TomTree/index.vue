<template>
  <virtual-scroller class="scroller" :items="treeNodes" item-height="24" :pool-size="400" content-tag="div">
    <template slot-scope="props">
      <tree-node
        :key="props.item[nodeKey]"
        :node="props.item"
        :index="props.itemIndex"
        :show-checkbox="showCheckbox"
        :label="nodeLabel"
        @checkChanged="handleCheckChange"
        @expandChanged="handleExpandChange"></tree-node>
    </template>
  </virtual-scroller>
</template>
<script>
import Tree from './model/tree'
import { VirtualScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import TreeNode from './TreeNode'
export default {
  name: 'TomTree',
  components: {
    VirtualScroller,
    TreeNode
  },
  props: {
    data: {
      type: Array
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    nodeKey: String,
    props: {
      default () {
        return {
          id: 'id',
          label: 'name',
          parentId: 'parentId'
        }
      }
    }
  },
  data () {
    return {
      nodeLabel: this.props.label,
      tree: null,
      sourceData: [],
      checkedNodes: [],
      halfCheckedNodes: [],
      filter: [],
      nodeMap: {
      }
    }
  },
  computed: {
    treeNodes() {
      return this.tree.data && this.tree.data.filter(node=>node.visible) || []
    },
    totalCount() {
      return this.tree.data.length
    }
  },
  watch: {
    data: {
      handler: function (newVal) {
        console.log(arguments)
        console.log('Get data', newVal)
        this.tree.setData(newVal)
        this.$emit('tree-updated')
      }
    }
  },
  mounted () {
  },
  methods: {
    handleCheckChange (event) {
      console.log(event.node)
      let node = event.node
      console.log(node.checked)
      console.log(this.checkedNodes.indexOf(node[this.props.id]))
      if (node.checked) {
        if (this.checkedNodes.indexOf(node[this.props.id]) === -1) this.checkedNodes.push(node[this.props.id])
      } else {
        if (this.checkedNodes.indexOf(node[this.props.id]) > -1) this.checkedNodes.splice(this.checkedNodes.indexOf(node[this.props.id]), 1)
      }
      if (this.halfCheckedNodes.indexOf(node[this.props.id]) > -1) this.halfCheckedNodes.splice(this.halfCheckedNodes.indexOf(node[this.props.id]), 1)
      console.time('check')
      this.updateChildNodes(this.tree.getNodeDescendants(node), 'checked', node.checked)
      console.timeEnd('check')
      if (node.level !== 0) {
        let parent = this.tree.getNode(node[this.props.parentId])
        if (parent) this.updateParentNode(parent)
      }
      console.log('check changed', this.checkedNodes, this.halfCheckedNodes)
      this.$emit('check-changed', this.checkedNodes)
      this.$emit('half-check-changed', this.halfCheckedNodes)
    },
    handleExpandChange (node) {
      node.expanded = !node.expanded
      node.children.forEach(child => {
        child.visible = node.expanded
      })
      this.$emit('expanded', node)
    },
    // TODO: 优化，不使用递归解决问题，以父节点为起点后面的为子节点和兄弟节点
    updateChildNodes (nodes, propName, value) {
      console.log(nodes)
      if (nodes && nodes.length) {
        nodes.forEach(node => {
          node[propName] = value
          if (propName === 'checked') {
            if (node.checked && this.checkedNodes.indexOf(node[this.props.id]) === -1) this.checkedNodes.push(node[this.props.id])
            else {
              if (this.checkedNodes.indexOf(node[this.props.id]) > -1) this.checkedNodes.splice(this.checkedNodes.indexOf(node[this.props.id]), 1)
            }
            node.indeterminate = false
            if (this.halfCheckedNodes.indexOf(node[this.props.id]) > -1) this.halfCheckedNodes.splice(this.halfCheckedNodes.indexOf(node[this.props.id]), 1)
          } else if (propName === 'hidden') {
            if (value && !node.isLeaf) node.expanded = false
          }
        })
      }
    },
    updateParentNode (node) {
      let children = node.children
      const { all, none, half } = this.tree.getNodesState(children)
      if (all) {
        node.checked = true
        node.indeterminate = false
      } else if (half) {
        node.checked = false
        node.indeterminate = true
      } else if (none) {
        node.checked = false
        node.indeterminate = false
      }
      if (node.indeterminate) {
        if (this.halfCheckedNodes.indexOf(node[this.props.id]) === -1) this.halfCheckedNodes.push(node[this.props.id])
        if (this.checkedNodes.indexOf(node[this.props.id]) > -1) this.checkedNodes.splice(this.checkedNodes.indexOf(node[this.props.id]), 1)
      } else {
        if (this.halfCheckedNodes.indexOf(node[this.props.id]) > -1) this.halfCheckedNodes.splice(this.halfCheckedNodes.indexOf(node[this.props.id]), 1)
        if (node.checked && this.checkedNodes.indexOf(node[this.props.id]) === -1) this.checkedNodes.push(node[this.props.id])
        else if (!node.checked && this.checkedNodes.indexOf(node[this.props.id]) > -1) this.checkedNodes.splice(this.checkedNodes.indexOf(node[this.props.id]), 1)
      }
      if (node.level !== 0) {
        let parent = this.tree.getNode(node[this.props.parentId])
        if (parent) this.updateParentNode(parent)
      }
    },
    getNode (id) {
      return this.tree.getNode(id)
    },
    getChildren (node) {
      return node.children
    },
    getNodeDescendants (node) {
      return this.tree.getNodeDescendants(node)
    },
    checkAll() {
      this.tree.data.forEach(node => {
        !node.disabled && (node.checked = true)
        if (this.checkedNodes.indexOf(node[this.props.id]) === -1) this.checkedNodes.push(node[this.props.id])
      })
      this.halfCheckedNodes = []
      console.log('checkall', this.checkedNodes)
      this.$emit('check-changed', this.checkedNodes)
      this.$emit('half-check-changed', this.halfCheckedNodes)
    },
    clearCheck() {
      this.tree.data.forEach(node => !node.disabled && (node.checked = false))
      this.checkedNodes = []
      this.halfCheckedNodes = []
      this.$emit('check-changed', this.checkedNodes)
      this.$emit('half-check-changed', this.halfCheckedNodes)
    },
    appendToParent (parentId, nodes) {
      console.log('appendToParent', nodes)
      let parent = this.getNode(parentId)
      if (!parent || !nodes.length) return false
      else {
        console.log('appendToParent', nodes)
        nodes.forEach(node => {
          this.appendChild(node)
        })
      }
    },
    appendChild (node) {
      let n = this.tree.getNode(node[this.props.id])
      if (n) return false // 不能添加重复节点
      else {
        this.tree.append(node)
      }
    }
  },
  created () {
    this.tree = new Tree(this.data, {
      props: this.props
    })
    console.log('tree', this.tree)
  }
}
</script>
<style>
.scroller {
  width: 100%;
  height: 100%;
  text-align: left;
}
.scroller .item-container {
  overflow: initial !important;
}
</style>
