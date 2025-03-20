import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../utils"; // Utility for showing success message

function Home() {
  const [logginUser, setLogginUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLogginUser(localStorage.getItem("LogginUser"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("LogginUser");
    handleSuccess("Logout Successful!");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  // const renderTabContent = (tabId) => {
  //   switch (tabId) {
  //     case "Home":
  //       return <HomeContent setActiveTab={setActiveTab} />;
  //     case "Profile":
  //       return <h2><Profile/></h2>; // Replace with your Profile component
  //     case "Create":
  //       return <h2><Create/></h2>; // Replace with your Create component
  //     case "Your Work":
  //       return <h2><YourWork/></h2>; // Replace with your Your Work component
  //     case "Check ATS Score":
  //       return <h2><CheckATS/></h2>; // Replace with your Check ATS Score component
  //     case "Tutorials":
  //       return <h2><Tutorials/></h2>; // Replace with your Tutorials component
  //     case "About":
  //       return <h2><About/></h2>; // Replace with your About component
  //     case "Contact us":
  //       return <h2><Contact/></h2>; // Replace with your Contact component
  //     default:
  //       return <h2>Page Not Found</h2>;
    // }
  

  return (
    <div>
      {/* <h1 className="NameWelcome">Welcome, {logginUser || "Guest"}</h1> */}
      <div className="homepage">
        <div className="sidebar">
      <button onClick={handleLogout}           style={{ 
            padding: "8px 18px", 
            backgroundColor: "#1abc9c", 
            margin: "8px",
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer", 
            fontSize: "16px" 
          }}>Logout</button>
      <ToastContainer />
          <div className="profile">
            <img id="profile-pic" src="default-user.png" alt="User Profile" />
            
          </div>
          {/* <div className="tab-buttons">
            {[
              "Home",
              "Profile",
              "Create",
              "Your Work",
              "Check ATS Score",
              "Tutorials",
              "About",
              "Contact us",
            ].map((tab) => (
              <button */}
                {/* key={tab}
                className={`tab-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div> */}
        </div>
        {/* <div className="tab-content">{renderTabContent(activeTab)}</div> */}
      </div>
    </div>
  );
}

export default Home;
