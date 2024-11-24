import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
    padding: 30,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
});

interface BudgetPDFDocumentProps {
  data: {
    transactions: any[];
    categories: any[];
    totalIncome: number;
    totalExpenses: number;
  };
}

export const BudgetPDFDocument: React.FC<BudgetPDFDocumentProps> = React.memo(
  ({ data }) => {
    const {
      transactions = [],
      categories = [],
      totalIncome = 0,
      totalExpenses = 0,
    } = data || {};

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.title}>Bütçe Raporu</Text>

            <Text style={styles.subtitle}>Özet</Text>
            <Text style={styles.text}>
              Toplam Gelir: ₺{Number(totalIncome).toFixed(2)}
            </Text>
            <Text style={styles.text}>
              Toplam Gider: ₺{Number(totalExpenses).toFixed(2)}
            </Text>
            <Text style={styles.text}>
              Bakiye: ₺{Number(totalIncome - totalExpenses).toFixed(2)}
            </Text>

            <Text style={styles.subtitle}>Son İşlemler</Text>
            {transactions.slice(-5).map((transaction, index) => (
              <Text key={index} style={styles.text}>
                {transaction?.date || "Tarih Yok"} -{" "}
                {transaction?.description || "Açıklama Yok"}: ₺
                {Number(transaction?.amount || 0).toFixed(2)} (
                {transaction?.type || "Tür Yok"})
              </Text>
            ))}

            <Text style={styles.subtitle}>Kategoriler</Text>
            {categories.map((category, index) => (
              <Text key={index} style={styles.text}>
                {category?.name || "İsimsiz Kategori"}: ₺
                {Number(category?.budgetLimit || 0).toFixed(2)} (
                {category?.type || "Tür Yok"})
              </Text>
            ))}
          </View>
        </Page>
      </Document>
    );
  }
);

BudgetPDFDocument.displayName = "BudgetPDFDocument";
