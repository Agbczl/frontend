<template>
  <div class="page">
    <!-- 查询区 -->
    <el-form :inline="true" class="query-form">
      <!-- 模块 -->
      <el-form-item label="模块">
        <el-select v-model="query.module" clearable style="width: 140px">
          <el-option label="M1" value="M1" />
          <el-option label="M2" value="M2" />
          <el-option label="M3" value="M3" />
          <el-option label="M4" value="M4" />
          <el-option label="M5" value="M5" />
        </el-select>
      </el-form-item>

      <!-- 分类 -->
      <el-form-item label="类别">
        <el-select
          v-model="query.category"
          clearable
          style="width: 180px"
          :disabled="!categoryOptions.length"
        >
          <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>

      <el-form-item label="标题">
        <el-input v-model="query.title" clearable style="width: 200px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :data="list" border stripe v-loading="loading">
      <el-table-column prop="module" label="模块" width="80" />
      <el-table-column prop="category" label="类别" width="160" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="score" label="分值" width="80" />
      <el-table-column prop="status" label="状态" width="100" />

      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button size="small" type="info" @click="showDetail(row)">详情</el-button>
          <el-button
            v-if="row.status === '待审核'"
            size="small"
            type="danger"
            @click="remove(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 -->
    <el-drawer v-model="detailVisible" title="申报详情" size="40%">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="模块">{{ current.module }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ current.category }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ current.title }}</el-descriptions-item>
        <el-descriptions-item label="分值">{{ current.score }}</el-descriptions-item>

        <el-descriptions-item label="说明">
          <div class="desc">{{ current.description }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="老师意见">
          <span v-if="current.teacherComment">{{ current.teacherComment }}</span>
          <span v-else class="empty">暂无</span>
        </el-descriptions-item>

        <!-- ⭐ 图片 -->
        <el-descriptions-item label="佐证材料">
          <template v-if="currentImages.length">
            <el-image
              v-for="(url, i) in currentImages"
              :key="i"
              :src="url"
              fit="cover"
              :preview-src-list="currentImages"
              class="img"
            />
          </template>
          <span v-else class="empty">暂无材料</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "../api/request";

const BASE_URL = "http://localhost:8080";

/* 模块 → 分类 */
const categoryMap = {
  M1: ["思想品德", "班级测评"],
  M2: ["学习成绩", "创新实践能力", "外语能力"],
  M3: ["体质健康测试", "日常体育锻炼", "体育赛事"],
  M4: ["文化艺术活动", "文化艺术比赛", "文化艺术作品"],
  M5: ["公益劳动", "学生社会工作", "社会实践", "志愿服务"],
};

/* 查询 */
const query = reactive({
  module: "",
  category: "",
  title: "",
});

const categoryOptions = computed(() => categoryMap[query.module] || []);

const list = ref([]);
const loading = ref(false);

/* 详情 */
const detailVisible = ref(false);
const current = reactive({});

const currentImages = computed(() => {
  if (Array.isArray(current.imageList) && current.imageList.length > 0) {
    return current.imageList.map((u) => (u.startsWith("http") ? u : BASE_URL + u));
  }

  if (current.imageListStr) {
    return current.imageListStr
      .split(",")
      .filter(Boolean)
      .map((u) => (u.startsWith("http") ? u : BASE_URL + u));
  }

  return [];
});

const loadData = async () => {
  loading.value = true;
  try {
    const res = await request.get("/stus", { params: query });
    if (res.data.code === 1) {
      list.value = res.data.data || [];
    }
  } finally {
    loading.value = false;
  }
};

const reset = () => {
  query.module = "";
  query.category = "";
  query.title = "";
  loadData();
};

const showDetail = (row) => {
  Object.assign(current, row);
  detailVisible.value = true;
};

const remove = (id) => {
  ElMessageBox.confirm("确认删除？", "提示").then(async () => {
    const res = await request.delete(`/delete/${id}`);
    if (res.data.code === 1) {
      ElMessage.success("删除成功");
      loadData();
    }
  });
};

onMounted(loadData);
</script>

<style scoped>
.page {
  padding: 20px;
}

.img {
  width: 100%;
  max-height: 320px;
  margin-bottom: 12px;
  border-radius: 10px;
}

.desc {
  white-space: pre-wrap;
}

.empty {
  color: #999;
}
</style>
