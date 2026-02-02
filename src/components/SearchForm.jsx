import React from 'react';
import {
  Card,
  Label,
  Input,
  Select,
  Checkbox,
  Button,
  Body1,
  ProgressBar,
  makeStyles,
  shorthands,
  tokens
} from '@fluentui/react-components';
import { BoxRegular, SearchRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
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
});

const SearchForm = ({ formData, setFormData, onResolve, loading }) => {
  const styles = useStyles();

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card className={styles.card}>
      <div className={styles.inputSection}>
        <Label htmlFor="url-input" size="large" weight="semibold" required>Product URL or ID</Label>
        <Input
          id="url-input"
          contentBefore={<BoxRegular />}
          size="large"
          placeholder="e.g. 9WZDNCRFJBMP or https://apps.microsoft.com/..."
          value={formData.productInput}
          onChange={(e, d) => handleChange('productInput', d.value)}
          onKeyDown={(e) => e.key === "Enter" && onResolve()}
        />
      </div>

      <div>
        <Label weight="semibold">ID Type</Label>
        <Select
          style={{ width: '100%' }}
          value={formData.identifierType}
          onChange={(e, d) => handleChange('identifierType', d.value)}
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
          <Select style={{ width: '100%' }} value={formData.market} onChange={(e, d) => handleChange('market', d.value)}>
            <option value="US">United States (US)</option>
            <option value="CN">China (CN)</option>
            <option value="GB">United Kingdom (GB)</option>
            <option value="JP">Japan (JP)</option>
            <option value="DE">Germany (DE)</option>
          </Select>
        </div>

        <div>
          <Label weight="semibold">Ring</Label>
          <Select style={{ width: '100%' }} value={formData.ring} onChange={(e, d) => handleChange('ring', d.value)}>
            <option value="Retail">Retail (Stable)</option>
            <option value="RP">Release Preview</option>
            <option value="Fast">Insider Fast (Dev)</option>
            <option value="Slow">Insider Slow (Beta)</option>
          </Select>
        </div>

        <div>
          <Label weight="semibold">Filter</Label>
          <div className={styles.checkboxGroup}>
            <Checkbox label="APPX" checked={formData.includeAppx} onChange={(e, d) => handleChange('includeAppx', !!d.checked)} />
            <Checkbox label="Non-APPX" checked={formData.includeNonAppx} onChange={(e, d) => handleChange('includeNonAppx', !!d.checked)} />
          </div>
        </div>
      </div>

      {loading && <ProgressBar style={{ marginTop: '24px' }} />}

      <div className={styles.actionRow}>
        <Body1 size={200} style={{ color: tokens.colorNeutralForeground3 }}>
          Ready to fetch links from {formData.ring} ring.
        </Body1>
        <Button
          appearance="primary"
          icon={<SearchRegular />}
          size="large"
          disabled={loading || !formData.productInput}
          onClick={onResolve}
        >
          Resolve Links
        </Button>
      </div>
    </Card>
  );
};

export default SearchForm;
