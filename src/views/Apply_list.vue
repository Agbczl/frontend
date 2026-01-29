<template>
  <div class="page">
    <!-- 查询区 -->
    <el-form :inline="true" class="query-form">
      <el-form-item label="类别">
        <el-select v-model="query.category" placeholder="请选择类别" clearable style="width: 160px">
          <el-option label="竞赛获奖" value="竞赛获奖" />
          <el-option label="社会实践" value="社会实践" />
          <el-option label="科研项目" value="科研项目" />
        </el-select>
      </el-form-item>

      <el-form-item label="标题">
        <el-input v-model="query.title" placeholder="请输入标题" clearable style="width: 200px" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="loadData">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      :data="list"
      border
      stripe
      v-loading="loading"
      style="width: 100%"
      header-cell-class-name="table-header"
      cell-class-name="table-cell"
    >
      <el-table-column prop="category" label="类别" width="120" />
      <el-table-column prop="title" label="标题" />
      <el-table-column prop="score" label="分值" width="80" />
      <el-table-column prop="status" label="状态" width="100" />

      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <el-button size="small" @click="showDetail(row)" type="info">详情</el-button>

          <el-button v-if="row.status === '待审核'" size="small" type="primary" @click="edit(row)">
            编辑
          </el-button>

          <el-button
            v-if="row.status === '待审核' || row.status === '已通过'"
            size="small"
            type="danger"
            @click="remove(row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情 Drawer -->
    <el-drawer v-model="detailVisible" title="申报详情" size="40%">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="类别">{{ current.category }}</el-descriptions-item>
        <el-descriptions-item label="标题">{{ current.title }}</el-descriptions-item>
        <el-descriptions-item label="分值">{{ current.score }}</el-descriptions-item>

        <el-descriptions-item label="描述">
          <div class="description-text">{{ current.description }}</div>
        </el-descriptions-item>

        <el-descriptions-item label="状态">{{ current.status }}</el-descriptions-item>
        <el-descriptions-item label="老师意见">
          <template v-if="current.teacherComment">
            <div class="teacher-comment">
              {{ current.teacherComment }}
            </div>
          </template>
          <el-empty v-else description="暂无老师意见" :image-size="60" />
        </el-descriptions-item>

        <!-- ⭐ 新增：佐证材料 -->
        <el-descriptions-item label="佐证材料">
          <template v-if="currentImages.length > 0">
            <div class="image-container">
              <el-image
                v-for="(url, index) in currentImages"
                :key="index"
                :src="url"
                fit="cover"
                :preview-src-list="currentImages"
                preview-teleported
                class="preview-image"
              />
            </div>
          </template>

          <el-empty v-else description="暂无上传材料" :image-size="80" />
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>

    <!-- 编辑 Dialog -->
    <el-dialog v-model="editVisible" title="编辑申报" width="600px" destroy-on-close>
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="类别">
          <el-select v-model="editForm.category" style="width: 100%">
            <el-option label="竞赛获奖" value="竞赛获奖" />
            <el-option label="社会实践" value="社会实践" />
            <el-option label="科研项目" value="科研项目" />
          </el-select>
        </el-form-item>

        <el-form-item label="标题">
          <el-input v-model="editForm.title" placeholder="请输入标题" />
        </el-form-item>

        <el-form-item label="分值">
          <el-input-number
            v-model="editForm.score"
            :min="0"
            :max="100"
            placeholder="请输入分值"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="描述">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入详细描述..."
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="submitEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import request from "../api/request";
import { computed } from "vue";

const BASE_URL = import.meta.env.VITE_BASE_API || "http://localhost:8080";

/* 详情图片兜底 */
const currentImages = computed(() => {
  if (!Array.isArray(current.imageList)) return [];

  return current.imageList.filter(Boolean).map((url) => {
    // 已经是 http(s) 开头，直接用
    if (url.startsWith("http")) return url;

    // 否则拼接后端地址
    return BASE_URL + (url.startsWith("/") ? url : "/" + url);
  });
});

/* 查询条件 */
const query = reactive({
  category: "",
  title: "",
});

/* 列表数据 */
const list = ref([]);
const loading = ref(false);

/* 详情 */
const detailVisible = ref(false);
const current = reactive({});

