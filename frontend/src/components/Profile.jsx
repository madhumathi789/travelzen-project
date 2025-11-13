import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const username = localStorage.getItem("username"); // ✅ assume stored on login

  // Fetch user data
  useEffect(() => {
    if (username) {
      axios
        .get(`http://localhost:5000/api/profile/${username}`)
        .then((res) => {
          setProfile(res.data);
          setEmail(res.data.email);
        })
        .catch((err) => console.error(err));
    }
  }, [username]);

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (image) formData.append("profilePic", image);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/profile/${username}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Profile updated successfully!");
      setProfile(res.data.updatedUser);
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        <img
          src={
            profile.profilePic
              ? `http://localhost:5000${profile.profilePic}`
              : "/default-avatar.png"
          }
          alt="Profile"
          className="profile-image"
        />
        <form onSubmit={handleUpdate}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Profile Picture:</label>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
