const token = "eyJ0eXAiO.../// jwt token";
import { jwtDecode } from "jwt-decode";

export const accessTokenValue = () => {
  return (
    JSON.parse(sessionStorage.getItem("user"))?.accessToken ??
    JSON.parse(sessionStorage.getItem("user")) ??
    null
  );
};

export const userTypeValue = () => {
  if (sessionStorage.getItem("user")) {
    const decoded = jwtDecode(
      JSON.parse(sessionStorage.getItem("user"))?.accessToken ??
        JSON.parse(sessionStorage.getItem("user"))
    );
    return decoded?.role
  }
  // return
  //   ? JSON.parse(sessionStorage.getItem("user"))?.role
  //   : "USER";
};
