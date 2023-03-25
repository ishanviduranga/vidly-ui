import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getMovie, saveMovie, updateMovie } from "../services/MovieService";
import { getGenres } from "../services/GenreService";

class MovieForm extends Form {
  state = {
    data: { title: "", genre: "", numberInStock: 0, dailyRentalRate: 0 },
    genres: [],
    errors: {},
  };

  schema = {
    title: Joi.string().required().label("Title"),
    genre: Joi.string().required().label("Genre"),
    numberInStock: Joi.number().required().label("Number in Stock"),
    dailyRentalRate: Joi.number().required().label("Rate"),
  };

  async populateGenres() {
    const { data: genres } = await getGenres();
    this.setState({ genres });
  }

  async populateMovie() {
    if (!this.isForAddANewMovie()) {
      try {
        const { data: movie } = await getMovie(this.props.match.params.id);
        this.setState({ data: this.pathMovieObj(movie) });
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          this.props.history.push("/page-not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateGenres();
    await this.populateMovie();
  }

  pathMovieObj(movieObj) {
    return {
      title: movieObj.title,
      genre: movieObj.genre._id,
      numberInStock: movieObj.numberInStock.toString(),
      dailyRentalRate: movieObj.dailyRentalRate.toString(),
    };
  }

  isForAddANewMovie() {
    return this.props.match.params.id === "new";
  }

  doSubmit = async () => {
    let movie = { ...this.state.data };
    movie.genre = this.state.genres.find((i) => i._id === movie.genre); // Set the genre object
    console.log(movie);
    this.isForAddANewMovie()
      ? await saveMovie(movie)
      : await updateMovie(this.props.match.params.id, movie);

    this.props.history.push("/movies");
  };

  onSelect = (id, changeValue) => {
    if (id === "genre") {
      let data = { ...this.state.data };
      data.genre = this.state.genres.find((i) => i._id === changeValue)?._id;
      this.setState({ data });
    }
  };

  render() {
    const { genres } = this.state;

    return (
      <div className="m-5">
        <h1>{this.isForAddANewMovie() ? "Add a New Movie" : `Edit Movie`}</h1>

        <form onSubmit={this.handleSubmit}>
          {this.renderInput("title", "Title")},
          {this.renderSelect(genres, "genre", "Genre")},
          {this.renderInput("numberInStock", "Number in Stock", "number")},
          {this.renderInput("dailyRentalRate", "Rate", "number")},
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default MovieForm;
