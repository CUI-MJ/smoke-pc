<template>
  <div v-show="node.visible" class="tree-node" :style="{paddingLeft: (node.level * 18) +'px'}">
    <span
      class="tree-node__expand-icon el-icon-caret-right"
      @click.stop="handleExpandIconClick"
      :class="{ 'is-leaf': node.isLeaf, expanded: !node.isLeaf && node.expanded }">
    </span>
    <el-checkbox
    v-if="showCheckbox"
    v-model="node.checked"
    :indeterminate="node.indeterminate"
    :disabled="!!node.disabled"
    @click.native.stop
    @change="handleCheckChange($event)"
    ></el-checkbox>
    <span class="elx-tree-node__label">{{ node[label] || ''}}</span>
  </div>
</template>
<script>
import ElCheckbox from 'element-ui/lib/checkbox'
export default {
  name: 'TreeNode',
  components: {
    ElCheckbox
  },
  props: {
    node: Object,
    index: Number,
    showCheckbox: {
      type: Boolean,
      default: false
    },
    label: String
  },
  created () {
  },
  methods: {
    handleCheckChange (event) {
      this.node.indeterminate = false
      this.$emit('checkChanged', {
        node: this.node,
        value: this.node.checked,
        event: event
      })
    },
    handleExpandIconClick () {
      this.$emit('expandChanged', this.node)
    }
  }
}
</script>
<style scoped>
.tree-node {
  white-space: nowrap;
  outline: 0px;
  height: 24px;
  line-height: 24px;
}
.tree-node__expand-icon {
  padding: 6px;
  cursor: pointer;
  color: rgb(192, 196, 204);
  font-size: 12px;
  transform: rotate(0deg);
  transition: transform 0.3s ease-in-out;
}
.tree-node__expand-icon.expanded {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
}
.tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
}
.elx-tree-node__label {
    font-size: 14px;
    padding-left: 5px;
}
</style>
