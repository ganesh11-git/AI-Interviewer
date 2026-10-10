import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { saveProfile } from "../services/learningApi";
import "../styles/profile.css";

export default function Profile() {

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    college: "",
    degree: "",
    year: "",
    resumeUrl: "",
  });

  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");

  
  useEffect(() => {
    const savedProfile = localStorage.getItem("profileData");

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      console.log("Loaded Profile:", parsed); // DEBUG
      setProfile(parsed);
      if (parsed.resumeUrl) setResumeUrl(parsed.resumeUrl);
    } else {
      setProfile((prev) => ({
        ...prev,
        name: localStorage.getItem("userName") || "",
        email: localStorage.getItem("userEmail") || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleResume = (e) => {
    setResume(e.target.files[0]);
    console.log("Selected file:", e.target.files[0]); // DEBUG
  };

  
  const handleSave = async () => {
    try {
      const formData = new FormData();
      Object.keys(profile).forEach((key) => {
        formData.append(key, profile[key]);
      });

      if (resume) formData.append("resume", resume);

      const res = await saveProfile(formData);
      console.log("SERVER RESPONSE:", res.data); // 🔥 VERY IMPORTANT

      let updatedProfile = { ...profile };

      
      if (res.data.resumeUrl) {
        const url = `http://localhost:5000${res.data.resumeUrl}`;
        console.log("Resume URL:", url);

        setResumeUrl(url);
        updatedProfile.resumeUrl = url;
      }

      
      localStorage.setItem("profileData", JSON.stringify(updatedProfile));

      alert("Profile + Resume Saved Successfully ✅");

    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert("Error saving profile ❌ Check backend");
    }
  };

  return (
    <>
      <Navbar />

      <div className="profile-wrapper">
        <div className="profile-card">

          <h2>Personal Information</h2>

          <input name="name" value={profile.name} placeholder="Full Name" onChange={handleChange} />
          <input name="email" value={profile.email} placeholder="Email" onChange={handleChange} />
          <input name="phone" value={profile.phone} placeholder="Phone" onChange={handleChange} />
          <input name="location" value={profile.location} placeholder="Location" onChange={handleChange} />

          <h2>Education</h2>

          <input name="college" value={profile.college} placeholder="College" onChange={handleChange} />
          <input name="degree" value={profile.degree} placeholder="Degree" onChange={handleChange} />
          <input name="year" value={profile.year} placeholder="Graduation Year" onChange={handleChange} />

          <h2>Upload Resume</h2>
          <input type="file" onChange={handleResume} />

          
          {resumeUrl && (
            <p>
              Resume Uploaded:{" "}
              <a href={resumeUrl} target="_blank" rel="noreferrer">
                Download Resume
              </a>
            </p>
          )}

          <button className="save-btn" onClick={handleSave}>
            SAVE CHANGES
          </button>

        </div>
      </div>
    </>
  );
}
