import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem("tema") || "light";
  });

  useEffect(() => {
    localStorage.setItem("tema", tema);
    document.body.setAttribute("data-theme", tema); // pentru stiluri CSS
  }, [tema]);

  const toggleTema = () => {
    setTema((curenta) => (curenta === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ tema, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
};
