import React from 'react';
import { Button, makeStyles, shorthands } from '@fluentui/react-components';
import { WeatherMoonRegular, WeatherSunnyRegular } from '@fluentui/react-icons';
import AdvancedSettings from './AdvancedSettings';

const useStyles = makeStyles({
  nav: {
    display: 'flex',
    justifyContent: 'flex-end',
    ...shorthands.padding('16px', '24px'),
    gap: '8px',
    '@media (max-width: 600px)': {
      ...shorthands.padding('12px', '16px'),
    }
  },
});

const Navbar = ({ isDark, setIsDark, backend, setBackend, customMarket, setCustomMarket, locale, setLocale }) => {
  const styles = useStyles();

  return (
    <nav className={styles.nav}>
      <Button
        appearance="subtle"
        icon={isDark ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
        onClick={() => setIsDark(!isDark)}
        aria-label="Toggle Theme"
      />
      <AdvancedSettings
        backend={backend}
        setBackend={setBackend}
        customMarket={customMarket}
        setCustomMarket={setCustomMarket}
        locale={locale}
        setLocale={setLocale}
      />
    </nav>
  );
};

export default Navbar;
