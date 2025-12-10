import OnboardingScreen from "@/components/OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Onboarding() {
  const handleDone = async () => {
    await AsyncStorage.setItem("hasLaunched", "true");
  };

  return <OnboardingScreen onDone={handleDone} />;
}
