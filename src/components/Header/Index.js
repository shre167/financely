import React, { useEffect, useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import userImg from "../../assets/user.svg";

function Header() {
  const [user, loading] = useAuthState(auth);
  const [profilePic, setProfilePic] = useState(userImg);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/"); // Navigate to login if user is not logged in
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.photoURL) {
      setProfilePic(user.photoURL); // Set user's profile picture
    } else {
      setProfilePic(userImg); // Fallback to default image
    }
  }, [user]);

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged Out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      <p className="logo">Financely.</p>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <img
            src={profilePic}
            alt="User Profile"
            onError={(e) => {
              console.error("Image failed to load:", profilePic); // Log failed URL
              e.target.src = userImg; // Fallback image
            }}
            style={{
              borderRadius: "50%",
              height: "3rem",
              width: "3rem",
              objectFit: "cover",
              border: "2px solid #fff",
            }}
          />
          <p className="logo link" onClick={logoutFnc}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;
