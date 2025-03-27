export const accessTokenValue = () => {
  return (
    JSON.parse(sessionStorage.getItem("user"))?.accessToken ??
    JSON.parse(sessionStorage.getItem("user")) ??
    null
  );
};

export const userTypeValue = () => {
  return sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user"))?.role
    : "USER";
};
