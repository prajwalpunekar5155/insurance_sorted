import React, { useState, useEffect } from "react";
import InnerNavbar from "../InnerNavbar";
import axios from "axios";
import { toast, Slide } from "react-toastify";

const EditProfile = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    username: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    mobileno: "",
    password: "", // Ensure password is handled securely
  });

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
              postalCode: addressDetails?.postal_code || "",
            }));
          }
        })
        .catch((error) => {
          console.error("Error fetching user details:", error);
        })
        .finally(() => setLoading(false));
    }
  }, []);
  // Fetch address and contact details from the second API
  useEffect(() => {
    const tokenKey = sessionStorage.getItem("tokenKey");
    if (tokenKey) {
      axios
        .get(
          `http://localhost:8085/getAdressMasterDetails?tokenKey=${tokenKey}`
        )
        .then((response) => {
          const { userDetails: userData } = response.data;
          setUserDetails((prevDetails) => ({
            ...prevDetails,
            address: userData.address || "",
            country: userData.country || "",
            state: userData.state || "",
            city: userData.city || "",
            pincode: userData.pincode || "",
            mobileno: userData.mobileno || "",
          }));
        })
        .catch((err) => {
          // toast.error("Error fetching address details", {
          //   position: "top-right",
          //   autoClose: 3000,
          //   theme: "colored",
          //   transition: Slide,
          // });
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form's default behavior
    const tokenKey = sessionStorage.getItem("tokenKey");

    if (!tokenKey) {
      toast.error("Token key is missing!");
      return;
    }

    const profileData = {
      tokenKey,
      address: userDetails.address,
      country: userDetails.country,
      state: userDetails.state,
      city: userDetails.city,
      pincode: userDetails.pincode,
      mobileno: userDetails.mobileno,
    };

    axios
      .post("http://localhost:8085/saveProfile", profileData)
      .then((response) => {
        if (response.data.status === "1") {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
        toast.error("Failed to save profile");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <div className="main-wrapper">
        <InnerNavbar />
        <div className="page-wrapper">
          <div className="content">
            {/* Page Header */}
            <div className="page-header">
              <div className="row">
                <div className="col-sm-12">
                  <ul className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="index.html">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item">
                      <i className="feather-chevron-right" />
                    </li>
                    <li className="breadcrumb-item active">Edit Profile</li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Page Header */}
            <form onSubmit={handleSubmit}>
              <div className="card-box">
                <h3 className="card-title">Basic Information</h3>
                <div className="row">
                  <div className="col-md-12">
                    <div className="profile-img-wrap">
                      <img
                        className="inline-block"
                        src="assets/img/user.jpg"
                        alt="user"
                      />
                      <div className="fileupload btn">
                        <span className="btn-text">edit</span>
                        <input className="upload" type="file" />
                      </div>
                    </div>
                    <div className="profile-basic">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="input-block local-forms">
                            <label className="focus-label">Name</label>
                            <input
                              type="text"
                              className="form-control floating"
                              name="name"
                              value={userDetails.name}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block local-forms">
                            <label className="focus-label">Email</label>
                            <input
                              type="email"
                              className="form-control floating"
                              name="email"
                              value={userDetails.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block local-forms">
                            <label className="focus-label">Username</label>
                            <input
                              type="text"
                              className="form-control floating"
                              name="username"
                              value={userDetails.username}
                              onChange={handleChange}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="input-block local-forms">
                            <label className="focus-label">Address</label>
                            <input
                              type="text"
                              className="form-control floating"
                              name="address"
                              value={userDetails.address}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-box">
                <h3 className="card-title">Contact Information</h3>
                <div className="row">
                  <div className="col-md-6">
                    <div className="input-block local-forms">
                      <label className="focus-label">Country</label>
                      <input
                        type="text"
                        className="form-control floating"
                        name="country"
                        value={userDetails.country}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block local-forms">
                      <label className="focus-label">State</label>
                      <input
                        type="text"
                        className="form-control floating"
                        name="state"
                        value={userDetails.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block local-forms">
                      <label className="focus-label">City</label>
                      <input
                        type="text"
                        className="form-control floating"
                        name="city"
                        value={userDetails.city}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block local-forms">
                      <label className="focus-label">Pin Code</label>
                      <input
                        type="text"
                        className="form-control floating"
                        name="pincode"
                        value={userDetails.pincode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-block local-forms">
                      <label className="focus-label">Mobile No</label>
                      <input
                        type="text"
                        className="form-control floating"
                        name="mobileno"
                        value={userDetails.mobileno}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <button
                  className="btn btn-primary submit-btn mb-4"
                  type="submit"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
          <footer
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
          </footer>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
