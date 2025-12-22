import React, { useState, useEffect } from 'react';
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
} from '@fluentui/react-components';

import {
  ArrowDownloadRegular,
  SearchRegular,
  BoxRegular,
  DocumentRegular,
  ErrorCircleRegular,
  SettingsRegular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
  CodeRegular
} from '@fluentui/react-icons';

import './index.css';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
  },
  container: {
    width: '100%',
    boxSizing: 'border-box',
    ...shorthands.padding('20px', '40px'),
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    flexGrow: 1,
  },
  topNav: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.padding('10px', '40px'),
    gap: '8px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  heroInputSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
  },
  controlsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    alignItems: 'end',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    gridColumn: '1 / -1',
    flexWrap: 'wrap',
    gap: '12px'
  },
  footer: {
    textAlign: 'center',
    ...shorthands.padding('24px'),
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '12px',
    color: tokens.colorNeutralForeground3,
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    ...shorthands.padding('10px', '0'),
  }
});

function App() {
  const styles = useStyles();

  // 记住设置功能：初始化时读取 localStorage
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') !== 'light');
  const [backend, setBackend] = useState(() => localStorage.getItem('backend') || 'https://qsl-api.krnl64.win');
  const [customMarket, setCustomMarket] = useState(() => localStorage.getItem('customMarket') || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);

  const [formData, setFormData] = useState({
    productInput: '',
    market: 'US',
    locale: 'en-US',
    ring: 'Retail',
    includeAppx: true,
    includeNonAppx: true,
  });

  // 监听变化并写入 localStorage
  useEffect(() => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('backend', backend);
    localStorage.setItem('customMarket', customMarket);
  }, [isDark, backend, customMarket]);

  const handleResolve = async () => {
    if (!formData.productInput) return;
    setLoading(true);
    setError('');

    try {
      const apiUrl = `${backend.replace(/\/$/, '')}/api/links/resolve-all`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          market: customMarket || formData.market
        }),
      });

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();

      const appx = data.appxPackages || data.appx || data.Appx || [];
      const nonAppx = data.nonAppxPackages || data.nonAppx || data.NonAppx || [];

      setResults([
        ...appx.map(i => ({ ...i, type: 'APPX' })),
        ...nonAppx.map(i => ({ ...i, type: 'Non-APPX' }))
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme} className={styles.root}>
      <nav className={styles.topNav}>
        <Button
          appearance="subtle"
          icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
          onClick={() => setIsDark(!isDark)}
        />

        <Dialog>
          <DialogTrigger disableButtonEnhancement>
            <Button appearance="subtle" icon={<SettingsRegular />}>Advanced</Button>
          </DialogTrigger>
          <DialogSurface>
            <DialogBody>
              <DialogTitle>Advanced Settings</DialogTitle>
              <DialogContent className={styles.dialogContent}>
                <div>
                  <Label weight="semibold">Backend Server</Label>
                  <Input style={{ width: '100%' }} value={backend} onChange={(e) => setBackend(e.target.value)} />
                </div>
                <div>
                  <Label weight="semibold">Override Market (ISO)</Label>
                  <Input style={{ width: '100%' }} value={customMarket} onChange={(e) => setCustomMarket(e.target.value)} placeholder="e.g. CN, US, JP" />
                </div>
              </DialogContent>
              <DialogActions>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="primary">Close</Button>
                </DialogTrigger>
              </DialogActions>
            </DialogBody>
          </DialogSurface>
        </Dialog>
      </nav>

      <main className={styles.container}>
        <header className={styles.header}>
          <Title1 color={tokens.colorBrandForeground1} style={{ fontSize: '3rem' }}>QueryStoreLinks</Title1>
        </header>

        <Card style={{ padding: '30px' }}>
          <div className={styles.heroInputSection}>
            <Label htmlFor="url" size="large" weight="bold">Product URL or ID</Label>
            <Input
              id="url"
              contentBefore={<BoxRegular />}
              size="large"
              style={{ width: '100%' }}
              placeholder="Paste URL or ID (e.g., 9WZDNCRFJBMP)"
              value={formData.productInput}
              onChange={(e) => setFormData(p => ({ ...p, productInput: e.target.value }))}
            />
          </div>

          <div className={styles.controlsGrid}>
            <div>
              <Label weight="semibold">Market</Label>
              <Select style={{ width: '100%' }} value={formData.market} onChange={(e) => setFormData(p => ({ ...p, market: e.target.value }))}>
                <option value="US">United States (US)</option>
                <option value="CN">China (CN)</option>
                <option value="GB">United Kingdom (GB)</option>
              </Select>
            </div>

            <div>
              <Label weight="semibold">Ring</Label>
              <Select style={{ width: '100%' }} value={formData.ring} onChange={(e) => setFormData(p => ({ ...p, ring: e.target.value }))}>
                <option value="Retail">Retail</option>
                <option value="RP">Release Preview</option>
                <option value="Fast">Insider Fast</option>
              </Select>
            </div>

            <div className={styles.actions}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <Checkbox label="APPX" checked={formData.includeAppx} onChange={(e, d) => setFormData(p => ({ ...p, includeAppx: !!d.checked }))} />
                <Checkbox label="Non-APPX" checked={formData.includeNonAppx} onChange={(e, d) => setFormData(p => ({ ...p, includeNonAppx: !!d.checked }))} />
              </div>
              <Button
                appearance="primary"
                icon={<SearchRegular />}
                size="large"
                loading={loading}
                disabled={loading || !formData.productInput}
                onClick={handleResolve}
              >
                {loading ? "Resolving..." : "Resolve Links"}
              </Button>
            </div>
          </div>
        </Card>

        {error && <div className={styles.errorBox}><ErrorCircleRegular /> {error}</div>}

        {results.length > 0 && (
          <Card>
            <CardHeader header={<Body1 weight="bold">Results ({results.length})</Body1>} />
            <div style={{ overflowX: 'auto' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>File Name</TableHeaderCell>
                    <TableHeaderCell style={{ width: '120px' }}>Size</TableHeaderCell>
                    <TableHeaderCell style={{ width: '100px' }}>Type</TableHeaderCell>
                    <TableHeaderCell style={{ width: '100px' }}>Link</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell><DocumentRegular style={{ marginRight: '8px' }} /> {item.fileName || item.FileName}</TableCell>
                      <TableCell>{item.fileSize || item.FileSize}</TableCell>
                      <TableCell><Badge appearance="tint">{item.type}</Badge></TableCell>
                      <TableCell><Link href={item.fileLink || item.FileLink} target="_blank">Download</Link></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </main>

      <footer className={styles.footer}>
        <CodeRegular />
        <Link href="https://github.com/query-store-links" target="_blank">GitHub</Link>
        <span>•</span>
        <Body1>© 2025 QueryStoreLinks</Body1>
      </footer>
    </FluentProvider>
  );
}

export default App;