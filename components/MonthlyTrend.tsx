import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { formatMoney } from "@/utils/formatMoney";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

interface MonthlyTrendProps {
  data: Record<string, number>;
}

export function MonthlyTrend({ data }: MonthlyTrendProps) {
  const currency = useCurrencyStore((state) => state.currency);
  const symbol = currency === "USD" ? "$" : "₱";

  if (Object.keys(data).length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No monthly data available</Text>
      </View>
    );
  }

  const sortedEntries = Object.entries(data)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6); // Show last 6 months

  const maxValue = Math.max(...sortedEntries.map(([, value]) => value));

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartContainer}>
          {sortedEntries.map(([month, amount]) => {
            const height = maxValue > 0 ? (amount / maxValue) * 120 : 0;

            return (
              <View key={month} style={styles.barContainer}>
                <Text style={styles.amount}>
                  {symbol}
                  {/* {amount.toFixed(0)} */}
                  {formatMoney(amount)}
                </Text>
                <View style={styles.barWrapper}>
                  <View style={[styles.bar, { height }]} />
                </View>
                <Text style={styles.monthLabel}>{formatMonth(month)}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 16,
    paddingVertical: 20,
  },
  barContainer: {
    alignItems: "center",
    gap: 8,
    minWidth: 60,
  },
  amount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  barWrapper: {
    height: 120,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: 24,
    backgroundColor: "#3B82F6",
    borderRadius: 4,
    minHeight: 4,
  },
  monthLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});
