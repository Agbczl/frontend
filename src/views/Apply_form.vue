<template>
  <div class="apply-form">
    <h2 class="title">新增综测加分申报</h2>

    <el-form label-width="120px">
      <!-- 模块 -->
      <el-form-item label="所属模块" required>
        <el-select v-model="form.module" placeholder="请选择模块" style="width: 100%">
          <el-option label="M1 思想品德" value="M1" />
          <el-option label="M2 学业发展" value="M2" />
          <el-option label="M3 体育健康" value="M3" />
          <el-option label="M4 文化艺术" value="M4" />
          <el-option label="M5 社会服务" value="M5" />
        </el-select>
      </el-form-item>

      <!-- 分类 -->
      <el-form-item label="加分类别" required>
        <el-select
          v-model="form.category"
          placeholder="请选择类别"
          style="width: 100%"
          :disabled="!categoryOptions.length"
        >
          <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <!-- 标题 -->
      <el-form-item label="申报标题" required>
        <el-input v-model="form.title" placeholder="请输入申报标题" />
      </el-form-item>

      <!-- 分值 -->
      <el-form-item label="申请分值">
        <el-input-number v-model="form.score" :min="0" :max="10" />
      </el-form-item>

      <!-- 说明 -->
      <el-form-item label="项目说明">
        <el-input
          v-model="form.description"
          type="textarea"
          rows="4"
          placeholder="请填写项目说明"
        />
      </el-form-item>

      <!-- 佐证材料（⚠️ 原逻辑完整保留） -->
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

      <!-- 操作 -->
      <el-form-item>
        <el-button type="primary" :loading="submitting" @click="submit"> 提交申报 </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";
import request from "../api/request";

const router = useRouter();

/* ================= 上传状态（原逻辑） ================= */

const fileList = ref([]);
const uploading = ref(false);
const submitting = ref(false);

/* ================= 表单数据（⚠️ imageList 必须一直存在） ================= */

const form = reactive({
  title: "",
  module: "",
  category: "",
  score: 0,
  description: "",
  imageList: [], // ⭐ 关键：不能删、不能替换
});

/* ================= 分类映射 ================= */

const categoryMap = {
  M1: ["思想品德", "班级测评"],
  M2: ["学习成绩", "创新实践能力", "外语能力"],
  M3: ["体质健康测试", "日常体育锻炼", "体育赛事"],
  M4: ["文化艺术活动", "文化艺术比赛", "文化艺术作品"],
  M5: ["公益劳动", "学生社会工作", "社会实践", "志愿服务"],
};

const categoryOptions = computed(() => {
  return categoryMap[form.module] || [];
});

/* ================= 上传相关（⚠️ 原逻辑未改） ================= */

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

  uploading.value = true;
  return true;
};

const handleUploadSuccess = (response, file) => {
  uploading.value = false;

  if (response?.code !== 1 || !Array.isArray(response.data)) {
    ElMessage.error("图片上传失败");
    return;
  }

  response.data.forEach((url) => {
    if (!form.imageList.includes(url)) {
      form.imageList.push(url);
      fileList.value.push({
        name: file.name,
        url,
      });
    }
  });
};

const handleUploadError = () => {
  uploading.value = false;
  ElMessage.error("图片上传失败，请重试");
};

const handleRemove = (file) => {
  const url = file.url;
  form.imageList = form.imageList.filter((item) => item !== url);
};

/* ================= 表单操作 ================= */

const reset = () => {
  form.title = "";
  form.module = "";
  form.category = "";
  form.score = 0;
  form.description = "";
  form.imageList.length = 0; // ⭐ 正确清空方式
  fileList.value = [];
};

const submit = async () => {
  if (!form.module || !form.category || !form.title) {
    ElMessage.warning("请填写完整信息");
    return;
  }

  if (uploading.value) {
    ElMessage.warning("图片正在上传，请稍候");
    return;
  }

  submitting.value = true;
  try {
    await request.put("/insert", form);
    ElMessage.success("申报提交成功");
    router.replace("/apply");
  } catch {
    ElMessage.error("提交失败");
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
