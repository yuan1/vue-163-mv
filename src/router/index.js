import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import BasicLayout from "@/components/BasicLayout";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: BasicLayout,
    redirect: "/home",
    children: [
      {
        path: "home",
        component: Home
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
