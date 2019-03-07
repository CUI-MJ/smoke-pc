<template>
    <el-row :gutter="100" class="el-transfer tree-transfer" style="margin-left: -50px;margin-right: -130px;">
      <el-col :span="12">
        <transfer-panel
          v-bind="$props"
          searchable
          ref="leftPanel"
          :data="leftData"
          :title="titles[0] || t('el.transfer.titles.0')"
          :default-checked="leftDefaultChecked"
          :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
          @search="search"
          @checked-change="onSourceCheckedChange">
          <slot name="left-footer"></slot>
          </transfer-panel>
      </el-col>
      <el-col :span=12>
          <transfer-panel
            v-bind="$props"
            filterable
            ref="rightPanel"
            :data="targetData"
            :title="titles[1] || t('el.transfer.titles.1')"
            :default-checked="rightDefaultChecked"
            :placeholder="filterPlaceholder || t('el.transfer.filterPlaceholder')"
            @checked-change="onTargetCheckedChange">
            <slot name="right-footer"></slot>
          </transfer-panel>
      </el-col>
      <div class="el-transfer__buttons">
        <el-button
          type="primary"
          :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
          @click.native="addToLeft"
          :disabled="rightChecked.length === 0">
          <i class="el-icon-arrow-left"></i>
          <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span>
        </el-button>
        <el-button
          type="primary"
          :class="['el-transfer__button', hasButtonTexts ? 'is-with-texts' : '']"
          @click.native="addToRight"
          :disabled="leftChecked.length === 0">
          <span v-if="buttonTexts[1] !== undefined">{{ buttonTexts[1] }}</span>
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </div>
    </el-row>
</template>

<script>
import ElButton from "element-ui/packages/button";
import Emitter from "element-ui/src/mixins/emitter";
import Locale from "element-ui/src/mixins/locale";
import TransferPanel from "./TransferPanel.vue";
import Migrating from "element-ui/src/mixins/migrating";

export default {
  name: "ElTransfer",

  mixins: [Emitter, Locale, Migrating],

  components: {
    TransferPanel,
    ElButton
  },

  props: {
    sourceData: {
      type: Array,
      default() {
        return [];
      }
    },
    targetData: {
      type: Array,
      default() {
        return [];
      }
    },
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    titles: {
      type: Array,
      default() {
        return [];
      }
    },
    buttonTexts: {
      type: Array,
      default() {
        return [];
      }
    },
    filterPlaceholder: {
      type: String,
      default: ""
    },
    filterMethod: Function,
    leftDefaultChecked: {
      type: Array,
      default() {
        return [];
      }
    },
    rightDefaultChecked: {
      type: Array,
      default() {
        return [];
      }
    },
    renderContent: Function,
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    format: {
      type: Object,
      default() {
        return {};
      }
    },
    filterable: Boolean,
    props: {
      type: Object,
      default() {
        return {
          label: "label",
          key: "key",
          disabled: "disabled"
        };
      }
    },
    targetOrder: {
      type: String,
      default: "original"
    }
  },

  data() {
    let rightData = this.targetData;
    return {
      leftChecked: [],
      rightChecked: [],
      rightData: rightData
    };
  },

  computed: {
    dataObj() {
      console.log("dataObj");
      const key = this.props.key;
      return this.data.reduce((o, cur) => (o[cur[key]] = cur) && o, {});
    },

    leftData() {
      return this.sourceData.filter(
        item => this.value.indexOf(item[this.props.key]) === -1
      );
    },

    // targetData() {
    //   return this.targetOrder === 'original'
    //     ? this.data.filter(item => this.value.indexOf(item[this.props.key]) > -1)
    //     : this.value.map(key => this.dataObj[key]);
    // },

    hasButtonTexts() {
      return this.buttonTexts.length === 2;
    }
  },

  watch: {
    value(val, oldVal) {
      this.dispatch("ElFormItem", "el.form.change", val);
    }
  },

  methods: {
    getMigratingConfig() {
      return {
        props: {
          "footer-format": "footer-format is renamed to format."
        }
      };
    },

    onSourceCheckedChange(val, movedKeys) {
      this.leftChecked = val;
      if (movedKeys === undefined) return;
      this.$emit("left-check-change", val, movedKeys);
    },

    onTargetCheckedChange(val, movedKeys) {
      this.rightChecked = val;
      if (movedKeys === undefined) return;
      this.$emit("right-check-change", val, movedKeys);
    },

    addToLeft() {
      let currentValue = this.value.slice();
      this.rightChecked.forEach(item => {
        const index = currentValue.indexOf(item);
        if (index > -1) {
          currentValue.splice(index, 1);
          this.targetData.splice(index, 1);
        }
      });
      this.$emit("input", currentValue);
      this.$emit("change", currentValue, "left", this.rightChecked);
    },

    addToRight() {
      let currentValue = this.value.slice();
      const itemsToBeMoved = [];
      const key = this.props.key;
      this.sourceData.forEach(item => {
        const itemKey = item[key];
        if (
          this.leftChecked.indexOf(itemKey) > -1 &&
          this.value.indexOf(itemKey) === -1
        ) {
          itemsToBeMoved.push(itemKey);
          this.targetData.push(item);
        }
      });
      currentValue =
        this.targetOrder === "unshift"
          ? itemsToBeMoved.concat(currentValue)
          : currentValue.concat(itemsToBeMoved);
      this.$emit("input", currentValue);
      this.$emit("change", currentValue, "right", this.leftChecked);
    },

    clearQuery(which) {
      if (which === "left") {
        this.$refs.leftPanel.query = "";
      } else if (which === "right") {
        this.$refs.rightPanel.query = "";
      }
    },

    search(data) {
      this.$emit("search", data);
    }
  }
};
</script>
<style type="text/css" scoped>
.tree-transfer {
  overflow: hidden;
  width: auto !important;
  height: auto !important;
}
.el-transfer-panel {
  width: 100%;
}
.el-transfer__buttons {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -41px 0 0 -50px;
}
</style>
