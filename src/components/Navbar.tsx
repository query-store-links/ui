import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  makeStyles,
  shorthands,
  tokens,
} from "@fluentui/react-components";
import {
  WeatherMoonRegular,
  WeatherSunnyRegular,
  LinkRegular,
  HomeRegular,
} from "@fluentui/react-icons";
import AdvancedSettings from "./AdvancedSettings";

interface NavbarProps {
  isDark: boolean;
  setIsDark: (value: boolean) => void;
  backend: string;
  setBackend: (value: string) => void;
  customMarket: string;
  setCustomMarket: (value: string) => void;
  locale: string;
  setLocale: (value: string) => void;
}

const useStyles = makeStyles({
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ...shorthands.padding("16px", "24px"),
    "@media (max-width: 600px)": {
      ...shorthands.padding("12px", "16px"),
    },
  },
  rightSection: {
    display: "flex",
    gap: "8px",
  },
  navLinks: {
    display: "flex",
    gap: "8px",
  },
});

const Navbar: React.FC<NavbarProps> = ({
  isDark,
  setIsDark,
  backend,
  setBackend,
  customMarket,
  setCustomMarket,
  locale,
  setLocale,
}) => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <nav className={styles.nav}>
      <div className={styles.navLinks}>
        <Button
          appearance={isHome ? "subtle" : "transparent"}
          icon={<HomeRegular />}
          onClick={() => navigate("/")}
          style={{
            fontWeight: isHome ? "bold" : "normal",
            color: isHome ? tokens.colorBrandForeground1 : "inherit",
          }}
        >
          Home
        </Button>
        <Button
          appearance={!isHome ? "subtle" : "transparent"}
          icon={<LinkRegular />}
          onClick={() => navigate("/generator")}
          style={{
            fontWeight: !isHome ? "bold" : "normal",
            color: !isHome ? tokens.colorBrandForeground1 : "inherit",
          }}
        >
          Generator
        </Button>
      </div>

      <div className={styles.rightSection}>
        <Button
          appearance="subtle"
          icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle Theme"
        />
        <AdvancedSettings
          backend={backend}
          setBackend={setBackend}
          customMarket={customMarket}
          setCustomMarket={setCustomMarket}
          locale={locale}
          setLocale={setLocale}
        />
      </div>
    </nav>
  );
};

export default Navbar;
