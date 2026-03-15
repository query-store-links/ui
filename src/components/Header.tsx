import React from "react";
import {
  Title1,
  Body1,
  Text,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import { Cube24Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  header: {
    textAlign: "center",
    marginBottom: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
});

const Header: React.FC = () => {
  const styles = useStyles();
  return (
    <header className={styles.header}>
      <Cube24Regular
        style={{ fontSize: 48, color: tokens.colorBrandForeground1 }}
      />
      <Title1>Query Store Links</Title1>
      <Text size={400} style={{ color: tokens.colorNeutralForeground2 }}>
        Generate direct download links from Microsoft Store
      </Text>
    </header>
  );
};

export default Header;
