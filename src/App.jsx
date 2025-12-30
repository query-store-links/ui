import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
  Card,
  CardHeader,
  Title1,
  Body1,
  Input,
  Select,
  Checkbox,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Link,
  Badge,
  makeStyles,
  shorthands,
  tokens,
  Label,
  Dialog,
  DialogTrigger,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  ProgressBar,
  Tooltip,
} from '@fluentui/react-components';

import {
  ArrowDownloadRegular,
  SearchRegular,
  BoxRegular,
  DocumentRegular,
  SettingsRegular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
  CodeRegular,
  CopyRegular,
  CheckmarkRegular,
  Cube24Regular,
} from '@fluentui/react-icons';

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setAndStore = (newValue) => {
    const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [value, setAndStore];
}

const normalizeData = (items, type) => {
  if (!items || !Array.isArray(items)) return [];
  return items.map(item => ({
    name: item.fileName || item.FileName || "Unknown",
    size: item.fileSize || item.FileSize || "N/A",
    url: item.fileLink || item.FileLink || "#",
    expire: item.fileExpire || item.FileExpire,
    type: type
  }));
};

const extractProductId = (input) => {
  if (!input) return "";
  const trimmed = input.trim();

  try {
    const urlMatch = trimmed.match(/apps\.microsoft\.com\/(?:.*\/)?(?:detail|productId)\/([A-Z0-9]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1].toUpperCase();
    }

    if (trimmed.includes('http')) {
      const url = new URL(trimmed);
      const pathSegments = url.pathname.split('/');
      for (const segment of pathSegments) {
        if (/^[A-Z0-9]{12,}$/i.test(segment)) {
          return segment.toUpperCase();
        }
      }
    }
  } catch (e) {
  }

  if (/^[A-Z0-9]{12,}$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }

  return trimmed;
};


const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  nav: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.padding('16px', '24px'),
    gap: '8px',
    '@media (max-width: 600px)': {
      ...shorthands.padding('12px', '16px'),
    }
  },
  container: {
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    ...shorthands.padding('0', '24px', '48px'),
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    flexGrow: 1,
    boxSizing: 'border-box',
    '@media (max-width: 600px)': {
      ...shorthands.padding('0', '16px', '24px'),
      gap: '16px',
    }
  },
  header: {
    textAlign: 'center',
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  card: {
    ...shorthands.padding('32px'),
    boxShadow: tokens.shadow8,
    backgroundColor: tokens.colorNeutralBackground1,
    '@media (max-width: 600px)': {
      ...shorthands.padding('16px'),
    }
  },
  inputSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '24px',
  },
  gridControls: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100%, 1fr))',
    '@media (min-width: 600px)': {
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    },
    gap: '20px',
    alignItems: 'end',
  },
  checkboxGroup: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '24px',
    flexWrap: 'wrap',
    gap: '16px',
    '@media (max-width: 600px)': {
      flexDirection: 'column',
      alignItems: 'stretch',
    }
  },
  tableContainer: {
    overflowX: 'auto',
    maxHeight: '600px',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '32px',
    paddingBottom: '24px',
    color: tokens.colorNeutralForeground3,
    fontSize: '12px',
    flexWrap: 'wrap',
  },
  hideOnMobile: {
    '@media (max-width: 600px)': {
      display: 'none',
    }
  }
});

const AdvancedSettings = ({ backend, setBackend, customMarket, setCustomMarket, locale, setLocale }) => {
  const styles = useStyles();

  const handleClear = () => {
    setBackend('https://qsl-api.krnl64.win');
    setCustomMarket('');
    setLocale('en-US');
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
          <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '12px' }}>
            <div>
              <Label weight="semibold">API Backend</Label>
              <Input
                style={{ width: '100%' }}
                value={backend}
                onChange={(e, d) => setBackend(d.value)}
                placeholder="https://qsl-api.krnl64.win"
              />
            </div>
            <div>
              <Label weight="semibold">Override Market (ISO)</Label>
              <Input
                style={{ width: '100%' }}
                value={customMarket}
                onChange={(e, d) => setCustomMarket(d.value)}
                placeholder="e.g. CN, RU"
              />
            </div>
            <div>
              <Label weight="semibold">Override Locale</Label>
              <Input
                style={{ width: '100%' }}
                value={locale}
                onChange={(e, d) => setLocale(d.value)}
                placeholder="e.g. en-US"
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="subtle" onClick={handleClear}>Reset Defaults</Button>
            <DialogTrigger disableButtonEnhancement>
              <Button appearance="primary">Done</Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};

