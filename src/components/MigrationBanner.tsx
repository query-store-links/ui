import React from "react";
import {
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  MessageBarActions,
  Button,
  Link,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import { DismissRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  banner: {
    ...shorthands.margin("8px", "16px", "0"),
    "@media (max-width: 600px)": {
      ...shorthands.margin("8px", "8px", "0"),
    },
  },
});

const MigrationBanner: React.FC = () => {
  const styles = useStyles();
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <MessageBar
      intent="warning"
      politeness="assertive"
      className={styles.banner}
    >
      <MessageBarBody>
        <MessageBarTitle>This project has migrated.</MessageBarTitle>
        Continue at{" "}
        <Link
          href="https://github.com/query-store-links/qsl-worker"
          target="_blank"
          rel="noopener noreferrer"
        >
          qsl-worker
        </Link>{" "}
        for UI improvements and an included backend. Please use that instead.
      </MessageBarBody>
      <MessageBarActions
        containerAction={
          <Button
            aria-label="Dismiss"
            appearance="transparent"
            icon={<DismissRegular />}
            onClick={() => setDismissed(true)}
          />
        }
      />
    </MessageBar>
  );
};

export default MigrationBanner;
