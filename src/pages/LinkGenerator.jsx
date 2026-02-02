import React, { useState, useEffect } from 'react';
import {
  Card,
  Title2,
  Label,
  Input,
  Select,
  Button,
  makeStyles,
  shorthands,
  tokens,
  Textarea
} from '@fluentui/react-components';
import {
  CopyRegular,
  CheckmarkRegular,
  OpenRegular
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    ...shorthands.padding('24px'),
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    flexGrow: 1,
  },
  card: {
    ...shorthands.padding('32px'),
    boxShadow: tokens.shadow8,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '16px',
    '@media (max-width: 600px)': {
      gridTemplateColumns: '1fr',
    }
  },
  resultArea: {
    marginTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  }
});

const LinkGenerator = () => {
  const styles = useStyles();

  const [params, setParams] = useState({
    id: '',
    idType: 'ProductID',
    market: 'US',
    ring: 'Retail',
    locale: 'en-US'
  });

  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate the link based on params
    const baseUrl = window.location.origin;
    const search = new URLSearchParams();

    if (params.id) search.set('id', params.id);
    if (params.idType && params.idType !== 'ProductID') search.set('idType', params.idType);
    if (params.market && params.market !== 'US') search.set('market', params.market);
    if (params.ring && params.ring !== 'Retail') search.set('ring', params.ring);
    if (params.locale && params.locale !== 'en-US') search.set('locale', params.locale);

    setGeneratedUrl(`${baseUrl}/?${search.toString()}`);
  }, [params]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.container}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <Title2>Link Generator</Title2>
      </div>

      <Card className={styles.card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div>
            <Label required weight="semibold">Product ID / URL</Label>
            <Input
              style={{ width: '100%' }}
              value={params.id}
              onChange={(e, d) => setParams(p => ({ ...p, id: d.value }))}
              placeholder="e.g. 9WZDNCRFJBMP"
            />
          </div>

          <div className={styles.gridTwo}>
            <div>
              <Label weight="semibold">ID Type</Label>
              <Select
                style={{ width: '100%' }}
                value={params.idType}
                onChange={(e, d) => setParams(p => ({ ...p, idType: d.value }))}
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
            <div>
              <Label weight="semibold">Ring</Label>
              <Select
                style={{ width: '100%' }}
                value={params.ring}
                onChange={(e, d) => setParams(p => ({ ...p, ring: d.value }))}
              >
                <option value="Retail">Retail</option>
                <option value="RP">Release Preview</option>
                <option value="Fast">Insider Fast</option>
                <option value="Slow">Insider Slow</option>
              </Select>
            </div>
          </div>

          <div className={styles.gridTwo}>
            <div>
              <Label weight="semibold">Market</Label>
              <Select
                style={{ width: '100%' }}
                value={params.market}
                onChange={(e, d) => setParams(p => ({ ...p, market: d.value }))}
              >
                <option value="US">US</option>
                <option value="CN">CN</option>
                <option value="GB">GB</option>
                <option value="DE">DE</option>
              </Select>
            </div>
            <div>
              <Label weight="semibold">Locale</Label>
              <Input
                style={{ width: '100%' }}
                value={params.locale}
                onChange={(e, d) => setParams(p => ({ ...p, locale: d.value }))}
              />
            </div>
          </div>

          <div className={styles.resultArea}>
            <Label weight="semibold" size="large">Generated Link</Label>
            <Textarea
              value={generatedUrl}
              readOnly
              rows={3}
              style={{ fontFamily: 'monospace', fontSize: '12px' }}
            />
            <div className={styles.buttonGroup}>
              <Button
                appearance="primary"
                icon={copied ? <CheckmarkRegular /> : <CopyRegular />}
                onClick={handleCopy}
              >
                {copied ? "Copied" : "Copy Link"}
              </Button>
              <Button
                appearance="subtle"
                icon={<OpenRegular />}
                as="a"
                href={generatedUrl}
                target="_blank"
              >
                Test Link
              </Button>
            </div>
          </div>

        </div>
      </Card>
    </div>
  );
};

export default LinkGenerator;