/* 编辑 */
const editVisible = ref(false);
const editForm = reactive({
  id: null,
  category: "",
  title: "",
  score: null,
  description: "",
});

/* 加载列表 */
const loadData = async () => {
  loading.value = true;
  try {
    const res = await request.get("/stus", {
      params: {
        category: query.category || null,
        title: query.title || null,
      },
    });
    if (res.data.code === 1) {
      list.value = res.data.data || [];
    } else {
      ElMessage.error(res.data.msg || "查询失败");
      list.value = [];
    }
  } catch {
    ElMessage.error("请求失败");
  } finally {
    loading.value = false;
  }
};

/* 重置 */
const reset = () => {
  query.category = "";
  query.title = "";
  loadData();
};

/* 详情 */
const showDetail = (row) => {
  Object.assign(current, {
    ...row,
    imageList: Array.isArray(row.imageList) ? row.imageList : [],
    teacherComment: row.teacherComment || "",
  });
  detailVisible.value = true;
};

const edit = async (row) => {
  if (!row?.id) {
    ElMessage.error("参数错误，id 不存在");
    return;
  }

  try {
    const res = await request.get(`/${row.id}`);
    if (res.data.code === 1) {
      Object.assign(editForm, res.data.data);
      editVisible.value = true;
    } else {
      ElMessage.error(res.data.msg || "查询失败");
    }
  } catch (e) {
    console.error("编辑查询异常：", e);
    ElMessage.error("请求失败");
  }
};

/* 提交更新 */
const submitEdit = async () => {
  if (!editForm.title.trim()) {
    ElMessage.warning("请输入标题");
    return;
  }
  if (editForm.score === null || editForm.score < 0) {
    ElMessage.warning("请输入有效的分值");
    return;
  }

  try {
    const res = await request.put("/update", editForm);
    if (res.data.code === 1) {
      ElMessage.success("更新成功");
      editVisible.value = false;
      loadData();
    } else {
      ElMessage.error(res.data.msg || "更新失败");
    }
  } catch {
    ElMessage.error("请求失败");
  }
};

/* 删除 */
const remove = (id) => {
  if (!id) {
    ElMessage.error("参数错误，id 为空");
    return;
  }

  ElMessageBox.confirm("确认删除该申报？删除后无法恢复！", "警告", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const res = await request.delete(`/delete/${id}`);
        if (res.data.code === 1) {
          ElMessage.success("删除成功");
          loadData();
        } else {
          ElMessage.error(res.data.msg || "删除失败");
        }
      } catch (e) {
        console.error("删除异常：", e);
        ElMessage.error("请求异常");
      }
    })
    .catch(() => {
      /* 用户取消 */
    });
};

onMounted(loadData);
</script>

<style scoped>
/* 老师意见样式 */
.teacher-comment {
  padding: 10px 14px;
  background-color: #f0f7ff;
  border-left: 4px solid #67c23a;
  border-radius: 0 6px 6px 0;
  line-height: 1.6;
  color: #2c3e50;
  white-space: pre-wrap;
}

.page {
  padding: 20px;
  min-height: calc(100vh - 40px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.query-form {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 表格美化 */
.table-header {
  background-color: #f8f9fc !important;
  font-weight: 600;
  color: #34495e;
}

.table-cell {
  transition: background-color 0.2s ease;
}

/* 描述文本美化 */
.description-text {
  padding: 8px 12px;
  background-color: #f8f9fc;
  border-left: 4px solid #409eff;
  border-radius: 0 4px 4px 0;
  line-height: 1.6;
  color: #5a6c7d;
  white-space: pre-wrap;
}

/* 图片容器美化 */
.image-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.preview-image {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  cursor: pointer;
  object-fit: cover;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.preview-image:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #409eff;
}

/* 对话框输入框美化 */
:deep(.el-dialog__body) .el-form-item__content {
  align-items: flex-start;
}

/* 详情抽屉描述项美化 */
:deep(.el-descriptions__label) {
  font-weight: 600;
  color: #2c3e50;
}

:deep(.el-descriptions__content) {
  color: #5a6c7d;
}

/* 按钮美化 */
.el-button--small {
  padding: 6px 12px;
  font-size: 13px;
}
</style>