const ResultsTable = ({ results }) => {
  const styles = useStyles();
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (url, index) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getTypeColor = (type) => {
    if (type === 'APPX') return 'brand';
    if (type === 'BlockMap') return 'important';
    return 'neutral';
  };

  return (
    <Card className={styles.card} style={{ padding: 0, overflow: 'hidden' }}>
      <CardHeader
        header={<Body1 weight="bold" size={500}>Result Files ({results.length})</Body1>}
        style={{ padding: '16px 24px', borderBottom: `1px solid ${tokens.colorNeutralStroke2}` }}
      />
      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ minWidth: '220px', width: '45%' }}>File Name</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: '80px', width: '15%' }}>Size</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: '80px', width: '15%' }}>Type</TableHeaderCell>
              <TableHeaderCell style={{ minWidth: '100px', width: '25%' }}>Actions</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <DocumentRegular
                      style={{ flexShrink: 0, color: tokens.colorNeutralForeground3 }}
                    />

                    <Tooltip content={item.name} relationship="label">
                      <span style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                        display: 'block',
                        cursor: 'default'
                      }}>
                        {item.name}
                      </span>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell style={{ whiteSpace: 'nowrap' }}>{item.size}</TableCell>
                <TableCell>
                  <Badge appearance="tint" color={getTypeColor(item.type)}>{item.type}</Badge>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Tooltip content="Download File" relationship="label">
                      <Button
                        as="a"
                        href={item.url}
                        target="_blank"
                        icon={<ArrowDownloadRegular />}
                        appearance="subtle"
                        aria-label="Download"
                      />
                    </Tooltip>
                    <Tooltip content="Copy Link" relationship="label">
                      <Button
                        icon={copiedIndex === idx ? <CheckmarkRegular color={tokens.colorPaletteGreenForeground1} /> : <CopyRegular />}
                        appearance="subtle"
                        onClick={() => handleCopy(item.url, idx)}
                        aria-label="Copy Link"
                      />
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

