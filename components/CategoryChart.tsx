import { useCurrencyStore } from "@/stores/useCurrencyStore";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CategoryChartProps {
  data: Record<string, number>;
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "#EF4444",
  transport: "#3B82F6",
  shopping: "#10B981",
  entertainment: "#8B5CF6",
  health: "#F59E0B",
  bills: "#06B6D4",
  other: "#6B7280",
};

export function CategoryChart({ data }: CategoryChartProps) {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0);
  const currency = useCurrencyStore((state) => state.currency);
  const symbol = currency === "USD" ? "$" : "₱";

  if (total === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No spending data available</Text>
      </View>
    );
  }

  const sortedData = Object.entries(data)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Show top 5 categories

  return (
    <View style={styles.container}>
      <View style={styles.legendContainer}>
        {sortedData.map(([category, amount]) => {
          const percentage = (amount / total) * 100;
          const color = CATEGORY_COLORS[category] || CATEGORY_COLORS.other;

          return (
            <View key={category} style={styles.legendItem}>
              <View style={styles.legendRow}>
                <View
                  style={[styles.colorIndicator, { backgroundColor: color }]}
                />
                <Text style={styles.categoryName}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
                <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percentage}%`, backgroundColor: color },
                  ]}
                />
              </View>
              <Text style={styles.amount}>
                {symbol}
                {amount.toFixed(2)}
              </Text>
            </View>
          );
        })}
      </View>
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
  legendContainer: {
    gap: 16,
  },
  legendItem: {
    gap: 8,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginLeft: 8,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  amount: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
  },
});
