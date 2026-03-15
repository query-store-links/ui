import React from "react";
import { Body1, Link, makeStyles, tokens } from "@fluentui/react-components";
import { CodeRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  footer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginTop: "auto",
    paddingTop: "32px",
    paddingBottom: "24px",
    color: tokens.colorNeutralForeground3,
    fontSize: "12px",
    flexWrap: "wrap",
  },
});

const Footer: React.FC = () => {
  const styles = useStyles();
  return (
    <footer className={styles.footer}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <CodeRegular />
        <Link href="https://github.com/query-store-links/ui" target="_blank">
          GitHub
        </Link>
      </div>
      <span>•</span>
      <Body1>© 2026 QueryStoreLinks</Body1>
    </footer>
  );
};

export default Footer;
