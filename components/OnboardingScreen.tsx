import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const COLORS = {
  primary: "#282534",
  white: "#fff",
};

const { width, height } = Dimensions.get("window");

type SlideItem = {
  key: number;
  title: string;
  text: string;
  image: any;
  backgroundColor: string;
};

const slides: SlideItem[] = [
  {
    key: 1,
    title: "Minimal & Clear",
    text: "Know where your money goes.\nevery peso,dollar, every day",
    image: require("../assets/images/undraw_add-to-cart_c8f2.png"),
    backgroundColor: "#59b2ab",
  },
  {
    key: 2,
    title: "Achieve Your Goals",
    text: "Set and track your financial goals.",
    image: require("../assets/images/undraw_online-banking_l9sn.png"),
    backgroundColor: "#59b2ab",
  },
  {
    key: 3,
    title: "Empowering",
    text: "Take charge of your spending \nBuild habits that build your future.",
    image: require("../assets/images/undraw_pay-with-credit-card_77g6.png"),
    backgroundColor: "#59b2ab",
  },
];

type OnboardingScreenProps = {
  onDone: () => void;
};
const Slide: React.FC<{ item: SlideItem }> = ({ item }) => {
  return (
    <View style={{ alignItems: "center", width }}>
      <Image
        source={item.image}
        style={{ height: "65%", width: "100%", resizeMode: "contain" }}
      />
      <View style={{ paddingHorizontal: 20 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.text}</Text>
      </View>
    </View>
  );
};

function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const ref = useRef<FlatList<SlideItem>>(null);

  const handleStart = async () => {
    try {
      await onDone(); // this will flip showOnboarding to false
    } catch (e) {
      console.error("Onboarding start failed:", e);
    }
  };

  const updateCurrentSlideIndex = (
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex < slides.length) {
      const offset = nextSlideIndex * width;
      ref.current?.scrollToOffset({ offset });
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * width;
    ref.current?.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Footer = () => {
    return (
      <View style={styles.footer}>
        {/* Indicator */}
        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          {currentSlideIndex === slides.length - 1 ? (
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                padding: 20,
                borderRadius: 10,
                zIndex: 999,
                alignItems: "center",
              }}
              onPress={handleStart}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                  color: COLORS.white,
                }}
              >
                GET STARTED
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={[styles.btn, styles.transparentBtn]}
                onPress={skip}
              >
                <Text style={styles.btnTextLight}>SKIP</Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              <TouchableOpacity style={styles.btn} onPress={goToNextSlide}>
                <Text style={styles.btnTextDark}>NEXT</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.primary} />
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        pagingEnabled
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ height: height * 0.75 }}
        renderItem={({ item }) => <Slide item={item} />}
      />
      <Footer />
    </SafeAreaView>
  );
}

export default OnboardingScreen;

const styles = StyleSheet.create({
  title: {
    color: "#3B82F6",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  subtitle: {
    color: COLORS.primary,
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  indicator: {
    height: 3,
    width: 10,
    backgroundColor: "grey",
    marginHorizontal: 3,
    borderRadius: 2,
  },
  activeIndicator: {
    backgroundColor: COLORS.primary,
    width: 25,
  },
  footer: {
    height: height * 0.25,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 35,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  transparentBtn: {
    backgroundColor: "transparent",
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  btnTextDark: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.white,
  },
  btnTextLight: {
    fontWeight: "bold",
    fontSize: 18,
    color: COLORS.primary,
  },
});
