import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

const service = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
});

/* ===================== 请求拦截器 ===================== */
service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.token = token;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/* ===================== 响应拦截器 ===================== */
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    /**
     * 统一处理 NOT_LOGIN
     * ⚠️ 注意：你的后端 Result.code 是 String（如 "NOT_LOGIN"）
     */
    if (res.code === "NOT_LOGIN") {
      ElMessage.error("登录失效，请重新登录");

      localStorage.clear();

      // 使用 router，避免刷新整个页面
      router.replace("/login");

      // 阻断后续 then
      return Promise.reject(new Error("NOT_LOGIN"));
    }

    return response;
  },
  (error) => {
    // 如果是 401 / 403 也统一踢回登录
    if (error.response?.status === 401) {
      localStorage.clear();
      router.replace("/login");
    } else {
      ElMessage.error("服务器异常");
    }
    return Promise.reject(error);
  },
);

export default service;
