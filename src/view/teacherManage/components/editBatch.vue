<template>
  <el-dialog
    :close-on-click-modal="false"
    custom-class="publishDialog"
    :append-to-body="true"
    :before-close="handleClose"
    v-model="dialogVisible"
    title="批量修改"
    width="450px"
    class="dialogContainer"
  >
    <div class="dialogBody">
      <steps :active="activeStep"></steps>
      <template v-if="activeStep == 1">
        <div class="templateContainer">
          <div class="tips">请下载模板，并按照要求填写</div>
          <div class="download" @click="downloadFileWithUrl()">
            <svg-icon icon-class="download" />
            <span>批量修改教师模板.xlsx</span>
          </div>
        </div>
        <div class="uploadContainer" v-if="!fileList.length">
          <el-upload
            action
            :auto-upload="false"
            :before-remove="beforeRemove"
            :limit="1"
            :show-file-list="false"
            accept=".xls,.xlsx"
            :on-exceed="handleExceed"
            :on-change="handleChange"
            :file-list="fileList"
            :multiple="false"
          >
            <el-button>
              <el-icon
                style="margin-bottom: 5px"
                color="#1966FF"
                :size="18"
                class="el-icon--left"
                ><Upload /></el-icon
              >上传文件
            </el-button>
            <template #tip
              ><span class="tips"
                >仅支持扩展名为xls和xlsx格式文件</span
              ></template
            >
          </el-upload>
        </div>
        <div class="reUpload" v-if="fileList.length">
          <div
            class="reUploadTips"
            v-for="(item, index) in fileList"
            :key="index"
          >
            <svg-icon icon-class="excel" class="icon"></svg-icon>
            <span class="filesName">{{ item.name }}</span>
          </div>
          <span class="reload-upload" @click="beforeRemove">重新上传</span>
        </div>
      </template>
      <template v-else>
        <div
          class="uploadSuccess"
          v-if="resultUpload.failedNum == 0 && resultUpload.successNum > 0"
        >
          <svg-icon icon-class="sccg" class="icon"></svg-icon>
          <span class="tips"
            >恭喜！共{{ resultUpload.successNum }}条数据，全部完成导入</span
          >
        </div>
        <div class="uploadError" v-else>
          <div class="tips">
            修改成功数据
            <span class="success">{{ resultUpload.successNum }}</span>
            条，修改失败数据
            <span class="fail">{{ resultUpload.failedNum }}</span> 条
          </div>
          <div class="downloadContainer">
            <div class="downloadTips">点击下载错误报告</div>
            <div class="download" @click="errorFile()">
              <svg-icon icon-class="download" />
              <div class="file-name" v-if="resultUpload.errorFileUrl">
                {{ getFileName() }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template #footer>
      <span class="dialogFooter">
        <template v-if="activeStep == 1">
          <el-button @click="handleClose" class="cancelBtn">取消</el-button>
          <el-button type="primary" @click="confirmSubmit" class="confirmBtn"
            >确定</el-button
          ></template
        >
        <el-button v-else type="primary" @click="handleClose" class="confirmBtn"
          >完成</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="addBatch">
import steps from '@/components/steps.vue';
import { onMounted, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import svgIcon from '@/icons/component/svgIcon.vue';
import { ElLoading } from 'element-plus';
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
let dialogVisible = ref(false);
const activeStep = ref(1);
const openDialog = () => {
  dialogVisible.value = true;
};
const closeDialog = () => {
  dialogVisible.value = false;
};

const beforeRemove = file => {
  fileList.value = [];
};
const handleExceed = (files, fileList) => {
  ElMessage.warning(`单次限制上传单个文件`);
};
const handleChange = file => {
  console.log(file);
  fileList.value = [];
  if (beforeUpload(file)) {
    fileList.value.push({
      name: file.name,
      raw: file.raw
    });
  } else {
    fileList.value = [];
    ElMessage.error(`模板格式错误`);
  }
};

// 下载错误文件
const errorFile = () => {
  window.open(resultUpload.value.errorFileUrl, '_blank');
};

const beforeUpload = file => {
  // 文件上传之前判断文件类型
  console.log(file);
  const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1);
  const whiteList = '.xls,.xlsx'.split(',');
  const isFile = whiteList.indexOf('.' + fileSuffix) !== -1;
  // const isMax = file.size / 1024 / 1024 < 20;
  return isFile;
};


const { MODE, DEV } = import.meta.env;
const downloadFileWithUrl = (fileName = '批量修改教师模板.xlsx') => {
  // 创建一个临时的 Blob URL
  const url =
    MODE == 'development'
      ? '/public/download/批量修改教师模板.xlsx'
      : '/top-talents-web/download/批量修改教师模板.xlsx';
  // 创建一个 <a> 标签用于触发下载
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName; // 设置下载的文件名
  document.body.appendChild(link);
  // 触发下载
  link.click();
  // 清理临时 URL
  URL.revokeObjectURL(url);
  // 移除 <a> 标签
  document.body.removeChild(link);
};

const handleClose = () => {
  fileList.value = [];
  activeStep.value = 1;
  dialogVisible.value = false;
};

const getFileName = () => {
  let str = resultUpload.value.errorFileUrl;
  return str.substring(str.lastIndexOf('/') + 1);
};

const resultUpload = ref({});
const emit = defineEmits(['success-upload']);
//提交
const confirmSubmit = () => {
  console.log(fileList.value);
  if (!fileList.value.length) {
    ElMessage.error('请上传文件');
    return;
  }
  const loading = ElLoading.service({
    target: '.publishDialog',
    lock: true,
    text: '上传中'
  });
  var fd = new FormData();
  // 文件对象
  fd.append('file', fileList.value[0].raw);
  console.log(fileList.value[0].raw);
  API.teacher
    .batchUpdate(fd)
    .then(res => {
      console.log(res);
      loading.close();
      activeStep.value = 2;
      resultUpload.value = res;
      if (resultUpload.value.successNum > 0) {
        emit('success-upload');
        if (resultUpload.value.failedNum == 0) {
          ElMessage.success('修改成功');
        }
      }
    })
    .catch(() => {
      loading.close();
    });
};

//获取文件
let fileList = ref([]);
const getFiles = files => {
  fileList.value = files;
};

//上传文件
let uploadLoading = ref(false);
const handelUploadChange = e => {
  uploadLoading.value = e;
};
// eslint-disable-next-line no-undef
defineExpose({
  openDialog,
  closeDialog
});
</script>

<style lang="scss" scoped>
.dialogContainer {
  .dialogBody {
    .templateContainer {
      background: #fafafa;
      border-radius: 6px 6px 6px 6px;
      opacity: 1;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      padding: 8px;
      .tips {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
      .download {
        display: flex;
        align-items: center;
        cursor: pointer;
        .svg-icon {
          width: 14px;
          height: 14px;
        }
        span {
          margin-left: 3px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #1966ff;
          line-height: 20px;
        }
      }
    }
    .uploadContainer {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .uploadBtn {
        background: #ffffff;
        opacity: 1;
        border: 1px solid #d9d9d9;
        .uploadTxt {
          margin-left: 3px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
        }
      }
      .tips {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #999999;
        line-height: 18px;
        margin-left: 10px;
      }
    }
    .reUpload {
      margin-top: 20px;
      display: flex;
      align-items: center;
      .reUploadTips {
        .icon {
          width: 32px;
          height: 32px;
        }
        .filesName {
          margin-left: 4px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
        }
      }
      .reload-upload {
        cursor: pointer;
        margin-top: -2px;
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #1966ff;
        margin-left: 20px;
      }
      .reUploadBtn {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #1966ff;
        line-height: 20px;
        border: none;
        background-color: #fff;
        margin-left: 10px;
      }
    }
    .uploadSuccess {
      margin-top: 15px;
      display: flex;
      align-items: center;
      background: #f6ffed;
      padding: 10px;
      .icon {
        width: 16px;
        height: 16px;
      }
      .tips {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
        margin-left: 5px;
      }
    }
    .uploadError {
      margin-top: 15px;
      background: #fafafa;
      border-radius: 4px 4px 4px 4px;
      opacity: 1;
      padding: 15px;
      .tips {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 25px;
        .success {
          color: #1966ff;
        }
        .fail {
          color: #d55547;
        }
      }
      .downloadContainer {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        line-height: 25px;
        font-weight: 400;
        .downloadTips {
          color: #333333;
          margin: 6px 0;
        }
        .download {
          cursor: pointer;
          display: flex;
          align-items: center;
          .file-name {
            width: calc(100% - 20px);
            margin-left: 4px;
            color: #1966ff;
            overflow: hidden; //超出的文本隐藏
            text-overflow: ellipsis; //溢出用省略号显示
            white-space: nowrap; // 默认不换行；
          }
        }
      }
    }
  }
  .dialogFooter {
    .cancelBtn {
      width: 82px;
      height: 32px;
      background: #ffffff;
      border-radius: 4px 4px 4px 4px;
      opacity: 1;
      border: 1px solid #d9d9d9;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 22px;
    }
    .confirmBtn {
      width: 82px;
      height: 32px;
      background: #1966ff;
      border-radius: 4px 4px 4px 4px;
      opacity: 1;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 22px;
    }
  }
}
</style>
