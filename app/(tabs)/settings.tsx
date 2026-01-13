import { useAuth } from "@/contexts/AuthContext";
import { useExpenseContext } from "@/contexts/ExpenseContext";
import { useIncome } from "@/contexts/IncomeContext";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

import { formatMoney } from "@/utils/formatMoney";
import {
  ChevronRight,
  DollarSign,
  Download,
  FileText,
  CircleHelp as HelpCircle,
  LogOut,
  PhilippinePeso,
  Trash2,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { expenses, clearAllExpenses } = useExpenseContext();
  const { income, totalIncome } = useIncome();
  const { logout } = useAuth();
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const symbol = currency === "USD" ? "$" : "₱";
  const [name, setName] = useState("");

  const handleCurrencyChange = (selectedCurrency: "USD" | "PHP") => {
    setCurrency(selectedCurrency);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all expenses? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: () => {
            clearAllExpenses();
            Alert.alert("Success", "All expenses have been cleared.");
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert("Export Data", "Export feature coming soon!");
  };

  // Total expense entries
  const totalExpenses = expenses.length;

  // Total expense amount
  const totalAmount = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Total income entries
  const totalIncomeEntries = income.length;

  // Total income amount (already computed in context, but safe)
  const totalIncomeAmount = totalIncome;

  // Balance
  const balance = totalIncomeAmount - totalAmount;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setName(parsedUser.name || "");
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };
    loadUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your app preferences</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.Profile}>
            <Image
              source={require("@/assets/icon/user.png")}
              style={styles.icon}
            />
            <Text style={styles.name}>{name}</Text>
          </View>
        </View>

        {/* Currency Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currency</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={currency}
              onValueChange={handleCurrencyChange}
              style={{ margin: 10, color: "#000" }}
            >
              <Picker.Item label="US Dollar ($)" value="USD" />
              <Picker.Item label="Philippine Peso (₱)" value="PHP" />
            </Picker>
          </View>
        </View>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>

          <View style={styles.statRow}>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Current Balance</Text>
              <Text
                style={[
                  styles.statValue,
                  { color: balance >= 0 ? "#10B981" : "#EF4444" },
                ]}
              >
                {symbol}
                {/* {balance.toFixed(2)} */}
                {formatMoney(balance)}
              </Text>
            </View>
            {currency === "USD" ? (
              <DollarSign size={20} color="#6B7280" />
            ) : (
              <Text style={{ fontSize: 20, color: "#6B7280" }}>
                <PhilippinePeso size={20} color="#6B7280" />
              </Text>
            )}
          </View>
          <View style={styles.statRow}>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Total Expenses</Text>
              <Text style={styles.statValue}>{totalExpenses}</Text>
            </View>
            <FileText size={20} color="#6B7280" />
          </View>

          <View style={styles.statRow}>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Total Income Entries</Text>
              <Text style={styles.statValue}>{totalIncomeEntries}</Text>
            </View>
            <FileText size={20} color="#6B7280" />
          </View>

          <View style={styles.statRow}>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Total Expenses Amount</Text>
              <Text style={styles.statValue}>
                {symbol}
                {/* {totalAmount.toFixed(2)} */}
                {formatMoney(totalAmount)}
              </Text>
            </View>
            {currency === "USD" ? (
              <DollarSign size={20} color="#6B7280" />
            ) : (
              <Text style={{ fontSize: 20, color: "#6B7280" }}>
                <PhilippinePeso size={20} color="#6B7280" />
              </Text>
            )}
          </View>

          <View style={styles.statRow}>
            <View style={styles.statInfo}>
              <Text style={styles.statLabel}>Total Income Amount</Text>
              <Text style={styles.statValue}>
                {symbol}
                {/* {totalIncomeAmount.toFixed(2)} */}
                {formatMoney(totalIncomeAmount)}
              </Text>
            </View>

            {currency === "USD" ? (
              <DollarSign size={20} color="#6B7280" />
            ) : (
              <Text style={{ fontSize: 20, color: "#6B7280" }}>
                <PhilippinePeso size={20} color="#6B7280" />
              </Text>
            )}
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleExportData}
          >
            <View style={styles.settingContent}>
              <Download size={20} color="#10B981" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Export Data</Text>
                <Text style={styles.settingDescription}>
                  Download your expenses as CSV
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingRow, styles.dangerRow]}
            onPress={handleClearData}
          >
            <View style={styles.settingContent}>
              <Trash2 size={20} color="#EF4444" />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, styles.dangerText]}>
                  Clear All Data
                </Text>
                <Text style={styles.settingDescription}>
                  Delete all expenses permanently
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* App Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingContent}>
              <HelpCircle size={20} color="#3B82F6" />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Help & Support</Text>
                <Text style={styles.settingDescription}>
                  Get help using the app
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <View style={styles.settingContent}>
              <View style={styles.appIcon}>
                <Text style={styles.appIconText}>ET</Text>
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Expense Tracker</Text>
                <Text style={styles.settingDescription}>Version 2.0.0</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for better expense tracking
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: "cover",
  },
  Profile: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  pickerWrapper: {
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    color: "#000",
  },
  picker: {
    height: 50,
    width: "100%",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#EF4444",
  },
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dangerRow: {
    borderColor: "#FEE2E2",
    backgroundColor: "#FFFBFB",
  },
  settingContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  dangerText: {
    color: "#EF4444",
  },
  settingDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  appIcon: {
    width: 20,
    height: 20,
    backgroundColor: "#3B82F6",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  appIconText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
