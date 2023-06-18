import React, { useEffect, useState } from "react";
import "./HomePage.css";
import Navbar from "./components/Navbar";
import Finder from "./components/Finder";
import axios from "axios";

export default function HomePage() {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  useEffect(() => {
    getSkills()
      .then((skill) => setSkills(["Skills", ...skill]))
      .catch((e) => console.log(e));
  }, []);
  return (
    <div>
      <Navbar />
      <Finder />
      <select
        name="skills"
        id="skills"
        onChange={(e) => setSelectedSkills((prev) => [...prev, e.target.value])}
        className="HP_select"
      >
        {skills.map((item, key) => {
          return (
            <option value={item} key={key}>
              {item}
            </option>
          );
        })}
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
    skills = allJobs.data.map((item) => item.skillsRequired);
    skills = skills.flat();
    skills = skills.filter((item, index) => skills.indexOf(item) == index);
    return skills;
  } catch (error) {
    console.log(error);
    return "ERROR. CHKCONSOL.";
  }
}
