<template>
  <div class="img-container">
    <div class="img-box" v-if="fileList.length">
      <div class="img-item" v-for="(item, index) in fileList" :key="index">
        <img :src="item.url" alt="" />
        <div class="mask">
          <div class="btn-box">
            <el-icon
              @click="handlePictureCardPreview(item.url)"
              color="#FFFFFF"
              :size="20"
              ><ZoomIn
            /></el-icon>
            <el-icon
              v-if="!['查看', '审核'].includes(type)"
              @click="handleRemove(index)"
              color="#FFFFFF"
              :size="20"
              ><Delete
            /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <el-upload
      v-if="fileList.length < limit"
      :http-request="uploadFiles"
      action
      list-type="picture-card"
      multiple
      :limit="10"
      :show-file-list="false"
      :before-upload="beforeAvatarUpload"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
  </div>
  <el-dialog v-model="dialogVisible">
    <div class="prew-img">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </div>
  </el-dialog>
</template>
<script setup lang='ts'>
import { onMounted, getCurrentInstance, ref, watch } from "vue";
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const fileList = ref([]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

// eslint-disable-next-line no-undef
const props = defineProps({
  limit: {
    type: Number,
    default: 10,
  },
  list: String,
  type: String,
});

// eslint-disable-next-line no-undef
const emit = defineEmits(["uploadChange"]);
onMounted(() => {
  if (props.list) {
    let arr = props.list.split(",");
    fileList.value = arr.map((item) => {
      return {
        name: "",
        url: item,
      };
    });
  } else {
    fileList.value = [];
  }
});
watch(
  () => props.list,
  (newVal) => {
    if (props.list) {
      let arr = props.list.split(",");
      fileList.value = arr.map((item) => {
        return {
          name: "",
          url: item,
        };
      });
    } else {
      fileList.value = [];
    }
  }
);

const uploadFiles = (file) => {
  let formDatas = new FormData();
  formDatas.append("file", file.file);
  API.activity.postFileOss(formDatas).then((res) => {
    fileList.value.push({ name: "", url: res.data.value });
    emit("uploadChange", fileList.value.map((el) => el.url).join(","));
  });
};

// 上传
const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type.indexOf("image/") < 0) {
    ElMessage.error("上传文件格式错误");
    return false;
  }
  return true;
};

const handleRemove = (index) => {
  fileList.value.splice(index, 1);
  emit("uploadChange", fileList.value.map((el) => el.url).join(","));
};

const handlePictureCardPreview = (url) => {
  dialogImageUrl.value = url;
  dialogVisible.value = true;
};
</script>
 
<style lang = "scss" scoped>
.img-container {
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;
}
:deep(.el-upload) {
  width: 148px;
  height: 148px;
}
.img-box {
  display: inline-flex;
  flex-wrap: wrap;
  .img-item {
    position: relative;
    overflow: hidden;
    background-color: #ffffff;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    border-radius: 6px;
    width: 148px;
    height: 148px;
    margin: 0 8px 8px 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .mask {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 1;
      top: 0;
      background: rgba(0, 0, 0, 0.5);
      .btn-box {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-icon {
        margin: 0 8px;
      }
    }
  }
  .img-item:hover {
    .mask {
      display: block;
    }
  }
}

.prew-img {
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>