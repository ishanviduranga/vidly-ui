import React, { Component } from "react";
import { toast } from "react-toastify";
import { getMovies, deleteMovie } from "../services/MovieService";
import { getGenres } from "../services/GenreService";
import { paginate } from "./utils/paginate";
import Pagination from "./common/pagination";
import ListGroup from "./common/list-group";
import MoviesTable from "./movies-table";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    selectedGenre: {},
    currentPage: 1,
    pageSize: 4,
    searchText: "",
    sortColumn: { path: "title", order: "asc" },
  };

  async componentDidMount() {
    const { data: genresFromServer } = await getGenres();
    const { data: moviesFromServer } = await getMovies();

    const genres = [{ name: "All Movies" }, ...genresFromServer];
    this.setState({ movies: moviesFromServer, genres });
  }

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      selectedGenre,
      sortColumn,
      movies: allMovies,
      searchText
    } = this.state;

    const filteredMovies =
      selectedGenre && selectedGenre._id
        ? allMovies.filter((movie) => movie.genre._id === selectedGenre._id)
        : allMovies;

    const sorted =
      sortColumn.order === "asc"
        ? _.orderBy(filteredMovies, [sortColumn.path, ["asc"]])
        : _.reverse(_.orderBy(filteredMovies, [sortColumn.path, ["asc"]])); // _.orderBy(filteredMovies, [sortColumn.path, ["desc"]])); is not working for some reason

    let searched = sorted;
    if (searchText) {
      searched = searched.filter((movie) => movie.title.toLowerCase().includes(searchText.toLowerCase()));
    }

    const movieCount = searched.length;
    const movies = paginate(searched, currentPage, pageSize);

    return { movieCount, movies };
  };

  render() {
    const { user } = this.props;
    const { movieCount, movies } = this.getPageData();
    const {
      pageSize,
      currentPage,
      selectedGenre,
      sortColumn,
    } = this.state;

    return (
      <div className="row m-5 d-flex justify-content-center">
        <div className="col-3">
          <ListGroup
            items={this.state.genres} 
            selectedItem={selectedGenre}
            onClick={this.handleOnGenreChange}
          />
        </div>
        <div className="col-8">
          <MoviesTable
            filteredMoviesCount={movieCount}
            sortColumn={sortColumn}
            movies={movies}
            history={this.props.history}
            handleLike={this.handleLike}
            onDeleteMovie={this.handleDeleteMoive}
            onSort={this.handleSort}
            onSearch={this.handleSearch}
            searchText={this.state.searchText}
            user={user}
          ></MoviesTable>

          <Pagination
            itemCount={movieCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handleOnPageChange}
          />
        </div>
      </div>
    );
  }

  handleDeleteMoive = async (movie) => {
    const originalMovies = this.state.movies; 
    let movies = originalMovies.slice();
    let index = movies.indexOf(movie);
    movies.splice(index, 1);
    this.setState({ movies: movies, currentPage: 1 });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This movie has already been deleted.");
      }

      this.setState({ movies: originalMovies });
    }
  };

  fetchMovies() {
    let newState = this.state;
    newState.movies = getMovies();

    this.setState(newState);
  }

  handleLike = (movie) => {
    let movies = [...this.state.movies];
    let index = movies.indexOf(movie);
    movies[index].liked = !movies[index].liked;

    this.setState({ movies });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleOnPageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleOnGenreChange = (genre) => {
    this.setState({ selectedGenre: genre, currentPage: 1, searchText: "" });
  };

  handleSearch = ({ currentTarget: input }) => {  
    this.setState({ selectedGenre: {}, searchText: input.value, currentPage: 1 });
  }
}

export default Movies;
