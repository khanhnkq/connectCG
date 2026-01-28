import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
const OAuth2RedirectHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const token = searchParams.get("token");
    const hasProfile = searchParams.get("hasProfile") === "true";
    if (token) {
      // Update Redux state
      dispatch(setCredentials({ accessToken: token, hasProfile }));
      // Điều hướng dựa trên hasProfile
      if (hasProfile) {
        navigate("/dashboard/feed");
      } else {
        navigate("/onboarding");
      }
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate, dispatch]);
  return <div>Redirecting...</div>;
};
export default OAuth2RedirectHandler;