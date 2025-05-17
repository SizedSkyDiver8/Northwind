import React, { useEffect, useState } from "react";

export default function DarkModeSwitch() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Toggle dark mode and persist preference in localStorage
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <div
      className={`dark-mode-toggle ${darkMode ? "on" : ""}`}
      onClick={() => setDarkMode((prev) => !prev)}
    >
      <div className="slider" />
    </div>
  );
}
