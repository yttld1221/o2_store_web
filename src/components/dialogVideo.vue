<template>
  <div class="dialog-video">
    <el-dialog
      :close-on-click-modal="false"
      center
      title="视频预览"
      v-model="dialogVisible"
      width="40%"
      :before-close="dialogClose"
    >
      <video
        :src="videoSrc"
        controls="controls"
        width="100%"
        height="400"
      ></video>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      videoSrc: "",
    };
  },

  mounted() {},

  methods: {
    open(url) {
      this.dialogVisible = true;
      this.videoSrc = url;
    },
    dialogClose() {
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-video {
}
</style>