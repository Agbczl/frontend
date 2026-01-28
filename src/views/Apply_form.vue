<template>
  <div class="apply-form">
    <h2 class="title">新增综测加分申报</h2>

    <el-form label-width="120px">
      <el-form-item label="申报标题" required>
        <el-input v-model="form.title" placeholder="请输入申报标题" />
      </el-form-item>

      <el-form-item label="加分类别" required>
        <el-select v-model="form.category" placeholder="请选择类别" style="width: 100%">
          <el-option label="竞赛获奖" value="竞赛获奖" />
          <el-option label="科研项目" value="科研项目" />
          <el-option label="社会实践" value="社会实践" />
        </el-select>
      </el-form-item>

      <el-form-item label="申请分值">
        <el-input-number v-model="form.score" :min="0" :max="10" />
      </el-form-item>

      <el-form-item label="项目说明">
        <el-input
          v-model="form.description"
          type="textarea"
          rows="4"
          placeholder="请填写项目说明"
        />
      </el-form-item>

      <el-form-item label="佐证材料">
        <el-upload
          action="http://localhost:8080/upload"
          name="imageList"
          list-type="picture-card"
          multiple
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="submitting" @click="submit"> 提交申报 </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import request from "../api/request";

const router = useRouter();

/* ================= 状态控制 ================= */

// el-upload 展示用
const fileList = ref([]);

// 是否正在上传图片
const uploading = ref(false);

// 是否正在提交表单
const submitting = ref(false);

/* ================= 表单数据 ================= */

const form = reactive({
  title: "",
  category: "",
  score: 0,
  description: "",
  imageList: [], // ⭐最终提交给后端的图片路径数组
});

/* ================= 上传相关 ================= */

// 上传前
const beforeUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error("只能上传图片文件");
    return false;
  }
  if (!isLt5M) {
    ElMessage.error("图片大小不能超过 5MB");
    return false;
  }

  return true;
};

// 上传成功
const handleUploadSuccess = (response, file) => {
  uploading.value = false;

  if (response?.code !== 1 || !Array.isArray(response.data)) {
    ElMessage.error("图片上传失败");
    return;
  }

  response.data.forEach((url) => {
    // 防止重复
    if (!form.imageList.includes(url)) {
      form.imageList.push(url);
      fileList.value.push({
        name: file.name,
        url,
      });
    }
  });
};

// 上传失败
const handleUploadError = () => {
  uploading.value = false;
  ElMessage.error("图片上传失败，请重试");
};

// 删除图片
const handleRemove = (file) => {
  const url = file.url;
  form.imageList = form.imageList.filter((item) => item !== url);
};

/* ================= 表单操作 ================= */

const reset = () => {
  form.title = "";
  form.category = "";
  form.score = 0;
  form.description = "";
  form.imageList = [];
  fileList.value = [];
};

const submit = async () => {
  if (!form.title || !form.category) {
    ElMessage.warning("请填写完整信息");
    return;
  }

  if (uploading.value) {
    ElMessage.warning("图片正在上传，请等待上传完成");
    return;
  }

  submitting.value = true;

  try {
    await request.put("/insert", form);
    ElMessage.success("申报提交成功");
    router.replace("/apply");
  } catch (e) {
    ElMessage.error("提交失败，请重试");
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.apply-form {
  max-width: 720px;
  margin: 40px auto;
  padding: 28px;

  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(10px);
  border-radius: 14px;

  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

.title {
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 600;
}
</style>
