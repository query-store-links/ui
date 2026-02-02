import React, { useState, useRef } from 'react';
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
  makeStyles,
  shorthands,
  tokens,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
} from '@fluentui/react-components';

// Hooks & Utils
import { useLocalStorage } from './hooks/useLocalStorage';
import { normalizeData, extractProductId } from './utils/helpers';

// Components
import Navbar from './components/Navbar';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultsTable from './components/ResultsTable';
import Footer from './components/Footer';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
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
});

function App() {
  const styles = useStyles();

  // Settings / Persisted State
  const [isDark, setIsDark] = useLocalStorage('theme_dark', () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [backend, setBackend] = useLocalStorage('qsl_backend', 'https://qsl-api.krnl64.win');
  const [customMarket, setCustomMarket] = useLocalStorage('qsl_market', '');

  // Form Data
  const [formData, setFormData] = useState({
    productInput: '',
    market: 'US',
    locale: 'en-US',
    ring: 'Retail',
    identifierType: 'ProductID',
    includeAppx: true,
    includeNonAppx: true,
  });

  // Fetch Status & Results
  const [status, setStatus] = useState({ loading: false, error: null });
  const [results, setResults] = useState([]);
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
        
        <Navbar 
          isDark={isDark} 
          setIsDark={setIsDark}
          backend={backend}
          setBackend={setBackend}
          customMarket={customMarket}
          setCustomMarket={setCustomMarket}
          locale={formData.locale}
          setLocale={(val) => setFormData(prev => ({ ...prev, locale: val }))}
        />

        <main className={styles.container}>
          <Header />

          <SearchForm 
            formData={formData} 
            setFormData={setFormData} 
            onResolve={handleResolve} 
            loading={status.loading} 
          />

          {status.error && (
            <MessageBar intent="error">
              <MessageBarBody>
                <MessageBarTitle>Resolution Failed</MessageBarTitle>
                {status.error}
              </MessageBarBody>
            </MessageBar>
          )}

          {results.length > 0 && <ResultsTable results={results} />}
        </main>

        <Footer />
      </div>
    </FluentProvider>
  );
}

export default App;
