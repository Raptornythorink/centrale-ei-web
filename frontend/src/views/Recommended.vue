<template>
  <Navbar :userId="userId"></Navbar>
  <div class="home">
    <img alt="logo" src="http://localhost:8080/csalto_white.png" class="logo" />
    <div class="catalogue">
      <Movie
        v-for="movie of movies"
        :movie="movie"
        :userId="userId"
        :key="movie.id"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Movie from "@/components/Movie.vue";
import axios from "axios";
export default {
  name: "Home",
  components: { Navbar, Movie },
  data: function () {
    return {
      movieIds: [],
      movies: [],
      userId: "",
    };
  },
  methods: {
    fetchMovies: async function () {
      axios
        .get("http://localhost:3000/users/recommended/" + this.userId)
        .then((responseId) => {
          for (let i = 0; i < responseId.data.length; i++) {
            axios
              .get("http://localhost:3000/movies/get/" + responseId.data[i])
              .then((responseMovie) => {
                this.movies.push(responseMovie.data[0]);
              });
          }
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home {
  text-align: center;
  background-image: url("../../public/background.webp");
  padding-bottom: 100px;
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.catalogue {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  padding-bottom: 25px;
}
</style>
