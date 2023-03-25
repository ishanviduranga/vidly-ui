import http from "./http-service";

export const getMovies = () => {
  return http.get("/movies");
};

export const getMovie = (id) => {
  return http.get(`/movies/${id}`)
};

export const saveMovie = (movie) => {
  return http.post("/movies", getSendableMovieObj(movie));
};

export const updateMovie = (movieId, movie) => {
  return http.put("/movies/" + movieId, getSendableMovieObj(movie));
};

export const deleteMovie = (id) => {
  return http.delete(`/movies/${id}`);
};

const getSendableMovieObj = (movie) => {
  let jsonMovie = movie;
  jsonMovie.genreId = movie.genre._id;
  delete jsonMovie.genre;
  return jsonMovie;
}
