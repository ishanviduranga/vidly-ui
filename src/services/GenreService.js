import http from "./http-service";

export const getGenres = () => {
  return http.get('/genres');
};
