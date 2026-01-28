<template>
  <div class="login-container">
    <el-card class="login-card" :class="{ shake: errorShake }">
      <h2 class="title">综测申报审核平台</h2>

      <el-form :model="loginForm" ref="loginFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" placeholder="请输入学号 / 工号" clearable />
        </el-form-item>

        <el-form-item label="密码">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="qgcl快给我输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { loginApi } from "@/api/login";

const router = useRouter();

const loginForm = ref({
  username: "",
  password: "",
});

const loading = ref(false);
const errorShake = ref(false);

const triggerError = () => {
  errorShake.value = true;
  setTimeout(() => {
    errorShake.value = false;
  }, 500);
};

const handleLogin = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    const res = await loginApi(loginForm.value);

    if (res.data.code === 1) {
      const token = res.data.data; // ⚠️ 这是 JWT 字符串

      // 保存 token
      localStorage.setItem("token", token);

      // ⚠️ 从 token 中解析 role
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      localStorage.setItem("role", role);
      localStorage.setItem("username", payload.username);
      localStorage.setItem("userId", payload.id);

      // 跳转
      if (role === "teacher") {
        router.replace("/teacher");
      } else {
        router.replace("/");
      }
    } else {
      throw new Error();
    }
  } catch (e) {
    triggerError();
    ElMessage.error("用户名或密码错误");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* ================== 背景 ================== */
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: url("/src/assets/back_ground.png");
  background-size: cover;
  background-position: center;
}

/* ================== 卡片 ================== */
.login-card {
  width: 420px;
  padding: 36px 32px;

  background: rgba(25, 25, 25, 0.6);
  backdrop-filter: blur(14px);

  border-radius: 18px;

  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);

  animation: fadeUp 0.6s ease-out;
}

/* ================== 标题 ================== */
.title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 28px;
  letter-spacing: 1px;
}

/* ================== 表单样式 ================== */
:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 8px;
}

/* ================== 按钮 ================== */
.login-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  border-radius: 8px;
}

/* ================== 登录错误抖动 ================== */
.shake {
  animation: shake 0.4s;
  box-shadow:
    0 0 0 2px rgba(255, 77, 79, 0.85),
    0 20px 40px rgba(255, 77, 79, 0.35) !important;
}

.shake :deep(.el-input__wrapper) {
  box-shadow: inset 0 0 0 1px rgba(255, 77, 79, 0.9);
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-6px);
  }
  40% {
    transform: translateX(6px);
  }
  60% {
    transform: translateX(-4px);
  }
  80% {
    transform: translateX(4px);
  }
  100% {
    transform: translateX(0);
  }
}

/* ================== 入场动画 ================== */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
