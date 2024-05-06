<template>
  <div class="upload-content">
    <el-upload
      ref="uploadRef"
      v-bind="$attrs"
      :accept="accept"
      :multiple="true"
      :limit="limit"
      :show-file-list="false"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :http-request="uploadChange"
      :before-upload="beforeAvatarUpload"
      class="upload-demo"
    >
      <template v-slot:default>
        <slot name="default"></slot>
      </template>
      <template v-slot:trigger v-if="$slots.trigger">
        <slot name="trigger"></slot>
      </template>
      <template v-slot:tip>
        <slot name="tip"></slot>
      </template>
      <template v-slot:file="{ file }">
        <slot name="file" :file="file"></slot>
      </template>
    </el-upload>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch } from "vue";
import { isMax, isValid } from "@/utils/utils";

import {ElLoading, ElMessage} from "element-plus";
let props = defineProps({
  // 上传文件接口函数
  ajaxUpload: {
    type: Function,
    required: true,
    default: () => {
      return () => {};
    }
  },
  // 上传文件个数限制
  limit: {
    type: Number,
    default: 20
  },
  // 编辑时已存在的文件
  files: {
    type: Array,
    default: () => []
  },
  checked: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: ""
  },
  maxSize: {
    type: Number,
    default: 1024
  }
});
const emit = defineEmits(["changeFile", "changeFiles", "successUpload"]);

const { proxy } = getCurrentInstance();
const API = proxy.$API;
const uploadRef = ref(null);
const fileListArr = ref([]);


const beforeAvatarUpload = (rawFile) => {
  if (props.checked) {
    let acceptArr = [];
    if (props.accept != "") {
      acceptArr = props.accept.split(",");
    }
    if (!isValid(rawFile, acceptArr)) {
      // eslint-disable-next-line no-undef
      ElMessage({
        type: "error",
        message: "上传文件格式有误"
      });
      return false;
    }
    if (!isMax(rawFile, props.maxSize)) {
      ElMessage.error(`文件大小不超过${props.maxSize}M!`);
      return false;
    }
    return true;
  } else {
    return true;
  }
};
const handleExceed = () => {
  ElMessage.warning(`最多只能上传${props.limit}个附件！`);
};

// 上传文件切换
const fileData = reactive({
  uploadFile: {},
  uploadFiles: []
})
const handleChange = (file, files) => {
  fileData.uploadFile = file;
  fileData.uploadFiles = files;
  emit("changeFile", { fileData: file, name: file.name });
  emit("changeFiles", { filesData: files });
}

const uploadChange = (file) => {
  fileListArr.value.push(file.file);
};

// 上传文件方法
const uploadFileFn = () => {
  let fileList = null;
  if(props.limit === 1) {
    fileList = fileData.uploadFile;
  } else {
    fileList = fileData.uploadFiles;
  }
  if(fileList && (Object.keys(fileList).length === 0 || fileList.length === 0)) {
    ElMessage.warning("请选择上传文件");
    return false
  }
  const loading = ElLoading.service({
    target: '.publishDialog',
    lock: true,
    text: '上传中'
  });

  const fd = new FormData();
  let uploadFn = props.ajaxUpload;
  //func判非空并执行
  let filePromise = uploadFn && uploadFn(fd);
  fd.append('file', fileList.raw);

  //promise接收返回值
  if (filePromise && typeof filePromise.then == 'function') {
    Promise.all([filePromise])
        .then(res => {
          emit("successUpload", res[0]);
          loading.close();
        }).catch(e => {
      //ElMessage.error("上传失败，请稍后重试");
      loading.close();
    });
  }
}


// 删除指定上传文件
const deleteFile = (index) => {
  if (fileListArr.value.length > 0) {
    uploadRef.value.handleRemove(fileListArr.value[index]);
  }
};

//清除上传文件
const clearFile = () => {
  fileListArr.value = [];
  uploadRef.value.clearFiles();
};

// eslint-disable-next-line no-undef
defineExpose({
  deleteFile,
  clearFile,
  uploadFileFn
});
</script>

<style lang="scss" scoped>
.upload-demo {

}

.limit {
  margin-left: 5px;
  font-size: 14px;
  font-weight: 400;
  color: #b7b7b7;
  line-height: 22px;
}
:deep(.el-upload-list) {
  max-height: 200px !important;
  overflow: auto;
}

.upload-btn {
  display: inline-block;
  width: 95px;
  height: 32px;
  line-height: 32px;
  background: #ffffff;
  border-radius: 4px;
  opacity: 1;
  border: 1px solid #2f7fff;
  text-align: center;
  color: #2f7fff;
}

.svgIconBox {
  margin-right: 3px;
}
</style>
