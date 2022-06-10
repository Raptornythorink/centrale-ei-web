import { createRouter, createWebHistory } from "vue-router";
import Redirection from "../views/Redirection.vue";
import Home from "../views/Home.vue";
import Recommended from "../views/Recommended.vue";
import Users from "../views/Users.vue";
import MovieDesc from "../views/MovieDesc.vue";
import MovieDescRating from "../views/MovieDescRating.vue";

const routes = [
  { path: "/", name: "Redirection", component: Redirection },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/home/:userId",
    name: "HomePerso",
    component: Home,
  },
  {
    path: "/recommended/:userId",
    name: "Recommended",
    component: Recommended,
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
  },
  {
    path: "/users/:userId",
    name: "UsersPerso",
    component: Users,
  },
  {
    path: "/movies/:movieId",
    name: "MovieDesc",
    component: MovieDesc,
  },
  {
    path: "/movies/:movieId/:userId",
    name: "MovieDescRating",
    component: MovieDescRating,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
