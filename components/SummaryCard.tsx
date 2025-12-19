import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { formatMoney } from "@/utils/formatMoney";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}

export function SummaryCard({ title, amount, icon, color }: SummaryCardProps) {
  const currency = useCurrencyStore((state) => state.currency);
  const symbol = currency === "USD" ? "$" : "₱";
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.amount, { color }]}>
        {symbol}
        {formatMoney(amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
  },
});
