import React from "react";

const themes ={
  light: {
    backgroundColor: "#fff",
    colorPrimary: "black",
    colorSecondary: "rgba(0,0,0,0.5)",
    borderColor: 'rgba(0,0,0,0.2)'
  },
  dark: {
    backgroundColor: "black",
    colorPrimary: "white",
    colorSecondary: "rgba(255,255,255,0.7)",
    borderColor: "rgba(255,255,255,0.7)"
  }
}
const ThemeContext = React.createContext({
  theme: themes.light,
  toggleTheme: () =>{}
});

export  {ThemeContext, themes};
