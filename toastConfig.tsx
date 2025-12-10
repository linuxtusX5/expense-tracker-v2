import { BaseToast, ErrorToast } from "react-native-toast-message";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#10B981", paddingVertical: 20 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{
        fontSize: 20,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 16,
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#EF4444", paddingVertical: 20 }}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      text1Style={{
        fontSize: 20,
        fontWeight: "bold",
      }}
      text2Style={{
        fontSize: 16,
      }}
    />
  ),
};
