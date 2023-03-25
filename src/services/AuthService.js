import http from "./http-service";
import jwtDecode from "jwt-decode";

const tokenKey = "Token";

http.setJwt(getJwt());

const registerUser = (obj) => {
  return http.post(`/users`, {
    email: obj.username,
    password: obj.password,
    name: obj.name,
  });
};

const loginUser = async (obj) => {
  const { data: jwt } = await http.post(`/auth`, {
    email: obj.username,
    password: obj.password,
  });
  localStorage.setItem(tokenKey, jwt);
};

const loginWithJwt = async (jwt) => {
  localStorage.setItem(tokenKey, jwt);
};

const logout = () => {
  localStorage.removeItem(tokenKey);
};

const getCurrentUser = () => {
  try {
    const jwt = localStorage.getItem(tokenKey);
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

function getJwt() {
  return localStorage.getItem(tokenKey);
}

const ex = {
  registerUser,
  loginUser,
  logout,
  getCurrentUser,
  loginWithJwt
};

export default ex;
