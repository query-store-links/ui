import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  makeStyles,
  shorthands,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
} from '@fluentui/react-components';

// Utils
import { normalizeData, extractProductId } from '../utils/helpers';

// Components
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import ResultsTable from '../components/ResultsTable';

const useStyles = makeStyles({
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

const Home = ({ backend, customMarket }) => {
  const styles = useStyles();
  const [searchParams] = useSearchParams();

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

  const [status, setStatus] = useState({ loading: false, error: null });
  const [results, setResults] = useState([]);
  const abortControllerRef = useRef(null);
  const isFirstRun = useRef(true);

  // Handle Resolve APIs
  const handleResolve = async (overrideData = null) => {
    const currentData = overrideData || formData;

    if (!currentData.productInput) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();

    setStatus({ loading: true, error: null });
    setResults([]);

    try {
      const apiUrl = `${backend.replace(/\/$/, '')}/api/links/resolve-all`;

      const finalInput = currentData.identifierType === 'ProductID'
        ? extractProductId(currentData.productInput)
        : currentData.productInput.trim();

      const payload = {
        ...currentData,
        productInput: finalInput,
        market: customMarket || currentData.market
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

  // Check url query parameters on first render
  useEffect(() => {
    if (!isFirstRun.current) return;
    isFirstRun.current = false;

    const id = searchParams.get('id');
    const type = searchParams.get('idType');
    const market = searchParams.get('market');
    const ring = searchParams.get('ring');
    const locale = searchParams.get('locale');

    if (id) {
      const newData = {
        ...formData,
        productInput: id,
        identifierType: type || formData.identifierType,
        market: market || formData.market,
        ring: ring || formData.ring,
        locale: locale || formData.locale,
      };

      setFormData(newData);
      
      handleResolve(newData);
    }
  }, [searchParams]);

  return (
    <main className={styles.container}>
      <Header />

      <SearchForm 
        formData={formData} 
        setFormData={setFormData} 
        onResolve={() => handleResolve()} 
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
  );
};

export default Home;
