import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initializeAuth } from "../../redux/slices/authSlice";
const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeAuth())
      .unwrap()
      .then((session) => {
        navigate(session.hasProfile ? "/dashboard/feed" : "/onboarding", {
          replace: true,
        });
      })
      .catch(() => navigate("/login", { replace: true }));
  }, [navigate, dispatch]);
  return <div>Redirecting...</div>;
};
export default OAuth2RedirectHandler;
