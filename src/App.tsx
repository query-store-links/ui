import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
  makeStyles,
  tokens,
} from "@fluentui/react-components";

import { useLocalStorage } from "./hooks/useLocalStorage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MigrationBanner from "./components/MigrationBanner";
import Home from "./pages/Home";
import LinkGenerator from "./pages/LinkGenerator";

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

function App() {
  const styles = useStyles();

  const [isDark, setIsDark] = useLocalStorage<boolean>("theme_dark", () => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return true;
  });
  const [backend, setBackend] = useLocalStorage<string>(
    "qsl_backend",
    "https://qsl-api.krnl64.win",
  );
  const [customMarket, setCustomMarket] = useLocalStorage<string>(
    "qsl_market",
    "",
  );
  const [locale, setLocale] = useLocalStorage<string>("qsl_locale", "en-US");

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <div className={styles.root}>
        <BrowserRouter>
          <MigrationBanner />
          <Navbar
            isDark={isDark}
            setIsDark={setIsDark}
            backend={backend}
            setBackend={setBackend}
            customMarket={customMarket}
            setCustomMarket={setCustomMarket}
            locale={locale}
            setLocale={setLocale}
          />

          <Routes>
            <Route
              path="/"
              element={<Home backend={backend} customMarket={customMarket} />}
            />
            <Route path="/generator" element={<LinkGenerator />} />
          </Routes>

          <Footer />
        </BrowserRouter>
      </div>
    </FluentProvider>
  );
}

export default App;
