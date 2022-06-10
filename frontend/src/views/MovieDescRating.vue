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
    <div class="product-review-stars">
      <input
        type="radio"
        id="star5"
        name="rating"
        value="5"
        class="visuallyhidden"
        :v-model="rating"
        @change="onChange($event)"
      /><label for="star5" title="Amazing">★</label>
      <input
        type="radio"
        id="star4"
        name="rating"
        value="4"
        class="visuallyhidden"
        :v-model="rating"
        @change="onChange($event)"
      /><label for="star4" title="Pretty good">★</label>
      <input
        type="radio"
        id="star3"
        name="rating"
        value="3"
        class="visuallyhidden"
        :v-model="rating"
        @change="onChange($event)"
      /><label for="star3" title="Meh">★</label>
      <input
        type="radio"
        id="star2"
        name="rating"
        value="2"
        class="visuallyhidden"
        :v-model="rating"
        @change="onChange($event)"
      /><label for="star2" title="Kinda bad">★</label>
      <input
        type="radio"
        id="star1"
        name="rating"
        value="1"
        class="visuallyhidden"
        :v-model="rating"
        @change="onChange($event)"
      /><label for="star1" title="Really bad">★</label>
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
        .get(`http://localhost:3000/movies/get/${this.$route.params.movieId}`)
        .then((response) => {
          this.movie = response.data[0];
        })
        .catch((error) => {
          this.usersLoadingError = "An error occured while fetching the movie.";
          console.error(error);
        });
    },
    fetchNote: async function () {
      const doc = await axios.get(
        "http://localhost:3000/notation/get/" +
          this.$route.params.movieId +
          "/" +
          this.$route.params.userId
      );
      if (doc.data.doc !== null) {
        this.rating = doc.data.doc.note;
      }
    },
    onChange: function (event) {
      var newNote = event.target.value;
      axios.put(
        "http://localhost:3000/notation/new/" +
          this.$route.params.movieId +
          "/" +
          this.$route.params.userId +
          "/" +
          newNote
      );
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

.product-review-stars {
  margin-top: 30px;
  margin-left: auto;
  margin-right: auto;
  background: linear-gradient(#000, rgb(143, 143, 143));
  padding-top: 20px;
  padding-bottom: 20px;
  border-radius: 15px;
  border: 2px solid white;
}

.product-review-stars label {
  text-shadow: 0px 0px 10px black;
}

.visuallyhidden {
  position: absolute !important;
  clip: rect(1px 1px 1px 1px);
  clip: rect(1px, 1px, 1px, 1px);
}
.product-review-stars label:after {
  content: "★";
  color: inherit;
  -webkit-transform: scale(4);
  position: absolute;
  z-index: 4;
  left: 0px;
  transition: all 0.4s;
  opacity: 0;
  color: inherit;
  visibility: hidden;
}

.product-review-stars input:checked + label:after {
  visibility: visible;
  -webkit-transform: scale(1);
  opacity: 1;
}

.product-review-stars {
  unicode-bidi: bidi-override;
  direction: rtl;
  width: 205px;
}

.product-review-stars label {
  font-family: "icomoon";
  font-size: 2em;
  position: relative;
  cursor: pointer;
  color: #dfe3e4;
}
.product-review-stars input:checked ~ label:before {
  opacity: 1;
}
.product-review-stars:hover input ~ label:before {
  opacity: 0;
}

.product-review-stars input + label:before {
  content: "\2605";
  position: absolute;
  right: 0;
  opacity: 0;
  transition: opacity 0.3s ease-in-out, color 0.3s ease-in-out;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden; /* Chrome and Safari */
  -moz-backface-visibility: hidden; /* Firefox */
  -ms-backface-visibility: hidden; /* Internet Explorer */
}
.product-review-stars input + label:hover:before,
.product-review-stars input + label:hover ~ label:before {
  opacity: 1;
}
.product-review-stars input + label:nth-of-type(1):after,
.product-review-stars input + label:nth-of-type(1):before,
.product-review-stars input + label:nth-of-type(1):hover:before,
.product-review-stars input + label:nth-of-type(1):hover ~ label:before,
.product-review-stars input:nth-of-type(1):checked ~ label:before {
  color: #2ecc71;
}
.product-review-stars input + label:nth-of-type(2):after,
.product-review-stars input + label:nth-of-type(2):before,
.product-review-stars input + label:nth-of-type(2):hover:before,
.product-review-stars input + label:nth-of-type(2):hover ~ label:before,
.product-review-stars input:nth-of-type(2):checked ~ label:before {
  color: #f1c40f;
}
.product-review-stars input + label:nth-of-type(3):after,
.product-review-stars input + label:nth-of-type(3):before,
.product-review-stars input + label:nth-of-type(3):hover:before,
.product-review-stars input + label:nth-of-type(3):hover ~ label:before,
.product-review-stars input:nth-of-type(3):checked ~ label:before {
  color: #f39c12;
}
.product-review-stars input + label:nth-of-type(4):after,
.product-review-stars input + label:nth-of-type(4):before,
.product-review-stars input + label:nth-of-type(4):hover:before,
.product-review-stars input + label:nth-of-type(4):hover ~ label:before,
.product-review-stars input:nth-of-type(4):checked ~ label:before {
  color: #e74c3c;
}

.product-review-stars input + label:nth-of-type(5):after,
.product-review-stars input + label:nth-of-type(5):before,
.product-review-stars label:nth-of-type(5):hover:before,
.product-review-stars input:nth-of-type(5):checked ~ label:before {
  color: #d35400;
}

.product-review-stars label:nth-of-type(5):hover:before {
  color: #d35400 !important;
}
</style>
