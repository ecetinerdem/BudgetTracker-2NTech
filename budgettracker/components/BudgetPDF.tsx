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

export const BudgetPDFDocument = ({ data }) => {
  const { transactions, categories, totalIncome, totalExpenses } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Bütçe Raporu</Text>

          <Text style={styles.subtitle}>Özet</Text>
          <Text style={styles.text}>
            Toplam Gelir: ₺{totalIncome.toFixed(2)}
          </Text>
          <Text style={styles.text}>
            Toplam Gider: ₺{totalExpenses.toFixed(2)}
          </Text>
          <Text style={styles.text}>
            Bakiye: ₺{(totalIncome - totalExpenses).toFixed(2)}
          </Text>

          <Text style={styles.subtitle}>Son İşlemler</Text>
          {transactions.slice(-5).map((transaction, index) => (
            <Text key={index} style={styles.text}>
              {transaction.date} - {transaction.description}: ₺
              {transaction.amount.toFixed(2)} ({transaction.type})
            </Text>
          ))}

          <Text style={styles.subtitle}>Kategoriler</Text>
          {categories.map((category, index) => (
            <Text key={index} style={styles.text}>
              {category.name}: ₺{category.budgetLimit.toFixed(2)} (
              {category.type})
            </Text>
          ))}
        </View>
      </Page>
    </Document>
  );
};
