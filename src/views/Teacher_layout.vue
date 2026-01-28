<template>
  <el-container class="layout">
    <!-- 侧边栏 -->
    <el-aside width="220px" class="aside">
      <div class="logo-box">
        <span class="logo-text">教师端</span>
      </div>

      <el-menu
        router
        :default-active="$route.path"
        class="menu"
        background-color="transparent"
        text-color="#cfd3dc"
        active-text-color="#ffffff"
      >
        <el-menu-item index="/teacher/dashboard">
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/teacher/review">
          <span>审核管理</span>
        </el-menu-item>
        <el-menu-item index="/teacher/profile">
          <span>个人中心</span>
        </el-menu-item>
      </el-menu>

      <div class="logout-box">
        <el-button type="danger" plain size="small" @click="logout"> 退出登录 </el-button>
      </div>
    </el-aside>

    <!-- 主体 -->
    <el-container>
      <el-header class="header">
        <div class="title">课程综测加分管理平台</div>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  localStorage.clear();
  router.push("/login");
};
</script>

<style scoped>
/* 整体布局 */
.layout {
  height: 100vh;
  background: url("../assets/back_ground.png") no-repeat center center fixed;
  background-size: cover;
}

/* 侧边栏 */
.aside {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0f2027, #203a43, #2c5364);
  color: #fff;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
}

/* Logo */
.logo-box {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 2px;
}

/* 菜单 */
.menu {
  flex: 1;
  border-right: none;
}

.menu :deep(.el-menu-item) {
  height: 48px;
  margin: 6px 10px;
  border-radius: 8px;
}

.menu :deep(.el-menu-item.is-active) {
  background: rgba(255, 255, 255, 0.15);
}

/* 退出按钮 */
.logout-box {
  padding: 16px;
  text-align: center;
}

/* 顶部 */
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(6px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 18px;
  font-weight: 600;
}

/* 主体内容 */
.main {
  padding: 24px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(4px);
  min-height: calc(100vh - 60px);
}
</style>
