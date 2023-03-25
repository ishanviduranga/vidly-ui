import React, { Component } from "react";
import auth from "../services/AuthService";
import Liked from "./common/liked";
import Table from "./common/table";
import { Link } from "react-router-dom";

class MoviesTable extends Component {
  columns = [
    {
      path: "title",
      label: "Title",
      content: (movie) => (
        <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
      ),
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (movie) => (
        <Liked
          liked={movie.liked}
          onClick={() => this.props.handleLike(movie)}
        />
      ),
    },
  ];

  deleteColumn = {
    key: "delete",
    content: (movie) => (
      <button
        className="btn btn-danger"
        onClick={() => this.props.onDeleteMovie(movie)}
      >
        Delete
      </button>
    ),
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.isAdmin) this.columns.push(this.deleteColumn);
  }

  render() {
    const {
      filteredMoviesCount,
      movies,
      onSort,
      sortColumn,
      history,
      onSearch,
      searchText,
      user,
    } = this.props;

    return (
      <div>
        {user && (
          <button
            className="btn btn-primary mr-2"
            onClick={() => history.push("/movies/new")}
          >
            New Movie
          </button>
        )}
        {filteredMoviesCount > 0 && (
          <span>Showing {filteredMoviesCount} movies in the database.</span>
        )}
        <div className="mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchText}
            onChange={onSearch}
          />
        </div>
        {filteredMoviesCount > 0 ? (
          <React.Fragment>
            <div className="mb-4"></div>
            <Table
              columns={this.columns}
              data={movies}
              sortColumn={sortColumn}
              onSort={onSort}
            />
          </React.Fragment>
        ) : (
          <p className="mt-4">
            There are no movies available{!searchText ? "." : " for "}{" "}
            {searchText && <b>"{searchText}"</b>}
          </p>
        )}
      </div>
    );
  }
}

export default MoviesTable;
