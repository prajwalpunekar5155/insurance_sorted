import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navBar";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenKey = sessionStorage.getItem("tokenKey");

    if (tokenKey) {
      axios
        .get(`http://localhost:8085/getUserDetails?tokenKey=${tokenKey}`)
        .then((response) => {
          if (response.data.status === "1") {
            const { adminDetails, addressDetails } = response.data.userDetails;

            setUserDetails((prevDetails) => ({
              ...prevDetails,
              name: adminDetails?.name || "",
              post: adminDetails?.post || "",
              email: adminDetails?.email || "",
              username: adminDetails?.username || "",
              address: addressDetails?.address || "",
              city: addressDetails?.city || "",
              state: addressDetails?.state || "",
              country: addressDetails?.country || "",
              postalCode: addressDetails?.pincode || "",
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="main-wrapper">
        <Navbar />

        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-sm-7 col-6">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to={"/profile"}>Dashboard </Link>
                  </li>
                  <li className="breadcrumb-item">
                    <i className="feather-chevron-right" />
                  </li>
                  <li className="breadcrumb-item active">My Profile</li>
                </ul>
              </div>
              <div className="col-sm-5 col-6 text-end m-b-30">
                <Link
                  to={`/edit-profile`}
                  className="btn btn-primary btn-rounded"
                >
                  <i className="fa fa-plus" /> Edit Profile
                </Link>
              </div>
            </div>
            <div className="card-box profile-header">
              <div className="row">
                <div className="col-md-12">
                  <div className="profile-view">
                    <div className="profile-img-wrap">
                      <div className="profile-img">
                        <a href="#">
                          <img
                            className="avatar"
                            src="assets/img/doctor-03.jpg"
                            alt=""
                          />
                        </a>
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-5">
                          <div className="profile-info-left">
                            <h3 className="user-name m-t-0 mb-0">
                             Name: {userDetails.name}
                            </h3>
                            <small className="text-muted">
                             Post: {userDetails.post}
                            </small>
                            <div className="staff-id">
                              Username : {userDetails.username}
                            </div>
                            {/* <div className="staff-msg">
                              <a href="chat.html" className="btn btn-primary">
                                Send Message
                              </a>
                            </div> */}
                          </div>
                        </div>
                        <div className="col-md-7">
                          <ul className="personal-info">
                            <li>
                              <span className="title">Phone:</span>
                              <span className="text">
                                <a href="#">770-889-6484</a>
                              </span>
                            </li>
                            <li>
                              <span className="title">Email:</span>
                              <span className="text">
                                <a href="#">
                                  <span
                                    className="__cf_email__"
                                    data-cfemail="dab9a8b3a9aeb3b4bbbda8b5acbfa99abfa2bbb7aab6bff4b9b5b7"
                                  >
                                    {userDetails.email}
                                  </span>
                                </a>
                              </span>
                            </li>
                            <li>
                              <span className="title">Birthday:</span>
                              <span className="text">3rd March</span>
                            </li>
                            <li>
                              <span className="title">Address:</span>
                              <span className="text">
                               {userDetails.address}
                              </span>
                              </li>
                            <li>
                              <span className="title">City:</span>
                              <span className="text">
                               {userDetails.city}
                              </span>
                            </li>
                            <li>
                              <span className="title">Pincode:</span>
                              <span className="text">
                               {userDetails.pincode}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <footer
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#f1f1f1",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        © {new Date().getFullYear()}{" "}
        <a
          href="https://sitsolutions.co.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          S IT Solutions Pvt. Ltd.
        </a>{" "}
        All Rights Reserved.
      </footer>  */}
    </div>
  );
};

export default Profile;
