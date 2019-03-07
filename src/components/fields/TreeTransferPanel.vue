<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">
      <el-checkbox v-model="allChecked" @change="handleAllCheckedChange" :indeterminate="isIndeterminate">
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>
    <div :class="['el-transfer-panel__body', hasFooter ? 'is-with-footer' : '']">
      <el-input class="el-transfer-panel__filter" v-model="query" size="small" :placeholder="placeholder" @mouseenter.native="inputHover = true" @mouseleave.native="inputHover = false" v-if="filterable">
        <i slot="prefix" :class="['el-input__icon', 'el-icon-' + inputIcon]" @click="clearQuery"></i>
      </el-input>
      <el-tree :accordion="true" :default-expanded-keys="expandedKeys" :class="{ 'is-filterable': filterable }" class="el-transfer-panel__list" :node-key="keyProp" show-checkbox :highlight-current="true" v-show="!hasNoMatch && data.length > 0" :data="data" :props="props" :filter-node-method="filterMethod" ref="tree" @check="onCheck" v-on="handlers">
      </el-tree>
      <p class="el-transfer-panel__empty" v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
      <p class="el-transfer-panel__empty" v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
    </div>
    <p class="el-transfer-panel__footer" v-if="hasFooter">
      <slot></slot>
    </p>
  </div>
</template>
<script>
import ElCheckbox from 'element-ui/packages/checkbox';
import ElInput from 'element-ui/packages/input';
import Locale from 'element-ui/src/mixins/locale';

