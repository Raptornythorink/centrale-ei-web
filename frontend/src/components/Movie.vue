<template>
  <router-link :to="link" class="movie">
    <img :src="posterPath" width="230" class="poster" />
    <div class="description">
      <div class="title">{{ movie.title }}</div>
      <div class="date">{{ movie.release_date }}</div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "Movie",
  props: {
    movie: Object,
    userId: String,
  },
  data: function () {
    return {
      link: "/movies/" + this.movie.id,
      posterPath: "",
    };
  },
  mounted: function () {
    if (this.userId != undefined) {
      this.link += "/" + this.userId;
    }
    if (this.movie.poster_path != undefined) {
      this.posterPath =
        "https://image.tmdb.org/t/p/w300" + this.movie.poster_path;
    } else {
      this.posterPath = "../no_poster.jpg";
    }
  },
};
</script>

<style scoped>
.movie {
  text-decoration: none;
  margin-top: 25px;
  text-align: center;
  width: 230px;
}

.poster {
  border: 2px solid #fff;
  margin-bottom: 5px;
  border-radius: 15px;
  height: 345px;
}
.description {
  background: linear-gradient(rgb(143, 143, 143), #000);
  border: 2px solid #fff;
  border-radius: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
  width: calc(100% - 10px);
  vertical-align: middle;
}
.title {
  color: white;
  -webkit-text-stroke: #000;
  font-weight: bolder;
  margin-bottom: 5px;
}
.date {
  color: white;
  -webkit-text-stroke: #000;
}
</style>
