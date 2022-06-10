<template>
  <Navbar :userId="userId"></Navbar>
  <div class="users">
    <img alt="logo" src="http://localhost:8080/csalto_white.png" class="logo" />
    <AddUser @userAdded="fetchUsers()" />
    <UsersTable
      v-if="users.length"
      :users="users"
      @userDeleted="fetchUsers()"
      :userId="userId"
    />
    <div v-if="usersLoadingError">{{ usersLoadingError }}</div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import UsersTable from "@/components/UsersTable.vue";
import AddUser from "@/components/AddUser.vue";
import axios from "axios";

export default {
  name: "Users",
  components: {
    AddUser,
    UsersTable,
    Navbar,
  },
  data: function () {
    return {
      users: [],
      usersLoadingError: "",
      userId: "",
    };
  },
  methods: {
    fetchUsers: function () {
      axios
        .get(`${process.env.VUE_APP_BACKEND_BASE_URL}/users`)
        .then((response) => {
          this.users = response.data.users;
        })
        .catch((error) => {
          this.usersLoadingError = "An error occured while fetching users.";
          console.error(error);
        });
    },
  },
  created: function () {
    try {
      this.userId = this.$route.params.userId;
    } catch {
      this.userId = "";
    }
  },
  mounted: function () {
    this.fetchUsers();
  },
};
</script>

<style scoped>
.users {
  background-image: url("../../public/background.webp");
  margin-left: auto;
  margin-right: auto;
  align-content: center;
  margin-bottom: 150px;
  text-align: center;
}
</style>
