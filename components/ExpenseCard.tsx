import { Expense, useExpenseContext } from "@/contexts/ExpenseContext";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { formatMoney } from "@/utils/formatMoney";
import { Trash2 } from "lucide-react-native";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

interface ExpenseCardProps {
  expense: Expense;
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

export function ExpenseCard({ expense }: ExpenseCardProps) {
  const { deleteExpense } = useExpenseContext();
  const currency = useCurrencyStore((state) => state.currency);
  const symbol = currency === "USD" ? "$" : "₱";

  const handleDelete = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteExpense(expense._id);
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "deleted expense successfully!",
              position: "top",
            });
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  const categoryColor =
    CATEGORY_COLORS[expense.category] || CATEGORY_COLORS.other;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.categoryIndicator,
              { backgroundColor: categoryColor },
            ]}
          />
          <View style={styles.expenseInfo}>
            <Text style={styles.description} numberOfLines={1}>
              {expense.description}
            </Text>
            <View style={styles.metadata}>
              <Text style={styles.category}>
                {expense.category.charAt(0).toUpperCase() +
                  expense.category.slice(1)}
              </Text>
              <Text style={styles.date}>{formatDate(expense.date)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.amount}>
            -{symbol}
            {formatMoney(expense.amount)}
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDelete}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  content: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  category: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  date: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  rightSection: {
    alignItems: "flex-end",
    gap: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#EF4444",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
});
