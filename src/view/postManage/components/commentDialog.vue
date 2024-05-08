<template>
  <el-dialog
    :close-on-click-modal="false"
    :append-to-body="true"
    :before-close="handleClose"
    v-model="dialogVisible"
    title="评论管理"
    width="70%"
    class="dialogContainer"
  >
    <div class="dialogBody">
      <el-form :model="form" inline style="margin-bottom: 10px">
        <el-form-item label="评论内容" prop="msg">
          <el-input
            style="width: 150px"
            v-model="form.msg"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="上架" prop="is_on">
          <el-select
            v-model="form.is_on"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in onOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="reset()" plain>重置</el-button>
          <el-button type="primary" @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="loading"
        ref="table"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#fafafa', height: '48px' }"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column width="220" prop="msg" label="评论内容" />
        <el-table-column width="170" prop="created_at" label="创建时间" />
        <el-table-column prop="nick_name" label="微信昵称" />
        <el-table-column label="头像">
          <template #default="scope">
            <el-image
              preview-teleported
              style="width: 75px; height: 35px"
              :src="scope.row.avatar_url"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[scope.row.avatar_url]"
              :initial-index="0"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column label="上架">
          <template #default="scope">
            {{ scope.row.is_on == 1 ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              @click="changeOn('上架', scope.row.id)"
              v-if="scope.row.is_on == 2"
              type="primary"
              link
              >上架</el-button
            >
            <el-button
              v-else
              @click="changeOn('下架', scope.row.id)"
              type="primary"
              link
              >下架</el-button
            >
          </template></el-table-column
        >
      </el-table>
      <el-pagination
        :pager-count="2"
        style="justify-content: center; margin-top: 10px"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="pageInfo.pagesize"
        :current-page="pageInfo.page"
        :total="total"
        background
        @current-change="handleCurrentChange"
      />
    </div>
  </el-dialog>
</template>
<script lang="ts" setup name="addBatch">
import { onMounted, getCurrentInstance, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";

const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
const loading = ref(false);
const emit = defineEmits(["changeList"]);
const table = ref();
const tableData = ref([]);
const total = ref(0);
const pageInfo = ref({
  page: 1,
  pagesize: 10,
});
const form = ref({ is_on: 0, msg: "" });
const commentId = ref();

const onOptions = ref([
  { label: "不限", value: 0 },
  { label: "是", value: 1 },
  { label: "否", value: 2 },
]);

const search = () => {
  pageInfo.value.page = 1;
  getList();
};

const reset = () => {
  form.value = { is_on: 0, msg: "" };
  search();
};

// 上下架
const changeOn = (type, id) => {
  ElMessageBox.confirm(`确认${type}该评论？`, `${type}确认`, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    closeOnClickModal: false,
  })
    .then(() => {
      const param = {
        comment_ids: id + "",
        is_on: type == "上架" ? 1 : 2,
      };
      API.post.setCommentUpDown(param).then((res) => {
        ElMessage({
          message: "操作成功",
          type: "success",
        });
        getList();
        emit("changeList");
      });
    })
    .catch(() => {});
};
const getList = () => {
  loading.value = true;
  const params = {
    ...pageInfo.value,
    moments_id: commentId.value,
    ...form.value,
  };
  API.post.getCommentList(params).then((res) => {
    console.log(res);
    loading.value = false;
    tableData.value = res.data;
    total.value = res.count;
  });
};

let dialogVisible = ref(false);
const openDialog = (id) => {
  console.log(id);
  dialogVisible.value = true;
  commentId.value = id;
  getList();
};
const closeDialog = () => {
  dialogVisible.value = false;
};

// eslint-disable-next-line no-undef
defineExpose({
  openDialog,
  closeDialog,
});
</script>

<style lang="scss" scoped>
.dialogContainer {
  .dialogBody {
  }
}
</style>
