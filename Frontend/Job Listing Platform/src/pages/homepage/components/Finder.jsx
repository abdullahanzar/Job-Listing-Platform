import React from "react";
import "./Finder.css";
import FinderIcon from "./images/FindIcon.png";

export default function Finder() {
  return (
    <div className="finder">
      <input
        type="text"
        name="Job"
        id="SearchJob"
        placeholder={`Type any job title.`}
      />
      <img src={FinderIcon} alt="ICON" />
    </div>
  );
}
