<template>
  <div class="page">
    <!-- 查询区 -->
    <el-form :inline="true" class="query-form">
      <el-form-item label="学生姓名">
        <el-input v-model="query.username" clearable style="width: 180px" />
      </el-form-item>

      <el-form-item label="状态">
        <el-select v-model="query.status" clearable style="width: 160px">
          <el-option label="待审核" value="待审核" />
          <el-option label="已通过" value="已通过" />
          <el-option label="已驳回" value="已驳回" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="username" label="学生姓名" width="120" />
      <el-table-column prop="major" label="专业" width="160" />
      <el-table-column prop="title" label="申报项目" />
      <el-table-column prop="category" label="类别" width="120" />
      <el-table-column prop="score" label="分值" width="80" />

      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag
            :type="
              row.status === '待审核' ? 'warning' : row.status === '已通过' ? 'success' : 'danger'
            "
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="提交时间" width="180" />

      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button size="small" @click="showDetail(row)">详情</el-button>

          <el-button
            v-if="row.status === '待审核'"
            size="small"
            type="primary"
            @click="openReview(row)"
          >
            审核
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 Drawer -->
    <el-drawer v-model="detailVisible" title="申报详情" size="45%">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="学生姓名">{{ current.username }}</el-descriptions-item>
        <el-descriptions-item label="专业">{{ current.major }}</el-descriptions-item>
        <el-descriptions-item label="申报项目">{{ current.title }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ current.category }}</el-descriptions-item>
        <el-descriptions-item label="分值">{{ current.score }}</el-descriptions-item>

        <el-descriptions-item label="说明">
          <div class="desc">{{ current.description }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="佐证材料">
          <template v-if="imageList.length">
            <el-image
              v-for="(url, i) in imageList"
              :key="i"
              :src="url"
              class="material-img"
              fit="contain"
              :preview-src-list="imageList"
              preview-teleported
            />
          </template>
          <span v-else class="empty">暂无材料</span>
        </el-descriptions-item>

        <el-descriptions-item label="教师意见">
          <span>{{ current.teacherComment || "暂无教师意见" }}</span>
        </el-descriptions-item>

        <el-descriptions-item label="状态">{{ current.status }}</el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <!-- 审核弹窗 -->
    <el-dialog v-model="reviewVisible" title="审核申报" width="520px">
      <el-form :model="reviewForm" label-width="90px">
        <el-form-item label="审核结果">
          <el-radio-group v-model="reviewForm.status">
            <el-radio label="已通过">通过</el-radio>
            <el-radio label="已驳回">驳回</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="教师意见">
          <el-input
            v-model="reviewForm.teacherComment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见（可选）"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReview">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import request from "../api/request";

const query = reactive({ username: "", status: "" });
const list = ref([]);
const loading = ref(false);

const detailVisible = ref(false);
const reviewVisible = ref(false);

const current = reactive({});

const reviewForm = reactive({
  id: null,
  status: "已通过",
  teacherComment: "",
});

const BASE_URL = "http://localhost:8080";

const imageList = computed(() => {
  if (Array.isArray(current.imageList) && current.imageList.length > 0) {
    return current.imageList.map((url) => (url.startsWith("http") ? url : BASE_URL + url));
  }

  if (current.imageListStr) {
    return current.imageListStr
      .split(",")
      .filter(Boolean)
      .map((url) => (url.startsWith("http") ? url : BASE_URL + url));
  }

  return [];
});

const loadData = async () => {
  loading.value = true;
  try {
    const res = await request.get("/list", { params: query });
    if (res.data.code === 1) {
      list.value = res.data.data || [];
    }
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  query.username = "";
  query.status = "";
  loadData();
};

const showDetail = (row) => {
  Object.assign(current, {
    ...row,
    imageList: Array.isArray(row.imageList) ? row.imageList : [],
    imageListStr: row.imageListStr || null,
    teacherComment: row.teacherComment || "",
  });
  detailVisible.value = true;
};

const openReview = (row) => {
  reviewForm.id = row.id;
  reviewForm.status = "已通过";
  reviewForm.teacherComment = "";
  reviewVisible.value = true;
};

const submitReview = async () => {
  const res = await request.put("/review", reviewForm);
  if (res.data.code === 1) {
    ElMessage.success("审核成功");
    reviewVisible.value = false;
    loadData();
  } else {
    ElMessage.error(res.data.msg || "审核失败");
  }
};

onMounted(loadData);
</script>

<style scoped>
.page {
  padding: 18px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
}

.material-img {
  width: 100%;
  max-height: 520px;
  margin-bottom: 16px;
  border-radius: 12px;
  background: #fafafa;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.desc {
  white-space: pre-wrap;
}

.empty {
  color: #999;
}
</style>
