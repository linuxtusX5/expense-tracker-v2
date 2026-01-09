import { ExpenseCard } from "@/components/ExpenseCard";
import { SummaryCard } from "@/components/SummaryCard";
import { useExpenseContext } from "@/contexts/ExpenseContext";
import { useIncome } from "@/contexts/IncomeContext";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { formatMoney } from "@/utils/formatMoney";
import {
  Calendar,
  Search,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const {
    expenses,
    // balance,
    loading,
    getMonthlyTotal,
    // getMonthlyIncome,
    getTodayTotal,
    getWeeklyTotal,
  } = useExpenseContext();
  const { totalIncome } = useIncome();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const currency = useCurrencyStore((state) => state.currency);
  const symbol = currency === "USD" ? "$" : "₱";

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "all") return matchesSearch;
    return matchesSearch && expense.category === selectedFilter;
  });

  const categories = Array.from(new Set(expenses.map((e) => e.category)));
  // ✅ Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // ✅ Final balance
  const balance = totalIncome - totalExpenses;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Expense Tracker</Text>
          <Text style={styles.subtitle}>Track your spending</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.subtitle}>Track your spending</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Wallet size={24} color="#fff" />
          <Text style={styles.balanceTitle}>Current Balance</Text>
        </View>
        <Text style={styles.balanceAmount}>
          {symbol}
          {formatMoney(balance)}
        </Text>
        <View style={styles.balanceDetails}>
          <View style={styles.balanceDetail}>
            <Text style={styles.balanceDetailLabel}>Monthly Income</Text>
            <Text style={styles.balanceDetailValue}>
              +{symbol}
              {formatMoney(totalIncome)}
            </Text>
          </View>
          <View style={styles.balanceDetail}>
            <Text style={styles.balanceDetailLabel}>Monthly Expenses</Text>
            <Text style={styles.balanceDetailValue}>
              -{symbol}
              {formatMoney(getMonthlyTotal())}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <SummaryCard
            title="Today"
            amount={getTodayTotal()}
            icon={<Calendar size={20} color="#3B82F6" />}
            color="#3B82F6"
          />
          <SummaryCard
            title="This Week"
            amount={getWeeklyTotal()}
            icon={<TrendingUp size={20} color="#10B981" />}
            color="#10B981"
          />
          <SummaryCard
            title="This Month"
            amount={getMonthlyTotal()}
            icon={<TrendingDown size={20} color="#F59E0B" />}
            color="#F59E0B"
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search expenses..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === "all" && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === "all" && styles.filterButtonTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedFilter === category && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(category)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  selectedFilter === category && styles.filterButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Expenses */}
        <View style={styles.expensesSection}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {filteredExpenses.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No expenses found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery
                  ? "Try adjusting your search"
                  : "Start by adding your first expense"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredExpenses.slice(0, 10)}
              renderItem={({ item }) => <ExpenseCard expense={item} />}
              keyExtractor={(item) => item._id.toString()}
              scrollEnabled={false}
            />
          )}
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
  balanceCard: {
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginBottom: 0,
  },
  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 16,
  },
  balanceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceDetail: {
    flex: 1,
  },
  balanceDetailLabel: {
    fontSize: 12,
    color: "#BFDBFE",
    marginBottom: 4,
  },
  balanceDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  expensesSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
