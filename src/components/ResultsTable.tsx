import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Text,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
  Badge,
  Tooltip,
  makeStyles,
  shorthands,
  tokens,
} from "@fluentui/react-components";
import {
  ArrowDownloadRegular,
  DocumentRegular,
  CopyRegular,
  CheckmarkRegular,
} from "@fluentui/react-icons";
import type { NormalizedItem } from "../utils/helpers";

interface ResultsTableProps {
  results: NormalizedItem[];
}

const useStyles = makeStyles({
  card: {
    ...shorthands.padding("32px"),
    boxShadow: tokens.shadow8,
    backgroundColor: tokens.colorNeutralBackground1,
    "@media (max-width: 600px)": {
      ...shorthands.padding("16px"),
    },
  },
  tableContainer: {
    overflowX: "auto",
    maxHeight: "600px",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
  },
});

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const styles = useStyles();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getTypeColor = (type: string): "brand" | "important" | undefined => {
    if (type === "APPX") return "brand";
    if (type === "BlockMap") return "important";
    return undefined;
  };

  return (
    <Card className={styles.card} style={{ padding: 0, overflow: "hidden" }}>
      <CardHeader
        header={
          <Text weight="bold" size={500}>
            Result Files ({results.length})
          </Text>
        }
        style={{
          padding: "16px 24px",
          borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        }}
      />
      <div className={styles.tableContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ minWidth: "220px", width: "45%" }}>
                File Name
              </TableHeaderCell>
              <TableHeaderCell style={{ minWidth: "80px", width: "15%" }}>
                Size
              </TableHeaderCell>
              <TableHeaderCell style={{ minWidth: "80px", width: "15%" }}>
                Type
              </TableHeaderCell>
              <TableHeaderCell style={{ minWidth: "100px", width: "25%" }}>
                Actions
              </TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <DocumentRegular
                      style={{
                        flexShrink: 0,
                        color: tokens.colorNeutralForeground3,
                      }}
                    />
                    <Tooltip content={item.name} relationship="label">
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                          display: "block",
                          cursor: "default",
                        }}
                      >
                        {item.name}
                      </span>
                    </Tooltip>
                  </div>
                </TableCell>
                <TableCell style={{ whiteSpace: "nowrap" }}>
                  {item.size}
                </TableCell>
                <TableCell>
                  <Badge appearance="tint" color={getTypeColor(item.type)}>
                    {item.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: 8 }}>
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
                        icon={
                          copiedIndex === idx ? (
                            <CheckmarkRegular
                              color={tokens.colorPaletteGreenForeground1}
                            />
                          ) : (
                            <CopyRegular />
                          )
                        }
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

export default ResultsTable;
