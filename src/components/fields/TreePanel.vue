<template>
  <div class="el-transfer">
    <div class="el-transfer-panel">
      <p class="el-transfer-panel__header">
        {{ title }}
        <span style="float:right;margin-right:15px">{{ totalCount }}</span>
      </p>
      <div :class="['el-transfer-panel__body', 'is-with-footer']">
        <el-input class="el-transfer-panel__filter" v-model="query" size="small" :placeholder="placeholder" @mouseenter.native="inputHover = true" @mouseleave.native="inputHover = false">
          <i slot="prefix" :class="['el-input__icon', 'el-icon-' + inputIcon]" @click="clearQuery"></i>
        </el-input>
        <el-tree
          :data="data"
          :props="props" 
          :node-key="props.key"
          ref="tree"
          :filter-node-method="filterMethod"
          class="el-transfer-panel__list">
        </el-tree>
        <p class="el-transfer-panel__empty" v-show="hasNoMatch">{{ t('el.transfer.noMatch') }}</p>
        <p class="el-transfer-panel__empty" v-show="data.length === 0 && !hasNoMatch">{{ t('el.transfer.noData') }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import Locale from 'element-ui/src/mixins/locale';
export default {
  name: 'TreePanel',
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
    totalCount: Number
  },
  data() {
    return {
      query: '',
      inputHover: false
    }
  },
  watch: {
    query(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    hasNoMatch() {
      return this.query.length > 0 && this.data.length === 0;
    },
    inputIcon() {
      return this.query.length > 0 && this.inputHover ?
        'circle-close' :
        'search';
    }
  },
  methods: {
    clearQuery() {
      if (this.inputIcon === 'circle-close') {
        this.query = '';
      }
    },
    filterMethod(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getNode(key) {
      return this.$refs.tree.getNode(key)
    },
    append(data, pid) {
      this.$nextTick(()=>{
        this.$refs.tree.append(data, this.$refs.tree.getNode(pid))
      })
    }
  }
}
</script>
