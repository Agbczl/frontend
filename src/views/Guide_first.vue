<template>
  <div class="guide-page">
    <!-- 顶部标题 -->
    <div class="guide-header">
      <h2>申报须知</h2>
      <p>综合测评加分申报与审核说明</p>
    </div>

    <!-- 内容卡片 -->
    <div class="guide-card">
      <!-- 模块 1 -->
      <section class="guide-section">
        <div class="badge">01</div>
        <div class="content">
          <h3>系统说明</h3>
          <p>
            本系统用于学生综合测评加分项目的线上申报与审核管理，
            适用于课程外、课外活动、竞赛、科研、志愿服务等加分事项。
          </p>
        </div>
      </section>

      <!-- 模块 2 -->
      <section class="guide-section">
        <div class="badge">02</div>
        <div class="content">
          <h3>可申报加分范围</h3>
          <ul>
            <li>学科竞赛（校级及以上）</li>
            <li>科研立项、学术论文成果</li>
            <li>志愿服务与社会实践活动</li>
            <li>创新创业项目</li>
            <li>其他符合综测加分要求的课外活动</li>
          </ul>
        </div>
      </section>

      <!-- 模块 3 -->
      <section class="guide-section">
        <div class="badge">03</div>
        <div class="content">
          <h3>申报规则与注意事项</h3>
          <ul>
            <li>申报内容必须真实有效，不得虚报或伪造材料</li>
            <li>同一事项不得重复申报</li>
            <li>须上传清晰、完整的证明材料</li>
            <li>申报时间以系统提交时间为准</li>
            <li>申报提交后将进入审核流程</li>
          </ul>
        </div>
      </section>

      <!-- 模块 4 -->
      <section class="guide-section">
        <div class="badge">04</div>
        <div class="content">
          <h3>审核说明</h3>
          <p>
            学生提交申报后，将由任课教师或负责教师进行审核。 审核结果分为 <strong>通过</strong> 与
            <strong>驳回</strong>， 驳回申报可查看对应审核意见。
          </p>
          <p class="hint">审核周期一般为 <strong>3–5 个工作日</strong>，请耐心等待。</p>
        </div>
      </section>

      <!-- 底部提示 -->
      <div class="guide-footer">⚠️ 本系统为学校官方综测加分申报平台，请严格遵守相关管理规定。</div>
    </div>
  </div>
</template>

<script setup>
// 纯展示页面，无逻辑
</script>

<style scoped>
/* ================= 页面容器 ================= */
.guide-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ================= 顶部标题 ================= */
.guide-header {
  text-align: center;
  margin-bottom: 24px;
}

.guide-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 6px;
}

.guide-header p {
  color: #666;
  font-size: 14px;
}

/* ================= 主卡片 ================= */
.guide-card {
  width: 900px;
  padding: 28px;

  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);

  border-radius: 18px;
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

/* ================= 模块 ================= */
.guide-section {
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
}

.guide-section:last-child {
  border-bottom: none;
}

/* 左侧编号徽章 */
.badge {
  width: 44px;
  height: 44px;
  border-radius: 50%;

  background: linear-gradient(135deg, #409eff, #67c23a);
  color: #fff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

/* 右侧内容 */
.content h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.content p {
  color: #555;
  line-height: 1.7;
}

.content ul {
  padding-left: 18px;
}

.content li {
  line-height: 1.8;
  color: #555;
}

/* 审核提示 */
.hint {
  margin-top: 8px;
  color: #409eff;
}

/* ================= 底部提示 ================= */
.guide-footer {
  margin-top: 28px;
  padding: 14px 16px;

  background: rgba(64, 158, 255, 0.08);
  border-left: 4px solid #409eff;
  border-radius: 8px;

  color: #333;
  font-size: 14px;
}
</style>
