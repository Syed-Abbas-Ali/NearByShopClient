const token = "eyJ0eXAiO.../// jwt token";
import { jwtDecode } from "jwt-decode";

export const accessTokenValue = () => {
  return (
    JSON.parse(localStorage.getItem("user"))?.accessToken ??
    JSON.parse(localStorage.getItem("user")) ??
    null
  );
};

export const userTypeValue = () => {
  if (localStorage.getItem("user")) {
    const decoded = jwtDecode(
      JSON.parse(localStorage.getItem("user"))?.accessToken ??
        JSON.parse(localStorage.getItem("user"))
    );
    return decoded?.role
  }else{
    return null
  }
  // return
  //   ? JSON.parse(localStorage.getItem("user"))?.role
  //   : "USER";
};


