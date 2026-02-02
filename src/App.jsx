import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  FluentProvider,
  webDarkTheme,
  webLightTheme,
  makeStyles,
  tokens,
} from '@fluentui/react-components';

// Hooks
import { useLocalStorage } from './hooks/useLocalStorage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import LinkGenerator from './pages/LinkGenerator';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

function App() {
  const styles = useStyles();

  // Global config
  const [isDark, setIsDark] = useLocalStorage('theme_dark', () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });
  const [backend, setBackend] = useLocalStorage('qsl_backend', 'https://qsl-api.krnl64.win');
  const [customMarket, setCustomMarket] = useLocalStorage('qsl_market', '');

  return (
    <FluentProvider theme={isDark ? webDarkTheme : webLightTheme}>
      <div className={styles.root}>
        <BrowserRouter>
          <Navbar 
            isDark={isDark} 
            setIsDark={setIsDark}
            backend={backend}
            setBackend={setBackend}
            customMarket={customMarket}
            setCustomMarket={setCustomMarket}
          />
          
          <Routes>
            <Route path="/" element={<Home backend={backend} customMarket={customMarket} />} />
            <Route path="/generator" element={<LinkGenerator />} />
          </Routes>

          <Footer />
        </BrowserRouter>
      </div>
    </FluentProvider>
  );
}

export default App;
