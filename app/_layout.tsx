// app/_layout.tsx
import AuthScreen from "@/components/AuthScreen";
import OnboardingScreen from "@/components/OnboardingScreen";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ExpenseProvider } from "@/contexts/ExpenseContext";
import { IncomeProvider } from "@/contexts/IncomeContext";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { useCurrencyStore } from "@/stores/useCurrencyStore";
import { toastConfig } from "@/toastConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";

function AppContent() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);
  const loadCurrency = useCurrencyStore((state) => state.loadCurrency);

  useEffect(() => {
    loadCurrency();
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        setShowOnboarding(hasLaunched === null);
      } catch (err) {
        console.error("Failed to check onboarding:", err);
        setShowOnboarding(false);
      }
    };

    checkOnboarding();
  }, []);

  if (authLoading || showOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingScreen
        onDone={async () => {
          await AsyncStorage.setItem("hasLaunched", "true");
          setShowOnboarding(false);
        }}
      />
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <IncomeProvider>
      <ExpenseProvider>
        <Slot />
        <Toast config={toastConfig} />
      </ExpenseProvider>
    </IncomeProvider>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <AppContent />
    </AuthProvider>
  );
}
