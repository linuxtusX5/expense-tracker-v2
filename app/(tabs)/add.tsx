import { useExpenseContext } from "@/contexts/ExpenseContext";
import { CATEGORIES } from "@/data/Categories";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { DollarSign, FileText, PhilippinePeso, Tag } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function AddExpenseScreen() {
  const { addExpense } = useExpenseContext();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const currency = useCurrencyStore((state) => state.currency);

  const handleAddExpense = async () => {
    if (!amount || !description || !selectedCategory) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
        position: "top",
      });
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
      await addExpense({
        amount: numericAmount,
        description: description.trim(),
        category: selectedCategory,
        date: new Date(),
      });

      // Reset form
      setAmount("");
      setDescription("");
      setSelectedCategory("");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Expense added successfully!",
        position: "top",
      });
    } catch {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add expense",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Expense</Text>
        <Text style={styles.subtitle}>Record your spending</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
              placeholder="What did you spend on?"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  selectedCategory === category.id && {
                    backgroundColor: category.color,
                    borderColor: category.color,
                  },
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Tag
                  size={16}
                  color={
                    selectedCategory === category.id
                      ? "#FFFFFF"
                      : category.color
                  }
                />
                <Text
                  style={[
                    styles.categoryButtonText,
                    selectedCategory === category.id && { color: "#FFFFFF" },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={[styles.addButton, loading && styles.addButtonDisabled]}
          onPress={handleAddExpense}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? "Adding..." : "Add Expense"}
          </Text>
        </TouchableOpacity>
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
  inputSection: {
    marginBottom: 24,
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
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryButton: {
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
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  addButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
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
});
