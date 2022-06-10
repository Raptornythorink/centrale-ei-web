<template>
  <Navbar :userId="userId"></Navbar>
  <div class="movie">
    <p>
      <img
        alt="logo"
        src="http://localhost:8080/csalto_white.png"
        class="logo"
      />
    </p>
    <img
      :src="'https://image.tmdb.org/t/p/w300' + movie.poster_path"
      width="230"
      class="poster"
    />
    <div class="description">
      <div class="title">{{ movie.title }}</div>
      <div class="date">{{ movie.release_date }}</div>
      <div class="genres">
        <div v-for="genre in movie.genres" :key="genre" class="genre">
          {{ genre }}
        </div>
      </div>
      <div class="desc">{{ movie.desc }}</div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import axios from "axios";
export default {
  name: "MovieDesc",
  components: { Navbar },
  data: function () {
    return {
      movie: {},
      rating: 0,
    };
  },
  methods: {
    fetchMovie: function () {
      axios
        .get(`http://localhost:3000/movies/${this.$route.params.movieId}`)
        .then((response) => {
          this.movie = response.data[0];
        })
        .catch((error) => {
          this.usersLoadingError = "An error occured while fetching the movie.";
          console.error(error);
        });
    },
  },
  created: async function () {
    try {
      this.userId = this.$route.params.userId;
    } catch {
      this.userId = "";
    }
    try {
      await this.fetchNote();
    } catch {
      this.rating = 0;
    }
  },
  mounted: async function () {
    this.fetchMovie();
  },
};
</script>

<style scoped>
.movie {
  background-image: url("../../public/background.webp");
  text-align: center;
  padding-top: 50px;
  padding-bottom: 50px;
  color: white;
}
.poster {
  border: 2px solid #fff;
  margin-bottom: 20px;
  border-radius: 15px;
  text-align: center;
}
.description {
  background: linear-gradient(rgb(143, 143, 143), #000);
  border: 2px solid #fff;
  border-radius: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 25px;
  padding-right: 25px;
  width: 60%;
  vertical-align: middle;
  margin-left: auto;
  margin-right: auto;
}
.title {
  font-weight: bolder;
  font-size: large;
  margin-bottom: 20px;
}
.date {
  margin-bottom: 20px;
}
.desc {
  margin-bottom: 20px;
}
.genres {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
  justify-content: center;
}
</style>
