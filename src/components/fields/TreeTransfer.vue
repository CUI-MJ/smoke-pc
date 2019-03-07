<template>
  <el-row :gutter="100" class="el-transfer tree-transfer">
    <el-col :span="12">
      <transfer-panel v-bind="$props" ref="leftPanel" :handlers="handlers" :data="sourceData" :title="titles[0] || t('el.transfer.titles.0')" :default-checked="leftDefaultChecked" :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')" @checked-change="onSourceCheckedChange" @halfchecked-change="onSourceHalfCheckedChange">
        <slot name="left-footer"></slot>
      </transfer-panel>
    </el-col>
    <el-col :span="12">
      <transfer-panel v-bind="$props" ref="rightPanel" :data="targetData" :expanded-keys="expandedKeys" :title="titles[1] || t('el.transfer.titles.1')" :default-checked="rightDefaultChecked" :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')" @checked-change="onTargetCheckedChange" @halfchecked-change="onTargetHalfCheckedChange">
        <slot name="right-footer"></slot>
      </transfer-panel>
    </el-col>
    <div class="el-transfer__buttons tree-transfer-buttons">
      <el-button type="primary" :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']" @click.native="addToLeft" :disabled="rightChecked.length === 0">
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
import ElButton from 'element-ui/packages/button';
import Emitter from 'element-ui/src/mixins/emitter';
import Locale from 'element-ui/src/mixins/locale';
import TransferPanel from './TreeTransferPanel.vue';
import Migrating from 'element-ui/src/mixins/migrating';

