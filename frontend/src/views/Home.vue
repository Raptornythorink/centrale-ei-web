<template>
  <div class="home">
    <img
      alt="Morbin"
      src="https://d1fmx1rbmqrxrr.cloudfront.net/cnet/optim/i/edit/2022/01/Morbius%202022%20Big__w1200.jpg"
      width="300"
      class="logo"
    />
    <h1>CSALTO</h1>
    <p>
      <input
        type="text"
        v-model="query"
        v-on:input="findMovies"
        placeholder="Search..."
      />
    </p>
    <div class="pageButtons">
      <button
        v-for="index in pagesNumber"
        :key="index"
        @click="changePage(index)"
        v-bind:class="{ pageButton: true, activePageButton: index === page }"
      >
        {{ index }}
      </button>
    </div>
    <div class="catalogue">
      <Movie
        v-for="movie in foundMovies.slice(
          maxMoviesPerPage * (page - 1),
          maxMoviesPerPage * page
        )"
        :movie="movie"
        :key="movie.id"
      />
    </div>
    <div class="pageButtons">
      <button
        v-for="index in pagesNumber"
        :key="index"
        @click="changePage(index)"
        v-bind:class="{ pageButton: true, activePageButton: index === page }"
      >
        {{ index }}
      </button>
    </div>
  </div>
</template>

<script>
import Movie from "@/components/Movie.vue";
import axios from "axios";
export default {
  name: "Home",
  components: { Movie },
  data: function () {
    return {
      query: "",
      query_lowercase: "",
      movies: [],
      foundMovies: [],
      page: 1,
      foundMoviesNumber: 0,
      maxMoviesPerPage: 21,
      pagesNumber: 0,
    };
  },
  created() {
    console.log("Hello World");
  },
  methods: {
    fetchMovies: function () {
      axios
        .get("http://localhost:3000/movies")
        .then((response) => {
          console.log(response.data);
          this.movies = response.data;
          this.foundMovies = response.data;
          this.foundMoviesNumber = this.foundMovies.length;
          this.pagesNumber = Math.floor(
            this.foundMoviesNumber / this.maxMoviesPerPage
          );
        })
        .catch((error) => {
          this.usersLoadingError = "An error occured while fetching movies.";
          console.error(error);
        });
    },
    findMovies: function () {
      this.query_lowercase = this.query.toLowerCase();
      this.foundMovies = [];
      for (const movie of this.movies) {
        let title = movie.title.toLowerCase();
        if (title.includes(this.query_lowercase)) {
          this.foundMovies.push(movie);
        }
      }
      this.foundMoviesNumber = this.foundMovies.length;
      this.page = 1;
      this.pagesNumber = Math.floor(
        this.foundMoviesNumber / this.maxMoviesPerPage
      );
    },
    changePage: function (index) {
      this.page = index;
    },
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
  background-image: url("../../public/fond3.webp");
  background-position: center top;
  background-size: 100% auto;
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

.logo {
  border: 1px solid #fff;
  margin-top: 25px;
}

.search {
  text-align: center;
  color: white;
}

.pageButtons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 50px;
}

.pageButton {
  height: 30px;
  width: 30px;
  border-radius: 10px;
  background-color: blue;
  color: white;
}

.activePageButton {
  background-color: red;
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
