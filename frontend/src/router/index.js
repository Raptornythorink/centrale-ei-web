import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Users from "../views/Users.vue";
import MovieDesc from "../views/MovieDesc.vue";
import MovieDescRating from "../views/MovieDescRating.vue";
import AddOneMovie from "../views/AddOneMovie.vue"

const routes = [
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
  {
    path: "/add",
    name: "AddOneMovie",
    component: AddOneMovie,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
