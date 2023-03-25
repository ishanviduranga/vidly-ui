import React, { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import PageNotFound from "./components/common/page-not-found";
import Movies from "./components/movies";
import NavBar from "./components/nav-bar";
import Customers from "./components/customers";
import Rentals from "./components/rentals";
import MovieForm from "./components/movie-form";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/AuthService";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Logout from "./components/logout";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <Switch>
          <Route path="/login" component={LoginForm} />
          <Route path="/logout" component={Logout} />
          <Route path="/register" component={RegisterForm} />
          <ProtectedRoute path="/movies/:id" component={MovieForm} />
          <Route
            path="/movies"
            render={(props) => <Movies {...props} user={user} />}
          />
          <Route path="/customers" component={Customers} />
          <Route path="/rentals" component={Rentals} />
          <Route path="/not-found" component={PageNotFound} />
          <Redirect from="/" exact to="/movies" />
          <Redirect to="/not-found" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
