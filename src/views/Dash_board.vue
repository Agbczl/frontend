<template>
  <div class="dashboard">
    <div class="welcome-card">
      <h1 class="title">欢迎使用综测加分系统</h1>
      <p class="subtitle">Student Comprehensive Assessment Platform</p>

      <div class="divider" />

      <div class="info">
        <p><span>当前身份：</span>学生</p>
        <p><span>当前学期：</span>2025-2026 学年 第一学期</p>
      </div>

      <div class="desc">
        本系统用于学生综合测评加分申报与审核管理，支持在线申报、
        教师审核与结果公示，提升综测流程的规范性与透明度。
      </div>

      <div class="tips">
        <p>📌 左侧菜单可进行申报、查看进度</p>
        <p>📌 请按要求上传真实、有效的申报材料</p>
        <p>📌 如有疑问，请查看「申报须知」</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 当前为纯展示页，无需逻辑
</script>

<style scoped>
/* ================== 页面背景 ================== */
.dashboard {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ================== 主卡片 ================== */
.welcome-card {
  width: 680px;
  padding: 48px 52px;

  background: rgba(25, 25, 25, 0.65);
  backdrop-filter: blur(14px);

  border-radius: 20px;

  color: #ffffff;

  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.55),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08);

  animation: fadeUp 0.6s ease-out;
}

/* ================== 标题 ================== */
.title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.subtitle {
  text-align: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 28px;
}

/* ================== 分割线 ================== */
.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin-bottom: 28px;
}

/* ================== 基本信息 ================== */
.info {
  font-size: 16px;
  line-height: 32px;
  margin-bottom: 24px;
}

.info span {
  color: rgba(255, 255, 255, 0.7);
}

/* ================== 系统说明 ================== */
.desc {
  font-size: 15px;
  line-height: 26px;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 28px;
}

/* ================== 提示 ================== */
.tips p {
  font-size: 14px;
  line-height: 26px;
  color: rgba(255, 255, 255, 0.65);
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
