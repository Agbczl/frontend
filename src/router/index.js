import { createRouter, createWebHistory } from "vue-router";
import Log_in from "@/views/Log_in.vue";
import Lay_out from "@/views/Lay_out.vue";
import Dash_board from "@/views/Dash_board.vue";
import Apply_list from "@/views/Apply_list.vue";
import Apply_form from "@/views/Apply_form.vue";
import Review_list from "@/views/Review_list.vue";
import Pro_file from "@/views/Pro_file.vue";
import tDash_board from "@/views/tDash_board.vue";
import Teacher_layout from "@/views/Teacher_layout.vue";
import Guide_first from "@/views/Guide_first.vue";
import person from "@/views/Pro_file.vue";
import scores from "@/views/score.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    //登录界面路由信息
    {
      path: "/login",
      name: "Login",
      component: Log_in,
    },
    // 老师路由信息
    {
      path: "/teacher",
      name: "teacher",
      redirect: "/teacher/dashboard",
      component: Teacher_layout,
      children: [
        {
          path: "dashboard",
          name: "teacher_Dashboard",
          component: tDash_board,
        },
        {
          path: "review",
          name: "review",
          component: Review_list,
        },
        {
          path: "profile",
          name: "teacher_profile",
          component: person,
        },
      ],
    },
    // 学生路由信息
    {
      path: "/",
      component: Lay_out,
      children: [
        {
          path: "",
          name: "student_Dashboard",
          component: Dash_board,
        },
        {
          path: "apply",
          name: "Applylish",
          component: Apply_list,
        },
        {
          path: "add",
          name: "Applyform",
          component: Apply_form,
        },
        {
          path: "personal",
          name: "student_profile",
          component: Pro_file,
        },
        {
          path: "guide",
          name: "guidefirst",
          component: Guide_first,
        },
        {
          path: "score",
          name: "score",
          component: scores,
        },
      ],
    },
  ],
});
router.beforeEach((to, loginForm, next) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token && to.path !== "/login") {
    return next("/login");
  }

  if (to.path.startsWith("/teacher")) {
    return role === "teacher" ? next() : next("/student");
  }

  if (to.path.startsWith("/student")) {
    return role === "student" ? next() : next("/teacher");
  }

  next();
});

export default router;