export default {
  mixins: [Locale],

  name: 'TreeTransferPanel',

  componentName: 'TreeTransferPanel',
  mounted() {

  },
  components: {
    ElCheckbox,
    ElInput,
    OptionContent: {
      props: {
        option: Object
      },
      render(h) {
        const getParent = vm => {
          if (vm.$options.componentName === 'ElTransferPanel') {
            return vm;
          } else if (vm.$parent) {
            return getParent(vm.$parent);
          } else {
            return vm;
          }
        };
        const panel = getParent(this);
        const transfer = panel.$parent || panel;
        return panel.renderContent ?
          panel.renderContent(h, this.option) :
          transfer.$scopedSlots.default ?
          transfer.$scopedSlots.default({ option: this.option }) :
          `<span> { this.option[panel.labelProp] || this.option[panel.keyProp] } </span>`
      }
    }
  },

  props: {
    data: {
      type: Array,
      default () {
        return [];
      }
    },
    renderContent: Function,
    placeholder: String,
    title: String,
    filterable: Boolean,
    format: Object,
    filterMethod: Function,
    defaultChecked: Array,
    props: Object,
    handlers: Object,
    expandedKeys: {
      type: Array,
      default () {
        return [];
      }
    },
    //检查是否是lazynode,lazy-node需根据props.count计算个数
    checkLazyNode: Function
  },

  data() {
    return {
      checked: [],
      halfChecked: [],
      allChecked: false,
      query: '',
      inputHover: false,
      checkedCount: null,
      totalCount: null,
      checkChangeByUser: true
    };
  },

  watch: {
    query(val) {
      this.$refs.tree.filter(val);
    },
    checked(val, oldVal) {
      this.updateAllChecked();
      this.generateCheckedCount();
      if (this.checkChangeByUser) {
        const movedKeys = val.concat(oldVal)
          .filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
        this.$emit('checked-change', val, movedKeys);
        this.$emit('halfchecked-change', this.halfChecked, movedKeys);
      } else {
        this.$emit('checked-change', val);
        this.$emit('halfchecked-change', this.halfChecked);
        this.checkChangeByUser = true;
      }
    },

    data() {
      const checked = [];
      const filteredDataKeys = this.data.map(item => item[this.keyProp]);
      this.checked.forEach(item => {
        if (filteredDataKeys.indexOf(item) > -1) {
          checked.push(item);
        }
      });
      this.checkChangeByUser = false;
      this.checked = checked;
      this.generateTotalCount();
    },

    checkableData() {
      this.updateAllChecked();
    },

    defaultChecked: {
      immediate: true,
      handler(val, oldVal) {
        if (oldVal && val.length === oldVal.length &&
          val.every(item => oldVal.indexOf(item) > -1)) return;
        const checked = [],
          halfChecked = [];
        const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
        val.forEach(item => {
          if (checkableDataKeys.indexOf(item) > -1) {
            checked.push(item);
          }
        });
        this.checkChangeByUser = false;
        this.checked = checked;
      }
    }
  },

  computed: {
    checkableData() {
      return this.data.filter(item => !item[this.disabledProp]);
    },

    checkedSummary() {
      return this.checkedCount > 0 ? `${this.checkedCount}/${this.totalCount}` : this.totalCount
    },

    isIndeterminate() {
      const checkedLength = this.checked.length;
      return checkedLength > 0 && this.checkedCount < this.totalCount;
    },

    hasNoMatch() {
      return this.query.length > 0 && this.data.length === 0;
    },

    inputIcon() {
      return this.query.length > 0 && this.inputHover ?
        'circle-close' :
        'search';
    },
    childProp() {
      return this.props.children || 'children';
    },
    labelProp() {
      return this.props.label || 'label';
    },

    keyProp() {
      return this.props.key || 'key';
    },

    disabledProp() {
      return this.props.disabled || 'disabled';
    },

    hasFooter() {
      return !!this.$slots.default;
    }
  },

  methods: {
    generateCheckedCount() {
      let checkCount = 0,
        countProp = this.props.count,
        childProp = this.props.children;
      this.checked.forEach(id => {
        //typeof id == 'number'
        let data = this.$refs.tree.getNode(id).data;
        if (this.checkLazyNode && this.checkLazyNode(data)) {
          //未加载数据时以props.count属性计算count
          if (!data.loaded) {
            checkCount += data[countProp] || 0
          }
        } else {
          checkCount++
        }
      })
      this.checkedCount = checkCount;
    },
    generateTotalCount() {
      let totalCount = 0,
        countProp = this.props.count,
        childProp = this.props.children,
        getLeafCount = (data) => {
          if (this.checkLazyNode && this.checkLazyNode(data)) {
            // 组织或者设备组节点
            if (!data.loaded) {
              totalCount += (data[countProp] || 0 )
            }
            if (data[childProp] && data[childProp].length) {
              data[childProp].forEach(child => {
                getLeafCount(child)
              })
            }
          } else {
            // 人员或者设备节点
            totalCount++
          }
        }
      if (this.data && this.data.length) {
        this.data.forEach(data => {
          getLeafCount(data)
        })
      }
      this.totalCount = totalCount;
    },
    updateAllChecked() {
      const checkableDataKeys = this.checkableData.map(item => item[this.keyProp]);
      this.allChecked = checkableDataKeys.length > 0 &&
        checkableDataKeys.every(item => this.checked.indexOf(item) > -1);
    },
    handleAllCheckedChange(value) {
      /*this.checked = value ?
        this.checkableData.map(item => item[this.keyProp]) : [];*/
      let roots = this.checkableData,
        keyProp = this.props.key,
        rootKeys = roots && roots.map(item => item[keyProp]);
      if (!rootKeys || !rootKeys.length) return;
      rootKeys.forEach((nodeKey) => {
        this.$refs.tree.setChecked(nodeKey, value, true);
      });

      this.$nextTick(() => {
        this.checked = this.$refs.tree.getCheckedKeys();
        this.halfChecked = [];
      });
    },
    clearQuery() {
      if (this.inputIcon === 'circle-close') {
        this.query = '';
      }
    },
    onCheck(data, checked) {
      // console.log(data)
      this.checkChangeByUser = true;
      this.halfChecked = checked.halfCheckedKeys;
      this.checked = checked.checkedKeys;
    },
    nodeExpanded(data, node, nodeElm) {
      this.$emit('nodeExpanded', node)
    },
    getNode(key) {
      return this.$refs.tree.getNode(key)
    },
    getTree() {
      return this.$refs.tree
    }
  }
};
</script>
