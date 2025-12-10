import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type CurrencyState = {
  currency: "USD" | "PHP";
  symbol: string;
  setCurrency: (currency: "USD" | "PHP") => void;
  loadCurrency: () => void;
};

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: "USD",
  symbol: "$",

  setCurrency: (currency) => {
    const symbol = currency === "USD" ? "$" : "₱";
    AsyncStorage.setItem("selectedCurrency", currency);
    set({ currency, symbol });
  },

  loadCurrency: async () => {
    const stored = await AsyncStorage.getItem("selectedCurrency");
    if (stored) {
      const symbol = stored === "USD" ? "$" : "₱";
      set({ currency: stored as "USD" | "PHP", symbol });
    }
  },
}));
