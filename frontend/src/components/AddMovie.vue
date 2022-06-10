<template>
  <div class="add-movie">
    <div class="add-movie-title">Add new movie:</div>
    <div class="add-movie-form-container">
      <form ref="addMovieForm">
        <input
          class="add-movie-input"
          v-model="movies.title"
          placeholder="Title"
          required
        />
        <input
          class="add-movie-input"
          v-model="movies.release_date"
          placeholder="Release Date"
        />
        <input
          class="add-movie-input"
          v-model="movies.desc"
          placeholder="Description"
        />
        <input
          class="add-movie-input"
          v-model="movies.genres"
          placeholder="Genres"
        />
      </form>
      <button class="add-movie-button" @click="addMovie()">Add movie</button>
      <div v-if="movieCreationError">{{ movieCreationError }}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AddMovie",
  emits: ["movieAdded"],
  data: function () {
    return {
      movie: {
        title: "",
        release_date: "",
        desc: "",
        genres: [],
      },
      movieCreationError: "",
    };
  },
  methods: {
    addMovie: function () {
      if (!this.$refs.addMovieForm.checkValidity()) {
        this.$refs.addMovieForm.reportValidity();
        return;
      }

      axios
        .post(`${process.env.VUE_APP_BACKEND_BASE_URL}/movies/new`)
        .then(() => {
          this.$emit("movieAdded");
          this.movie = {
            title: "",
            release_date: "",
            desc: "",
            genres: [],
          };
        })
        .catch((error) => {
          this.movieCreationError = "An error occured while creating new movie.";
          console.error(error);
        });
    },
  },
};
</script>

<style scoped>
.add-movie {
  margin-left: auto;
  margin-right: auto;
  align-content: center;
  text-align: center;
  display: flex;
}
.add-movie-title {
  margin-bottom: 10px;
}

.add-movie-form-container {
  display: flex;
  margin-bottom: 20px;
}

.add-movie-input {
  margin-right: 10px;
  padding: 5px;
}

.add-movie-button {
  cursor: pointer;
  padding: 5px;
}
</style>