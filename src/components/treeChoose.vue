<template>
  <div class="tree-choose">
    <el-tree
      default-expand-all
      :default-checked-keys="treeChoose"
      check-strictly
      node-key="id"
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      show-checkbox
      :filter-node-method="filterNode"
      ref="trees"
      @check="clickDeal"
    >
    </el-tree>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chooseList: []
    };
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    treeChoose: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: {
        children: 'childNode',
        label: 'label'
      }
    }
  },
  watch: {
    data: {
      handler(newVal) {},
      deep: true
    },
    treeChoose: {
      handler(newVal) {
        this.chooseList = newVal;
      },
      deep: true
    }
  },
  mounted() {
    this.chooseList = this.treeChoose;
  },

  methods: {
    // 过滤栏
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    clickDeal(currentObj, treeStatus) {
      let currentNode = this.$refs.trees.getNode(currentObj);
      //console.log(currentNode);
      this.commonChoose(currentNode.key, currentNode.checked);
      // 用于：父子节点严格互不关联时，父节点勾选变化时通知子节点同步变化，实现单向关联。
      let selected = treeStatus.checkedKeys.indexOf(currentObj.id); // -1未选中
      // 选中
      if (selected !== -1) {
        // 子节点只要被选中父节点就被选中
        this.selectedParent(currentObj);
        // 统一处理子节点为相同的勾选状态
        this.uniteChildSame(currentObj, true);
      } else {
        // //console.log(currentObj);
        // 未选中 处理子节点全部未选中
        if (currentObj.childNode) {
          this.uniteChildSame(currentObj, false);
        }
        // 当菜单子项全部未选中父项取消勾选
        if (currentNode.level != 1 && currentNode.data.menuType == 1) {
          this.conmonEl(currentNode);
        }
      }
    },
    // 判断当前子节点都未选中,父节点取消选中
    conmonEl(currentNode) {
      let arr = currentNode.parent.childNodes.filter(item => item.checked);
      if (!arr.length) {
        this.commonChoose(currentNode.parent.key, false);
        this.$refs.trees.setChecked(currentNode.parent, false);
        if (currentNode.parent.level != 1) {
          this.conmonEl(currentNode.parent);
        }
      }
    },
    // 同一级子节点
    uniteChildSame(treeList, isSelected) {
      this.$refs.trees.setChecked(treeList.id, isSelected);
      this.commonChoose(treeList.id, isSelected);

      if (treeList.childNode) {
        for (let i = 0; i < treeList.childNode.length; i++) {
          this.uniteChildSame(treeList.childNode[i], isSelected);
        }
      }
    },
    // 未存在id添加,已存在删除再添加并返回
    commonChoose(id, isSelected) {
      for (let i in this.chooseList) {
        if (this.chooseList[i] == id) {
          this.chooseList.splice(i, 1);
          break;
        }
      }
      if (isSelected) {
        this.chooseList.push(id);
      }
      //console.log(this.chooseList);
      this.$emit('chooseTree', { list: this.chooseList });
    },
    // 统一处理父节点为选中
    selectedParent(currentObj) {
      let currentNode = this.$refs.trees.getNode(currentObj);
      //console.log(currentNode);
      this.commonChoose(currentNode.key, currentNode.checked);
      if (currentNode.parent.key !== undefined) {
        this.$refs.trees.setChecked(currentNode.parent, true);
        this.selectedParent(currentNode.parent);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
