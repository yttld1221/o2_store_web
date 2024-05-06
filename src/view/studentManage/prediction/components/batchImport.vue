<template>
  <el-dialog v-model="dialogVisible" title="批量导入" width="450px" class="dialogContainer">
    <div class="dialogBody">
      <steps :active="activeStep"></steps>
      <template v-if="activeStep === '1'">
        <div class="templateContainer">
          <div class="tips">请下载批量操作模板，按照模板要求填写完成后上传导入</div>
          <div class="download" @click="downloadTemplate">
            <svg-icon icon-class="download" />
            <span class="downloadTxt">成绩预测模板下载.xlsx</span>
          </div>
        </div>
        <div class="uploadContainer" v-show="Object.keys(fileList).length === 0">
          <importUpload
              accept=".xls,.xlsx"
              @changeFile="getFiles"
              @successUpload="getSuccessData"
              :ajaxUpload="uploadFile"
              ref="importUploadRef"
              :limit="1"
              :multiple="false"
              :checked="true"
              :maxSize="20"
          >
            <el-button class="uploadBtn" @click="uploaderType('importUpload')">
              <svg-icon icon-class="upload" class="icon"></svg-icon>
              <span class="uploadTxt">上传文件</span>
            </el-button>
          </importUpload>
          <div class="tips">仅支持扩展名为xls和xlsx格式文件</div>
        </div>
        <div class="reUpload" v-show="Object.keys(fileList).length > 0">
          <div class="reUploadTips">
            <svg-icon icon-class="excel" class="icon"></svg-icon>
            <span class="filesName">{{ fileList.name }}</span>
          </div>
          <importUpload
              accept=".xls,.xlsx"
              @changeFile="getFiles"
              @successUpload="getSuccessData"
              :ajaxUpload="uploadFile"
              ref="importReUploadRef"
              :limit="1"
              :multiple="false"
              :checked="true"
              :maxSize="20"
          >
            <el-button class="reUploadBtn" @click="uploaderType('importReUpload')">重新上传</el-button>
          </importUpload>
        </div>
      </template>
      <template v-else>
        <div class="uploadSuccess" v-if=" successFile.failedNum === 0 && successFile.successNum > 0">
          <svg-icon icon-class="sccg" class="icon"></svg-icon>
          <span class="tips">恭喜！共 {{ successFile.successNum }} 条数据，全部完成导入</span>
        </div>
        <div class="uploadError" v-else>
          <div class="tips">
            新增成功数据 <span class="success">{{ successFile.successNum }}</span> 条，新增失败数据 <span class="fail">{{ successFile.failedNum }}</span> 条
          </div>
          <div class="downloadContainer">
            <div class="downloadTips">点击下载错误报告</div>
            <div class="download" @click="errorFile()">
              <svg-icon icon-class="download" />
              <span>{{ getFileName(successFile.errorFileUrl) }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <template #footer>
      <span class="dialogFooter">
        <template v-if="activeStep === '1'">
          <el-button @click="dialogVisible = false" class="cancelBtn">取消</el-button>
          <el-button type="primary" @click="confirmSubmit" class="confirmBtn">确定</el-button>
        </template>
        <el-button
            v-else
            type="primary"
            @click="dialogVisible = false"
            class="confirmBtn"
        >完成</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup name="addBatch">
import steps from "@/components/steps.vue";
import { onMounted, getCurrentInstance, ref } from 'vue';
import { useRouter } from 'vue-router';
import {ElMessage, ElMessageBox} from 'element-plus';
import svgIcon from "@/icons/component/svgIcon.vue";
import importUpload from "@/components/importUpload.vue";
import {downloadFileWithLink, downloadFileWithUrl} from "@/utils/utils";
const { MODE, DEV, VITE_BASE_URL } = import.meta.env;
const router = useRouter();
const _this: any = getCurrentInstance();
const API: any = _this.proxy.$API;
const message: any = _this.proxy.$Message;
let dialogVisible = ref(false);
const importUploadRef = ref(null);
const importReUploadRef = ref(null);
const activeStep = ref('1');

// eslint-disable-next-line no-undef
const props = defineProps({
  // 是否完成
  isComplete: {
    type: Boolean,
    required: true,
    default: () => {
      return false;
    }
  },
})

// 上传成功的文件
const fileList = ref({});
const emit = defineEmits(["uploadFile"]);
const openDialog = () => {
  dialogVisible.value = true;
  activeStep.value = '1';
  fileList.value = {};
}
const closeDialog = () => {
  dialogVisible.value = false;
}

// 区别上传组件
const uploaderName = ref('');
const uploaderType = (type) => {
  uploaderName.value = type;
}

//提交
const confirmSubmit = () => {
  if(fileList.value && Object.keys(fileList.value).length > 0) {
    if(uploaderName.value === "importUpload") {
      importUploadRef.value.uploadFileFn();
    } else if (uploaderName.value === "importReUpload") {
      importReUploadRef.value.uploadFileFn();
    }
  } else {
    ElMessage({
      message: '请选择上传文件',
      type: 'warning',
    })
  }
}

// 成绩导入文件下载
const downloadTemplate = () =>{
  let path = '';
  if ((MODE === 'sit' || MODE === 'development') && DEV) {
    path = '';
  } else {
    path = VITE_BASE_URL;
  }
  downloadFileWithLink(`${path}/download/成绩预测模板.xlsx`, "成绩预测模板");
  // API.student.scoreDownloadTemplate().then(res => {
  //   if(res) {
  //     downloadFileWithUrl(res, '成绩预测模板下载')
  //   }
  // });
}



// 上传文件
const uploadFile = (param) => {
  return API.student.importAnticipateRecord(param).then(res => res);
}

// 清除上传文件
const clearFile = () => {
  if(uploaderName.value === "importUpload") {
    importUploadRef.value.clearFile();
  } else if (uploaderName.value === "importReUpload") {
    importReUploadRef.value.clearFile();
  }
}

//获取文件
const getFiles = (files) => {
  fileList.value = files;
  clearFile();
};


//获取上传成功的文件
const successFile = ref({
  errorFileUrl: "", // 导入失败的数据文件下载
  failedNum: 0, //失败条数
  importData: [], //导入数据
  successNum: 0, //成功条数
});
const getSuccessData = (file) => {
  successFile.value = file;
  emit("uploadFile", file);
}
watch(()=>props.isComplete, (val) => {
  if(val) {
    activeStep.value = '2';
  }
})

//下载错误文件
const errorFile = () => {
  const filename = getFileName(successFile.value.errorFileUrl);
  downloadFileWithLink(successFile.value.errorFileUrl, filename);
}

// 获取错误文件名称
const getFileName = (url) => {
  if(!url) return;
  return url.substring(url.lastIndexOf('/') + 1);
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
      background: #FAFAFA;
      border-radius: 6px 6px 6px 6px;
      opacity: 1;
      width: 100%;
      //display: flex;
      //justify-content: space-between;
      //align-items: center;
      margin-top: 15px;
      padding: 8px;
      .tips {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 25px;
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
          color: #1966FF;
          line-height: 20px;
        }
      }
      .downloadTxt {
        cursor: pointer;
      }
    }
    .uploadContainer {
      margin-top: 15px;
      display: flex;
      align-items: center;
      .uploadBtn {
        background: #FFFFFF;
        opacity: 1;
        border: 1px solid #D9D9D9;
        .icon {
          width: 18px;
          height: 18px;
        }
        .uploadTxt {
          margin-left: 3px;
          font-size: 14px;
          font-family: PingFang SC, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 22px;
        }
      }
      .uploadBtn:hover {
        border-color: #1966FF;
        .uploadTxt {
          color: #1966FF;
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
      margin-top: 15px;
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
      .reUploadBtn {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 400;
        color: #1966FF;
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
      background: #F6FFED;
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
      background: #FAFAFA;
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
          color: #1966FF;
        }
        .fail {
          color: #D55547;
        }
      }
      .downloadContainer {
        font-size: 14px;
        font-family: PingFang SC, PingFang SC;
        line-height: 30px;
        font-weight: 400;
        .downloadTips {
          color: #333333;
        }
        .download {
          cursor: pointer;
          display: flex;
          align-items: center;
          span {
            margin-left: 3px;
            color: #1966FF;
          }
        }
      }
    }
  }
  .dialogFooter {
    .cancelBtn {
      width: 82px;
      height: 32px;
      background: #FFFFFF;
      border-radius: 4px 4px 4px 4px;
      opacity: 1;
      border: 1px solid #D9D9D9;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 22px;

    }
    .confirmBtn {
      width: 82px;
      height: 32px;
      background: #1966FF;
      border-radius: 4px 4px 4px 4px;
      opacity: 1;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 22px;
    }
  }
}
</style>
