import { useIncome } from "@/contexts/IncomeContext";
import { INCOME_SOURCES } from "@/data/Source";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { formatMoney } from "@/utils/formatMoney";
import {
  Briefcase,
  DollarSign,
  FileText,
  PhilippinePeso,
  Plus,
  Trash2,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function IncomeScreen() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBalanceSetup, setShowBalanceSetup] = useState(false);
  const [initialBalanceAmount, setInitialBalanceAmount] = useState("");
  const currency = useCurrencyStore((state) => state.currency);
  const symbol = currency === "USD" ? "$" : "₱";
  const { income, addIncome, totalIncome, deleteIncome } = useIncome();

  const handleAddIncome = async () => {
    if (!amount || !description || !selectedSource) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid amount",
        position: "top",
      });
      return;
    }

    setLoading(true);
    try {
      await addIncome({
        amount: numericAmount,
        // description: description.trim(),
        source: selectedSource,
        // date: new Date(),
      });

      // Reset form
      setAmount("");
      setDescription("");
      setSelectedSource("");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Income added successfully!",
        position: "top",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add income",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncome = (id: string) => {
    Alert.alert(
      "Delete Income",
      "Are you sure you want to delete this income entry?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteIncome(id);
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "deleted income successfully!",
              position: "top",
            });
          },
        },
      ],
    );
  };

  const handleSetInitialBalance = async () => {
    const numericAmount = parseFloat(initialBalanceAmount);
    if (isNaN(numericAmount)) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter a valid amount",
        position: "top",
      });
      return;
    }

    try {
      // await setInitialBalance(numericAmount);
      setInitialBalanceAmount("");
      setShowBalanceSetup(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Initial balance set successfully!",
        position: "top",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to set initial balance",
        position: "top",
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  const renderIncomeItem = ({ item }: { item: any }) => {
    const sourceColor =
      INCOME_SOURCES.find((s) => s.id === item.source)?.color || "#6B7280";

    return (
      <View style={styles.incomeCard}>
        <View style={styles.incomeContent}>
          <View style={styles.incomeLeft}>
            <View
              style={[styles.sourceIndicator, { backgroundColor: sourceColor }]}
            />
            <View style={styles.incomeInfo}>
              <Text style={styles.incomeDescription}>{item.description}</Text>
              <View style={styles.incomeMetadata}>
                <Text style={styles.incomeSource}>
                  {INCOME_SOURCES.find((s) => s.id === item.source)?.name ||
                    item.source}
                </Text>
                <Text style={styles.incomeDate}>
                  {formatDate(new Date(item.createdAt))}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.incomeRight}>
            <Text style={styles.incomeAmount}>
              +{symbol}
              {formatMoney(item.amount)}
            </Text>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteIncome(item._id)}
            >
              <Trash2 size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Income & Balance</Text>
        <Text style={styles.subtitle}>Manage your income and balance</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.sectionTitle}>Current Balance</Text>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceAmount}>
              {symbol}
              {formatMoney(totalIncome)}
            </Text>
            <TouchableOpacity
              style={styles.setBalanceButton}
              onPress={() => setShowBalanceSetup(!showBalanceSetup)}
            >
              <Text style={styles.setBalanceButtonText}>
                {showBalanceSetup ? "Cancel" : "Set Initial Balance"}
              </Text>
            </TouchableOpacity>
          </View>

          {showBalanceSetup && (
            <View style={styles.balanceSetup}>
              <Text style={styles.balanceSetupTitle}>Set Initial Balance</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  style={styles.textInput}
                  placeholder="0.00"
                  value={initialBalanceAmount}
                  onChangeText={setInitialBalanceAmount}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <TouchableOpacity
                style={styles.setBalanceConfirmButton}
                onPress={handleSetInitialBalance}
              >
                <Text style={styles.setBalanceConfirmButtonText}>
                  Set Balance
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Add Income Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Income</Text>

          {/* Amount Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputContainer}>
              {currency === "USD" ? (
                <DollarSign size={20} color="#6B7280" />
              ) : (
                <Text style={{ fontSize: 20, color: "#6B7280" }}>
                  <PhilippinePeso size={20} color="#6B7280" />
                </Text>
              )}
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Description Input */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputContainer}>
              <FileText size={20} color="#6B7280" />
              <TextInput
                style={styles.textInput}
                placeholder="Source of income"
                value={description}
                onChangeText={setDescription}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {/* Source Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>Source</Text>
            <View style={styles.sourceGrid}>
              {INCOME_SOURCES.map((source) => (
                <TouchableOpacity
                  key={source.id}
                  style={[
                    styles.sourceButton,
                    selectedSource === source.id && {
                      backgroundColor: source.color,
                      borderColor: source.color,
                    },
                  ]}
                  onPress={() => setSelectedSource(source.id)}
                >
                  <Briefcase
                    size={16}
                    color={
                      selectedSource === source.id ? "#FFFFFF" : source.color
                    }
                  />
                  <Text
                    style={[
                      styles.sourceButtonText,
                      selectedSource === source.id && { color: "#FFFFFF" },
                    ]}
                  >
                    {source.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            style={[styles.addButton, loading && styles.addButtonDisabled]}
            onPress={handleAddIncome}
            disabled={loading}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>
              {loading ? "Adding..." : "Add Income"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Income History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Income</Text>
          {income.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No income entries yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start by adding your first income entry
              </Text>
            </View>
          ) : (
            <FlatList
              data={income.slice(0, 10)}
              renderItem={renderIncomeItem}
              keyExtractor={(item) => item._id}
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  balanceSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  setBalanceButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  setBalanceButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  balanceSetup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  balanceSetupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  setBalanceConfirmButton: {
    backgroundColor: "#10B981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 12,
  },
  setBalanceConfirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  inputSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  sourceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sourceButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
    minWidth: 100,
  },
  sourceButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  addButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  addButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  incomeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  incomeContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  incomeLeft: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  sourceIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  incomeInfo: {
    flex: 1,
  },
  incomeDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  incomeMetadata: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  incomeSource: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  incomeDate: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  incomeRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: "#10B981",
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
});
