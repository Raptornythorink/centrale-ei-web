const axios = require("axios");
const mongoose = require("mongoose");
const MovieModel = require("./models/movies");

async function fetchMoviesFromTheMovieDatabase(page) {
  const response = await axios.get(
    "https://api.themoviedb.org/3/discover/movie?api_key=a0a7e40dc8162ed7e37aa2fc97db5654&page=" +
      page
  );
  return response.data.results;
}

async function populateMovies(allMovies) {
  const genresArray = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  for (const movie of allMovies) {
    const genres = [];
    for (const genreId of movie.genre_ids) {
      genres.push(genresArray[genreId]);
    }
    let release_date = movie.release_date;
    if (movie.release_date === "") {
      release_date = "To be released";
    }
    const newMovie = new MovieModel({
      id: movie.id,
      title: movie.title,
      release_date: release_date,
      desc: movie.overview,
      genres: genres,
      poster_path: movie.poster_path,
    });
    await newMovie.save();
  }
}

async function dropDataBase() {
  await MovieModel.collection.drop();
}

async function populate() {
  // Connect mongoose client
  const client = await mongoose.connect(process.env.MONGO_DB_URL);

  await dropDataBase();

  for (let page = 1; page < 11; page++) {
    const movies = await fetchMoviesFromTheMovieDatabase(page);
    await populateMovies(movies);
  }

  await client.disconnect();
  // disconnect mongoose client
}

populate()
  .then(() => {
    console.log("All done !");
  })
  .catch((error) => {
    console.error(error);
  });
