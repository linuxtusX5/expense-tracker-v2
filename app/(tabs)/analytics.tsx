import { CategoryChart } from "@/components/CategoryChart";
import { MonthlyTrend } from "@/components/MonthlyTrend";
import { useExpenseContext } from "@/contexts/ExpenseContext";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { formatMoney } from "@/utils/formatMoney";
import {
  Calendar,
  ChartPie as PieChartIcon,
  TrendingUp,
} from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyticsScreen() {
  const {
    expenses,
    balance,
    getMonthlyTotal,
    getMonthlyIncome,
    getCategoryTotals,
    getMonthlyExpenses,
  } = useExpenseContext();
  const currency = useCurrencyStore((state) => state.currency);
  const symbol = currency === "USD" ? "$" : "₱";

  const categoryTotals = getCategoryTotals();
  const monthlyExpenses = getMonthlyExpenses();
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const monthlyIncome = getMonthlyIncome();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your spending patterns</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.statTitle}>Current Balance</Text>
            </View>
            <Text
              style={[
                styles.statAmount,
                { color: balance >= 0 ? "#10B981" : "#EF4444" },
              ]}
            >
              {symbol}
              {formatMoney(balance)}
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <TrendingUp size={20} color="#3B82F6" />
              <Text style={styles.statTitle}>Total Spent</Text>
            </View>
            <Text style={styles.statAmount}>
              {symbol}
              {formatMoney(totalExpenses)}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.statTitle}>Monthly Income</Text>
            </View>
            <Text style={styles.statAmount}>
              {symbol}
              {/* {monthlyIncome.toFixed(2)} */}
              {formatMoney(monthlyIncome)}
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Calendar size={20} color="#10B981" />
              <Text style={styles.statTitle}>This Month</Text>
            </View>
            <Text style={styles.statAmount}>
              {symbol}
              {/* {getMonthlyTotal().toFixed(2)} */}
              {formatMoney(getMonthlyTotal())}
            </Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <PieChartIcon size={20} color="#6B7280" />
            <Text style={styles.sectionTitle}>Spending by Category</Text>
          </View>
          <CategoryChart data={categoryTotals} />
        </View>

        {/* Monthly Trend */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#6B7280" />
            <Text style={styles.sectionTitle}>Monthly Trend</Text>
          </View>
          <MonthlyTrend data={monthlyExpenses} />
        </View>

        {/* Category Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          {Object.entries(categoryTotals).map(([category, total]) => {
            const percentage =
              totalExpenses > 0 ? (total / totalExpenses) * 100 : 0;
            return (
              <View key={category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                  <Text style={styles.categoryPercentage}>
                    {percentage.toFixed(1)}%
                  </Text>
                </View>
                <Text style={styles.categoryAmount}>
                  {symbol}
                  {/* {total.toFixed(2)} */}
                  {formatMoney(total)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  statAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  categoryPercentage: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});
