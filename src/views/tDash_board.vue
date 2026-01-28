<template>
  <div class="home">
    <div class="glass-card">
      <div class="title-box">
        <h1 class="title">教师工作台</h1>
        <p class="subtitle">学生综合测评管理系统</p>
      </div>

      <div class="line"></div>

      <transition-group name="fade-up" tag="div" class="tips">
        <p v-for="(item, index) in tips" :key="index">
          {{ item }}
        </p>
      </transition-group>

      <el-button type="primary" size="large" class="enter-btn" @click="goReview">
        进入审核管理
      </el-button>
    </div>

    <!-- 装饰光斑 -->
    <div class="orb orb1"></div>
    <div class="orb orb2"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const tips = ref([]);

const messages = [
  "请认真审核学生申报材料",
  "坚持公平、公正、公开原则",
  "每一条审核记录都会被系统留档",
  "感谢您为教学管理工作付出的时间",
];

const goReview = () => {
  router.push("/teacher/review");
};

onMounted(() => {
  messages.forEach((msg, index) => {
    setTimeout(
      () => {
        tips.value.push(msg);
      },
      500 + index * 700,
    );
  });
});
</script>

<style scoped>
.home {
  position: relative;
  height: 100vh;
  background: url("../assets/back_ground.png") no-repeat center center / cover;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

/* 毛玻璃卡片 */
.glass-card {
  width: 560px;
  padding: 48px 56px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.25);
  text-align: center;
  animation: float 6s ease-in-out infinite;
}

.title-box {
  margin-bottom: 16px;
}

.title {
  font-size: 30px;
  font-weight: 600;
  margin-bottom: 6px;
}

.subtitle {
  color: #666;
  font-size: 14px;
}

.line {
  width: 60%;
  height: 1px;
  background: linear-gradient(to right, transparent, #ccc, transparent);
  margin: 24px auto;
}

.tips {
  min-height: 120px;
  margin-bottom: 32px;
}

.tips p {
  font-size: 15px;
  color: #444;
  margin: 8px 0;
}

.enter-btn {
  width: 220px;
  height: 44px;
  font-size: 16px;
}

/* 动画 */
.fade-up-enter-active {
  transition: all 0.6s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

/* 浮动动画 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 背景光斑 */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: orbMove 10s ease-in-out infinite;
}

.orb1 {
  width: 280px;
  height: 280px;
  background: #6fa8ff;
  top: 10%;
  left: 15%;
}

.orb2 {
  width: 320px;
  height: 320px;
  background: #9b7cff;
  bottom: 10%;
  right: 15%;
  animation-delay: 3s;
}

@keyframes orbMove {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-40px) translateX(30px);
  }
}
</style>
