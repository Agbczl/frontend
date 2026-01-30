<template>
  <div class="page">
    <!-- 总成绩 -->
    <el-card class="total-card">
      <div class="total-label">综合测评总成绩</div>
      <div class="total-score">{{ displayTotal }}</div>
    </el-card>

    <!-- 图表区 -->
    <div class="charts">
      <el-card class="chart-card">
        <div class="chart-title">模块成绩占比</div>
        <div ref="pieRef" class="chart"></div>
      </el-card>

      <el-card class="chart-card">
        <div class="chart-title">模块能力雷达</div>
        <div ref="radarRef" class="chart"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import * as echarts from "echarts";
import request from "@/api/request";

/* 数据 */
const moduleList = ref([]);

/* 总分 */
const totalScore = computed(() => moduleList.value.reduce((s, i) => s + Number(i.score || 0), 0));

/* 数字滚动显示 */
const displayTotal = ref("0.00");
watch(totalScore, (val) => {
  let start = 0;
  const end = val;
  const step = end / 30;
  const timer = setInterval(() => {
    start += step;
    if (start >= end) {
      displayTotal.value = end.toFixed(2);
      clearInterval(timer);
    } else {
      displayTotal.value = start.toFixed(2);
    }
  }, 20);
});

/* 图表 */
const pieRef = ref(null);
const radarRef = ref(null);

const initCharts = () => {
  /* 饼图 */
  const pie = echarts.init(pieRef.value);
  pie.setOption({
    tooltip: { trigger: "item" },
    series: [
      {
        type: "pie",
        radius: ["45%", "70%"],
        label: { color: "#fff" },
        data: moduleList.value.map((m) => ({
          name: m.module,
          value: m.score,
        })),
      },
    ],
  });

  /* 雷达图 */
  const radar = echarts.init(radarRef.value);
  radar.setOption({
    radar: {
      indicator: moduleList.value.map((m) => ({
        name: m.module,
        max: 10,
      })),
      axisName: { color: "#fff" },
      splitArea: {
        areaStyle: { color: ["rgba(255,255,255,0.05)"] },
      },
    },
    series: [
      {
        type: "radar",
        areaStyle: { opacity: 0.5 },
        data: [
          {
            value: moduleList.value.map((m) => m.score),
          },
        ],
      },
    ],
  });
};

/* 加载数据 */
onMounted(async () => {
  const res = await request.get("/score");
  if (res.data.code === 1) {
    moduleList.value = res.data.data;
    initCharts();
  }
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 32px;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

/* 总成绩卡片 */
.total-card {
  text-align: center;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.total-label {
  font-size: 16px;
  color: #ccc;
}

.total-score {
  font-size: 52px;
  font-weight: 800;
  color: #00eaff;
  margin-top: 12px;
}

/* 图表区 */
.charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.chart-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

.chart-title {
  color: #fff;
  font-weight: 600;
  margin-bottom: 12px;
}

.chart {
  width: 100%;
  height: 300px;
}
</style>
