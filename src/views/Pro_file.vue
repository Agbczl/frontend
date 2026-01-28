<template>
  <div class="profile-page">
    <div class="profile-card">
      <!-- 左侧身份区 -->
      <div class="left">
        <el-avatar :size="96" icon="UserFilled" />
        <h3 class="name">{{ user.name }}</h3>

        <p class="account" v-if="accountLabel">{{ accountLabel }}：{{ user.account }}</p>

        <el-tag :type="user.role === 'student' ? 'info' : 'success'">
          {{ roleText }}
        </el-tag>
      </div>

      <!-- 右侧信息区 -->
      <div class="right">
        <el-descriptions title="个人信息" :column="1" border>
          <el-descriptions-item label="姓名">
            {{ user.name }}
          </el-descriptions-item>

          <el-descriptions-item v-if="accountLabel" :label="accountLabel">
            {{ user.account }}
          </el-descriptions-item>

          <!-- 学生专属 -->
          <el-descriptions-item v-if="user.role === 'student'" label="专业">
            {{ user.major || "—" }}
          </el-descriptions-item>

          <el-descriptions-item v-if="user.role === 'student'" label="年级">
            {{ user.grade || "—" }}
          </el-descriptions-item>

          <!-- 教师专属 -->
          <el-descriptions-item v-if="user.role === 'teacher'" label="职称">
            {{ user.title || "—" }}
          </el-descriptions-item>

          <el-descriptions-item label="角色">
            {{ roleText }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 操作区 -->
        <div class="actions">
          <el-button type="primary" @click="changePassword"> 修改密码 </el-button>
          <el-button type="danger" @click="logout"> 退出登录 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";

const router = useRouter();

/**
 * 实际项目中：
 * 这里直接换成接口 /me
 */
const role = localStorage.getItem("role") || "student";
const username = localStorage.getItem("username") || "";

const user = reactive({
  name: role === "teacher" ? "教师用户" : "学生用户",
  role,
  account: username,

  // 学生字段
  major: role === "student" ? "计算机科学与技术" : "",
  grade: role === "student" ? "2024级" : "",

  // 教师字段
  title: role === "teacher" ? "讲师" : "",
});

/** 学号 / 工号标签 */
const accountLabel = computed(() => {
  if (user.role === "student") return "学号";
  if (user.role === "teacher") return "工号";
  return "";
});

/** 身份文本 */
const roleText = computed(() => {
  return user.role === "student" ? "学生" : "教师";
});

const changePassword = () => {
  ElMessage.info("修改密码功能待接入后端");
};

const logout = () => {
  ElMessageBox.confirm("确认退出登录？", "提示", {
    type: "warning",
  }).then(() => {
    localStorage.clear();
    router.replace("/login");
  });
};
</script>

<style scoped>
/* 页面容器（不挡侧边栏） */
.profile-page {
  display: flex;
  justify-content: center;
}

/* 主卡片 */
.profile-card {
  display: flex;
  gap: 40px;

  width: 900px;
  padding: 28px;

  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);

  border-radius: 16px;
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

/* 左侧 */
.left {
  width: 220px;
  text-align: center;
}

.name {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 600;
}

.account {
  margin: 8px 0;
  color: #666;
}

/* 右侧 */
.right {
  flex: 1;
}

/* 操作按钮 */
.actions {
  margin-top: 24px;
  display: flex;
  gap: 16px;
}
</style>
