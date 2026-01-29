<template>
  <div class="profile-page">
    <div class="profile-card">
      <!-- 左侧身份区 -->
      <div class="left">
        <el-avatar :size="96" icon="UserFilled" class="avatar" />
        <h3 class="name">{{ user.name }}</h3>

        <!-- ✅ 已移除：不再显示 account（学号/工号） -->

        <el-tag :type="user.role === 'student' ? 'info' : 'success'" class="role-tag">
          {{ roleText }}
        </el-tag>
      </div>

      <!-- 右侧信息区 -->
      <div class="right">
        <el-descriptions title="个人信息" :column="1" border>
          <el-descriptions-item label="姓名">
            {{ user.name }}
          </el-descriptions-item>

          <!-- 学生专属 -->
          <el-descriptions-item v-if="user.role === 'student'" label="专业">
            {{ user.major || "—" }}
          </el-descriptions-item>

          <el-descriptions-item v-if="user.role === 'student'" label="年级">
            {{ user.grade || "—" }}
          </el-descriptions-item>

          <el-descriptions-item label="角色">
            {{ roleText }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 操作区 -->
        <div class="actions">
          <el-button type="primary" @click="changePassword" class="action-btn">
            修改密码
          </el-button>
          <el-button type="danger" @click="logout" class="action-btn"> 退出登录 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";
import request from "../api/request";

const router = useRouter();

/** 当前登录用户（真实数据） */
const user = reactive({
  name: "",
  role: "",
  account: "", // 保留数据但不显示
  major: "",
  grade: "",
  title: "",
});

/** 从后端加载 */
const loadUser = async () => {
  const res = await request.get("/me");
  if (res.data.code === 1) {
    const u = res.data.data;

    user.name = u.username;
    user.role = u.role;
    user.account = u.username; // 数据仍会加载，但前端不渲染

    user.major = u.major;
    user.grade = u.grade;
    user.title = u.title;
  }
};

onMounted(loadUser);

/** 标签（已不再用于显示，但保留计算属性以防他用） */
const accountLabel = computed(() => {
  if (user.role === "student") return "学号";
  if (user.role === "teacher") return "工号";
  return "";
});

const roleText = computed(() => {
  return user.role === "student" ? "学生" : "教师";
});

const logout = () => {
  ElMessageBox.confirm("确认退出登录？", "提示").then(() => {
    localStorage.clear();
    router.replace("/login");
  });
};

// 占位函数（您可能已有实现）
const changePassword = () => {
  // TODO: 实现修改密码逻辑
};
</script>

<style scoped>
/* 页面容器（不挡侧边栏） */
.profile-page {
  display: flex;
  justify-content: center;
  padding: 24px;
}

/* 主卡片 */
.profile-card {
  display: flex;
  gap: 40px;
  width: 900px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.85); /* 微调透明度，更通透 */
  backdrop-filter: blur(12px);
  border-radius: 16px;
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.profile-card:hover {
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);
}

/* 左侧 */
.left {
  width: 220px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease;
}
.avatar:hover {
  transform: scale(1.03);
}

.name {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.role-tag {
  margin-top: 12px;
  font-weight: 500;
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

.action-btn {
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 500;
  transition: all 0.2s ease;
}
.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
