import React from "react";
import "./Navbar.css";
import { useContext } from "react";
import { PlatformContext } from "../../../assets/PlatformContext";

export default function Navbar() {
  const { isLoggedIn } = useContext(PlatformContext);
  const login = ()=>{}
  const logout = ()=>{}
  const register = ()=>{}
  return (
    <>
      <div className="navbar">
        <div className="overlays">
          <div className="NVtriangleOverlay" />
          <div className="NVmiddleOverlay" />
          <div className="NVsideOverlay" />
        </div>
        <div className="NVcontent">
          <p>JobFinder</p>
          {!isLoggedIn && (
            <div className="buttons">
              <button onClick={login}>Login</button>
              <button onClick={register}>Register</button>
            </div>
          )}
          {isLoggedIn && (
            <div className="NVrecruiter">
              <p onClick={logout}>Logout</p>
              <p>Hello! Recruiter</p>
              <img src="" alt="Profile Pic" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