export default {
  name: 'TreeTransfer',

  mixins: [Emitter, Locale, Migrating],

  components: {
    TransferPanel,
    ElButton
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
    buttonTexts: {
      type: Array,
      default () {
        return [];
      }
    },
    filterPlaceholder: {
      type: String,
      default: ''
    },
    filterMethod: Function,
    leftDefaultChecked: {
      type: Array,
      default () {
        return [];
      }
    },
    rightDefaultChecked: {
      type: Array,
      default () {
        return [];
      }
    },
    renderContent: Function,
    value: {
      type: Array,
      default () {
        return [];
      }
    },
    format: {
      type: Object,
      default () {
        return {};
      }
    },
    filterable: Boolean,
    props: {
      type: Object,
      default () {
        return {
          label: 'label',
          key: 'key',
          disabled: 'disabled'
        };
      }
    },
    targetOrder: {
      type: String,
      default: 'original'
    },
    leftTreeExpand: {
      type: Function,
      default () {
        return () => {}
      }
    },
    expandedKeys: {
      type: Array,
      default () {
        return [];
      }
    },
    autoCheckParentNode: Boolean,
    checkLazyNode: Function
  },

  data() {
    return {
      leftChecked: [],
      leftHalfChecked: [],
      rightChecked: [],
      rightHalfChecked: [],
      halfValue: [],
      allValue: [],
      handlers: {
        'node-expand': this.leftTreeExpand
      }
    };
  },

  computed: {
    dataObj() {
      const key = this.props.key;
      return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {});
    },

    sourceData() {
      //return this.data.filter(item => this.value.indexOf(item[this.props.key]) === -1)
      let data = JSON.parse(JSON.stringify(this.data));
      let filterData = this.doFilter(data, this.value, true);
      return filterData;
    },

    targetData() {
      /*return this.targetOrder === 'original' ?
        this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1) :
        this.value.map(key => this.dataObj[key]);*/

      let data = JSON.parse(JSON.stringify(this.data));
      let filterKeys = this.value.concat(this.halfValue);
      let filterData = this.doFilter(data, filterKeys);
      return filterData;
    },

    hasButtonTexts() {
      return this.buttonTexts.length === 2;
    }
  },

  watch: {
    value(val) {
      if (val && val.length) {
        val.forEach(id => {
          let node = this.$refs.leftPanel.getNode(id)
          if (node) this.checkParent(node)
        })
      }
      // if (this.autoCheckParentNode && val.length && JSON.stringify(val) != JSON.stringify(oldVal)) {
      //   this.allValue = []
      //   val.forEach(id => {
      //     // if (typeof id == 'string') {
      //       let node = this.$refs.leftPanel.getNode(id)
      //       if(node && node.isLeaf) {
      //         this.checkParent(node.parent)
      //       }
      //     // }
      //   })
      //   console.log(this.allValue)
      //   this.$emit('input', val.concat(this.allValue))
      //   this.$emit('autoCheckParentNode', false)
      // console.log(this.allValue)
      // console.log(this.halfValue)
      // 忘了下面这段咋回事了
      // let tempValue = []
      // this.halfValue.forEach(orgId => {
      //   let node = this.$refs.leftPanel.getNode(orgId)
      //   if (node) {
      //     let count = 0
      //     node.childNodes.forEach(child => {
      //       if (typeof child.data.id == 'string') {
      //         if (val.indexOf(child.data.id) != -1) {
      //           count++
      //         }
      //       } else if (typeof child.data.id == 'number') {
      //         if (this.halfValue.indexOf(child.data.id) != -1) {
      //           count++
      //         }
      //       }
      //     })
      //     if (count == node.childNodes.length) tempValue.push(node.data.id)
      //   }
      // })
      // }
      this.dispatch('ElFormItem', 'el.form.change', val);

    }
  },

  methods: {
    //已半选/已全选都不添加到halfvalue
    checkParent(node) {
      var parent = node.parent;
      if (parent && parent.data) {
        var parentData = parent.data;
        if (parentData.id &&
          this.halfValue.indexOf(parentData.id) == -1 &&
          this.value.indexOf(parentData.id) == -1) {
          this.halfValue.push(parentData.id)
        }
        this.checkParent(parent)
      }
    },
    // checkParent(parent) {
    //   if (parent.count) parent.count ++
    //   else parent.count = 1
    //   if (parent.count == parent.childNodes.length) {
    //     if (this.allValue.indexOf(parent.data.id) == -1) {
    //       this.allValue.push(parent.data.id)
    //     }
    //   } else {
    //     if (this.halfValue.indexOf(parent.data.id) == -1) {
    //       this.halfValue.push(parent.data.id)
    //     }        
    //   }
    //   if (parent.parent && parent.parent.id) {
    //     this.checkParent(parent.parent)
    //   }
    // },
    getMigratingConfig() {
      return {
        props: {
          'footer-format': 'footer-format is renamed to format.'
        }
      };
    },

    onSourceCheckedChange(val, movedKeys) {
      this.leftChecked = val;
      if (movedKeys === undefined) return;
      this.$emit('left-check-change', val, movedKeys);
    },

    onSourceHalfCheckedChange(val, movedKeys) {
      this.leftHalfChecked = val;
      if (movedKeys === undefined) return;
      //this.$emit('left-check-change', val, movedKeys);
    },

    onTargetCheckedChange(val, movedKeys) {
      this.rightChecked = val;
      if (movedKeys === undefined) return;
      this.$emit('right-check-change', val, movedKeys);
    },

    onTargetHalfCheckedChange(val, movedKeys) {
      this.rightHalfChecked = val;
      if (movedKeys === undefined) return;
      //this.$emit('right-check-change', val, movedKeys);
    },

    addToLeft() {

      let filterKeys = this.halfValue.filter(item => this.rightChecked.indexOf(item) == -1);

      this.halfValue = Array.from(new Set(filterKeys.concat(this.rightHalfChecked)));
      let currentValue = this.value.slice();
      this.rightChecked.concat(this.rightHalfChecked).forEach(item => {
        const index = currentValue.indexOf(item);
        if (index > -1) {
          currentValue.splice(index, 1);
        }
      });
      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'left', this.rightChecked);
    },

    addToRight() {
      this.halfValue = Array.from(new Set(this.leftHalfChecked.concat(this.halfValue)));
      let currentValue = this.value.slice();
      const key = this.props.key;
      /*this.data.forEach(item => {
        const itemKey = item[key];
        if (
          this.leftChecked.indexOf(itemKey) > -1 &&
          this.value.indexOf(itemKey) === -1
        ) {
          itemsToBeMoved.push(itemKey);
        }
      });*/
      const itemsToBeMoved = this.leftChecked.filter(item => this.value.indexOf(item[key]) == -1);
      currentValue = this.targetOrder === 'unshift' ?
        itemsToBeMoved.concat(currentValue) :
        currentValue.concat(itemsToBeMoved);

      this.$emit('input', currentValue);
      this.$emit('change', currentValue, 'right', this.leftChecked);
    },

    clearQuery(which) {
      if (which === 'left') {
        this.$refs.leftPanel.query = '';
      } else if (which === 'right') {
        this.$refs.rightPanel.query = '';
      }
    },
    containKey(keys, node) {
      if (!keys || keys.length == 0) return false;
      return keys.find(item => item == node[this.props.key]) != null;
    },
    //reverse true 排除filterKeys,false保留filterKeys
    doFilter(data, filterKeys, reverse = false) {

      const filterData = data.filter(item => {
        if (this.containKey(filterKeys, item) == !reverse) {
          let childProp = this.props.children,
            children = item[childProp];
          if (children && children.length) {
            item[childProp] = this.doFilter(children, filterKeys, reverse);
          }
          return true;
        }
        return false;
      });
      return filterData;
    },
    sourceTree() {
      return this.$refs.leftPanel.getTree()
    },
    destTree() {
      return this.$refs.rightPanel.getTree()
    }
  }
};

</script>
<style type="text/css" scoped>
.tree-transfer {
  overflow: hidden;
  width: auto!important;
  height: auto!important;
}
.el-transfer-panel{
  width: 100%;
}
.tree-transfer-buttons {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -41px 0 0 -50px;
}

</style>