function App() {
  const styles = useStyles();

  const [isDark, setIsDark] = useLocalStorage('theme_dark', true);
  const [backend, setBackend] = useLocalStorage('qsl_backend', 'https://qsl-api.krnl64.win');
  const [customMarket, setCustomMarket] = useLocalStorage('qsl_market', '');

  const [formData, setFormData] = useState({
    productInput: '',
    market: 'US',
    locale: 'en-US',
    ring: 'Retail',
    identifierType: 'ProductID',
    includeAppx: true,
    includeNonAppx: true,
  });

  const [status, setStatus] = useState({ loading: false, error: null });
  const [results, setResults] = useState([]);

  // AbortController ref
  const abortControllerRef = useRef(null);

  const handleResolve = async () => {
    if (!formData.productInput) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setStatus({ loading: true, error: null });
    setResults([]);

    try {
      const apiUrl = `${backend.replace(/\/$/, '')}/api/links/resolve-all`;

      const finalInput = formData.identifierType === 'ProductID'
        ? extractProductId(formData.productInput)
        : formData.productInput.trim();

      const payload = {
        ...formData,
        productInput: finalInput,
        market: customMarket || formData.market
      };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText.substring(0, 100)}`);
      }

      const data = await res.json();

      const appx = normalizeData(data.appxPackages || data.appx || data.Appx, 'APPX');
      const nonAppx = normalizeData(data.nonAppxPackages || data.nonAppx || data.NonAppx, 'Other');

      const finalResults = [...appx, ...nonAppx];

      if (finalResults.length === 0) {
        throw new Error("No download links found for this product ID/URL.");
      }

      setResults(finalResults);
      setStatus({ loading: false, error: null });

    } catch (err) {
      if (err.name === 'AbortError') return;
      setStatus({ loading: false, error: err.message });
    }
  };

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <div className={styles.root}>

        {/* Navigation */}
        <nav className={styles.nav}>
          <Button
            appearance="subtle"
            icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Theme"
          />
          <AdvancedSettings
            backend={backend} setBackend={setBackend}
            customMarket={customMarket} setCustomMarket={setCustomMarket}
            locale={formData.locale} setLocale={(val) => setFormData(prev => ({ ...prev, locale: val }))}
          />
        </nav>

        <main className={styles.container}>

          {/* Header */}
          <header className={styles.header}>
            <Cube24Regular style={{ fontSize: 48, color: tokens.colorBrandForeground1 }} />
            <Title1>Query Store Links</Title1>
            <Body1 size={400} style={{ color: tokens.colorNeutralForeground2 }}>
              Generate direct download links from Microsoft Store
            </Body1>
          </header>

          {/* Main Input Card */}
          <Card className={styles.card}>
            <div className={styles.inputSection}>
              <Label htmlFor="url-input" size="large" weight="semibold" required>Product URL or ID</Label>
              <Input
                id="url-input"
                contentBefore={<BoxRegular />}
                size="large"
                placeholder="e.g. 9WZDNCRFJBMP or https://apps.microsoft.com/..."
                value={formData.productInput}
                onChange={(e, d) => setFormData(p => ({ ...p, productInput: d.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleResolve()}
              />
            </div>

            <div>
              <Label weight="semibold">ID Type</Label>
              <Select
                style={{ width: '100%' }}
                value={formData.identifierType}
                onChange={(e, d) => setFormData(p => ({ ...p, identifierType: d.value }))}
              >
                <option value="ProductID">Product ID</option>
                <option value="PackageFamilyName">Package Family Name</option>
                <option value="XboxTitleID">Xbox Title ID</option>
                <option value="ContentID">Content ID</option>
                <option value="LegacyWindowsPhoneProductID">Legacy Phone ID</option>
                <option value="LegacyWindowsStoreProductID">Legacy Store ID</option>
                <option value="LegacyXboxProductID">Legacy Xbox ID</option>
              </Select>
            </div>

            <div className={styles.gridControls}>
              <div>
                <Label weight="semibold">Market</Label>
                <Select style={{ width: '100%' }} value={formData.market} onChange={(e, d) => setFormData(p => ({ ...p, market: d.value }))}>
                  <option value="US">United States (US)</option>
                  <option value="CN">China (CN)</option>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="JP">Japan (JP)</option>
                  <option value="DE">Germany (DE)</option>
                </Select>
              </div>

              <div>
                <Label weight="semibold">Ring</Label>
                <Select style={{ width: '100%' }} value={formData.ring} onChange={(e, d) => setFormData(p => ({ ...p, ring: d.value }))}>
                  <option value="Retail">Retail (Stable)</option>
                  <option value="RP">Release Preview</option>
                  <option value="Fast">Insider Fast (Dev)</option>
                  <option value="Slow">Insider Slow (Beta)</option>
                </Select>
              </div>

              <div>
                <Label weight="semibold">Filter</Label>
                <div className={styles.checkboxGroup}>
                  <Checkbox label="APPX" checked={formData.includeAppx} onChange={(e, d) => setFormData(p => ({ ...p, includeAppx: !!d.checked }))} />
                  <Checkbox label="Non-APPX" checked={formData.includeNonAppx} onChange={(e, d) => setFormData(p => ({ ...p, includeNonAppx: !!d.checked }))} />
                </div>
              </div>
            </div>

            {status.loading && <ProgressBar style={{ marginTop: '24px' }} />}

            <div className={styles.actionRow}>
              <Body1 size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                Ready to fetch links from {formData.ring} ring.
              </Body1>
              <Button
                appearance="primary"
                icon={<SearchRegular />}
                size="large"
                disabled={status.loading || !formData.productInput}
                onClick={handleResolve}
              >
                Resolve Links
              </Button>
            </div>
          </Card>

          {/* Error Message */}
          {status.error && (
            <MessageBar intent="error">
              <MessageBarBody>
                <MessageBarTitle>Resolution Failed</MessageBarTitle>
                {status.error}
              </MessageBarBody>
            </MessageBar>
          )}

          {/* Results */}
          {results.length > 0 && <ResultsTable results={results} />}

        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CodeRegular />
            <Link href="https://github.com/query-store-links/ui" target="_blank">GitHub</Link>
          </div>
          <span>•</span>
          <Body1>© 2025 QueryStoreLinks</Body1>
        </footer>

      </div>
    </FluentProvider>
  );
}

export default App;
