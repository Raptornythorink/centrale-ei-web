<template>
  <div class="nav">
    <router-link class="nav-link" :to="homeLink">Home</router-link>
    <router-link
      class="nav-link"
      :to="recommendedLink"
      v-if="userId != undefined"
      >Recommended</router-link
    >
    <router-link class="nav-link" :to="usersLink">Users</router-link>
    <router-link class="nav-link" :to="addLink">Add Movie</router-link>
  </div>
  <router-view />
</template>

<script>
export default {
  name: "Navbar",
  props: {
    userId: String,
  },
  data: function () {
    return {
      homeLink: "/home",
      usersLink: "/users",
      addLink: "/add",
      recommendedLink: "/recommended",
    };
  },
  mounted: function () {
    if (this.userId != undefined) {
      this.homeLink += "/" + this.userId;
      this.usersLink += "/" + this.userId;
      this.addLink += "/" + this.userId;
      this.recommendedLink += "/" + this.userId;
    }
  },
};
</script>

<style scoped>
.nav {
  display: flex;
  gap: 50px;
  justify-content: center;
  text-align: center;
  background: linear-gradient(#000, rgb(143, 143, 143));
  border: 2px solid white;
  border-radius: 20px;
}

.nav-link {
  font-weight: bold;
  color: white;
}

.nav-link.router-link-exact-active {
  color: #42b983;
}
</style>
