<template>
  <Navbar :userId="userId"></Navbar>
  <div class="addMovie">
    <img alt="logo" src="http://localhost:8080/csalto_white.png" class="logo" />
    <AddMovie @movieAdded="fetchMovies()" />
    <div v-if="moviesLoadingError">{{ moviesLoadingError }}</div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import AddMovie from '@/components/AddMovie.vue';
import axios from 'axios';

export default {
    name: 'AddMovie',
    components: {
        Navbar,
        AddMovie
    },
    data: function () {
        return {
            movies: [],
            moviesLoadingError: "",
            userId: "",
        }
    },
    methods: {
        fetchMovies: function () {
            axios
            .get("http://localhost:3000/movies")
            .then((response) => {
            console.log(response.data);
            this.movies = response.data;
            })
            .catch((error) => {
            this.moviesLoadingError = "An error occured while fetching movies.";
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
        this.fetchMovies();
    },
}
</script>

<style scoped>
.addMovie {
  background-image: url("../../public/background.webp");
  margin-left: auto;
  margin-right: auto;
  align-content: center;
  margin-bottom: 150px;
  text-align: center;
}
.logo {
  margin-top: 50px;
  margin-bottom: 50px;
  width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>