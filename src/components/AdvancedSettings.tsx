import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Button,
  Input,
  Label,
  makeStyles,
} from "@fluentui/react-components";
import { SettingsRegular } from "@fluentui/react-icons";

interface AdvancedSettingsProps {
  backend: string;
  setBackend: (value: string) => void;
  customMarket: string;
  setCustomMarket: (value: string) => void;
  locale: string;
  setLocale: (value: string) => void;
}

const useStyles = makeStyles({
  hideOnMobile: {
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
});

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  backend,
  setBackend,
  customMarket,
  setCustomMarket,
  locale,
  setLocale,
}) => {
  const styles = useStyles();

  const handleClear = () => {
    setBackend("https://qsl-api.krnl64.win");
    setCustomMarket("");
    setLocale("en-US");
  };

  return (
    <Dialog>
      <DialogTrigger disableButtonEnhancement>
        <Button appearance="subtle" icon={<SettingsRegular />}>
          <span className={styles.hideOnMobile}>Advanced</span>
        </Button>
      </DialogTrigger>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Advanced Configuration</DialogTitle>
          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingTop: "12px",
            }}
          >
            <div>
              <Label weight="semibold">API Backend</Label>
              <Input
                style={{ width: "100%" }}
                value={backend}
                onChange={(_, d) => setBackend(d.value)}
                placeholder="https://qsl-api.krnl64.win"
              />
            </div>
            <div>
              <Label weight="semibold">Override Market (ISO)</Label>
              <Input
                style={{ width: "100%" }}
                value={customMarket}
                onChange={(_, d) => setCustomMarket(d.value)}
                placeholder="e.g. CN, RU"
              />
            </div>
            <div>
              <Label weight="semibold">Override Locale</Label>
              <Input
                style={{ width: "100%" }}
                value={locale}
                onChange={(_, d) => setLocale(d.value)}
                placeholder="e.g. en-US"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="subtle" onClick={handleClear}>
              Reset Defaults
            </Button>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">Done</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

export default AdvancedSettings;
