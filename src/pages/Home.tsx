import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  makeStyles,
  shorthands,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
} from "@fluentui/react-components";

import { resolveLinks } from "../api";
import type { NormalizedItem } from "../types";
import Header from "../components/Header";
import SearchForm, { type SearchFormData } from "../components/SearchForm";
import ResultsTable from "../components/ResultsTable";

interface HomeProps {
  backend: string;
  customMarket: string;
}

interface Status {
  loading: boolean;
  error: string | null;
}

const useStyles = makeStyles({
  container: {
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    ...shorthands.padding("0", "24px", "48px"),
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    flexGrow: 1,
    boxSizing: "border-box",
    "@media (max-width: 600px)": {
      ...shorthands.padding("0", "16px", "24px"),
      gap: "16px",
    },
  },
});

const Home: React.FC<HomeProps> = ({ backend, customMarket }) => {
  const styles = useStyles();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState<SearchFormData>({
    productInput: "",
    market: "US",
    locale: "en-US",
    ring: "Retail",
    identifierType: "ProductID",
    includeAppx: true,
    includeNonAppx: true,
  });

  const [status, setStatus] = useState<Status>({ loading: false, error: null });
  const [results, setResults] = useState<NormalizedItem[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstRun = useRef(true);

  const handleResolve = async (overrideData?: SearchFormData) => {
    const currentData = overrideData ?? formData;

    if (!currentData.productInput) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setStatus({ loading: true, error: null });
    setResults([]);

    try {
      const results = await resolveLinks(
        backend,
        customMarket,
        currentData,
        abortControllerRef.current.signal,
      );
      setResults(results);
      setStatus({ loading: false, error: null });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setStatus({
        loading: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  };

  useEffect(() => {
    if (!isFirstRun.current) return;
    isFirstRun.current = false;

    const id = searchParams.get("id");
    const type = searchParams.get("idType");
    const market = searchParams.get("market");
    const ring = searchParams.get("ring");
    const locale = searchParams.get("locale");

    if (id) {
      const newData: SearchFormData = {
        ...formData,
        productInput: id,
        identifierType: type ?? formData.identifierType,
        market: market ?? formData.market,
        ring: ring ?? formData.ring,
        locale: locale ?? formData.locale,
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
