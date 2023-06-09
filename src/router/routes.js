import Login from "../pages/login/login.vue";
import Home from "../pages/home/home.vue";
import Index from "../pages/index/index.vue";
import Task from "../pages/task/task.vue";
import Page404 from "../pages/page404/index.vue";
import Child from "../pages/child/child.vue";
const routes = [
  {
    path: "/login",
    component: Login,
  },
  {
    name: "home",
    path: "/home",
    component: Home,
    children: [
      {
        name: "index",
        path: "index",
        component: Index,
      },
      {
        name: "task",
        path: "task",
        component: Task,
      },
      {
        path: "/",
        redirect: "index",
      },
    ],
  },
  {
    path: "/child",
    component: Child,
  },
  {
    path: "/",
    component: Login,
  },
  {
    path: "*",
    component: Page404, //404页面
  },
];

export default routes;
