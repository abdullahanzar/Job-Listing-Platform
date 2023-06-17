import React from "react";
import "./HomePage.css";
import Navbar from "./components/Navbar";
import Finder from "./components/Finder";
import axios from "axios";

export default function HomePage() {
  getSkills();
  return (
    <div>
      <Navbar />
      <Finder />
      <select name="skills" id="skills">
        {}
      </select>
    </div>
  );
}

async function getSkills() {
  let skills;
  try {
    const allJobs = await axios.get(
      "https://job-listing-server.onrender.com/job"
    );
    skills = allJobs.data.map((item) => {
      console.log(item.skillsRequired)
      if (Array.isArray(item.skillsRequired)) {
        return item.skillsRequired.map((item) => item);
      } else return items.skillsRequired;
    });
    console.log(skills);
  } catch (error) {
    console.log(error);
  }
}
