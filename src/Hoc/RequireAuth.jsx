import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RequireAuth = (ComposedComponent) => {
  const Authentication = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("auth_token");

    useEffect(() => {
      if (token) {
        navigate(location.pathname);
      } else {
        navigate("/login");
      }
    }, []);

    return token ? <ComposedComponent /> : null;
  };
  return Authentication;
};
export default RequireAuth;
