<template>
  <el-container class="layout">
    <!-- 左侧菜单 -->
    <el-aside width="220px" class="aside">
      <div class="logo">综测加分系统</div>

      <el-menu
        router
        :default-active="route.path"
        background-color="transparent"
        text-color="#cfd6e4"
        active-text-color="#409eff"
        class="menu"
      >
        <el-menu-item index="/"> 首页 </el-menu-item>

        <el-sub-menu index="/apply-group">
          <template #title> 申报管理 </template>

          <el-menu-item index="/apply">我的申报</el-menu-item>
          <el-menu-item index="/add">新增申报</el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/personal">个人中心</el-menu-item>
        <el-menu-item index="/guide">申报须知</el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主体 -->
    <el-container>
      <!-- 顶部 -->
      <el-header class="header">
        <div class="header-title">课程综测加分管理平台</div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="main">
        <transition name="fade-page" mode="out-in">
          <router-view />
        </transition>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRoute } from "vue-router";
const route = useRoute();
</script>

<style scoped>
/* ================== 整体背景 ================== */
.layout {
  height: 100vh;
  background-image: url("/src/assets/back_ground.png");
  background-size: cover;
  background-position: center;
}

/* ================== 左侧栏 ================== */
.aside {
  background: rgba(15, 15, 20, 0.65);
  backdrop-filter: blur(14px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

/* LOGO */
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* 菜单 */
.menu {
  border-right: none;
  background: transparent;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  transition: all 0.25s ease;
}

:deep(.el-menu-item:hover),
:deep(.el-sub-menu__title:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

/* ================== 顶部栏 ================== */
.header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 24px;

  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);

  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-title {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
}

/* ================== 内容区 ================== */
.main {
  padding: 24px;
  overflow-y: auto;
}

/* 给子页面一个统一的“卡片感容器” */
:deep(.apply-list),
:deep(.dashboard),
:deep(.profile-page) {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  padding: 20px;
  box-shadow:
    0 16px 40px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

/* ================== 页面切换动画 ================== */
.fade-page-enter-active,
.fade-page-leave-active {
  transition: all 0.35s ease;
}

.fade-page-enter-from {
  opacity: 0;
  transform: translateY(14px);
}

.fade-page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
