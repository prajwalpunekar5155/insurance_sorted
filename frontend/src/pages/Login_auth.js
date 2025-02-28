import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Slide, toast } from "react-toastify";

function Login_auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const result = await axios.post("http://localhost:8085/checkLogin", {
      email,
      password,
    });

    if (result.data.status === "1") {
      sessionStorage.setItem("tokenKey", result.data.token_key);
      sessionStorage.setItem("userId", result.data.id);
      sessionStorage.setItem("post", result.data.post);

      if (result.data.subadmin_id) {
        sessionStorage.setItem("subadmin_id", result.data.subadmin_id);
        console.log("Stored subadmin_id:", result.data.subadmin_id);
      }

      if (result.data.lab_id) {
        sessionStorage.setItem("lab_id", result.data.lab_id);
        console.log("Stored lab_id:", result.data.lab_id);
      }

      toast.success("Login Successfully", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Slide,
      });

      const userRole = result.data.post;
      if (userRole === "laboratory") {
        navigate("/LaboratoryDashboard");
      } else if (userRole === "subadmin") {
        navigate("/SubadminDashboard");
      } else if (userRole === "Admin") {
        navigate("/Dashboard");
      } else {
        toast.error("Unknown role, access denied", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Slide,
        });
      }
    } else {
      toast.error("Invalid credentials", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Slide,
      });
    }
  } catch (err) {
    console.error("Login Error:", err);
    toast.error("Provide valid email and password. Please try again.", {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
      transition: Slide,
    });
  }
};

  return (
    <div>
      <div className="main-wrapper login-body">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-lg-6 login-wrap">
              <div className="login-sec">
                <div className="log-img">
                  <img
                    className="img-fluid"
                    src="assets/img/login-02.png"
                    alt="Logo"
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6 login-wrap-bg">
              <div className="login-wrapper">
                <div className="loginbox">
                  <div className="login-right">
                    <div className="login-right-wrap">
                      <div className="account-logo">
                        <Link to="/">
                          <img src="assets/img/login-logo.png" alt="" />
                        </Link>
                      </div>
                      <h2>Login</h2>

                      <form onSubmit={handleSubmit}>
                        <div className="input-block">
                          <label>
                            Email <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                        <div className="input-block">
                          <label>
                            Password <span className="login-danger">*</span>
                          </label>
                          <input
                            className="form-control pass-input"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <span className="profile-views feather-eye-off toggle-password">
                          <InputAdornment position="end" className="position-absolute top-50 end-0 translate-middle-y">
                            <IconButton onClick={togglePasswordVisibility} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                          </span>
                        </div>
                        {/* <div className="forgotpass">
                          <div className="remember-me">
                            <label className="custom_check mr-2 mb-0 d-inline-flex remember-me">
                              Remember me
                              <input type="checkbox" name="radio" />
                              <span className="checkmark"></span>
                            </label>
                          </div> */}
                        {/* <a href="forgot-password.html">Password?</a> */}
                        {/* </div> */}
                        <div className="input-block login-btn">
                          <button
                            className="btn btn-primary btn-block"
                            type="submit"
                          >
                            Login
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login_auth;
