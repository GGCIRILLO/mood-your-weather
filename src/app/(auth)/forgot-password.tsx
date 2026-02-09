import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { CloudIcon, ArrowLeft } from "phosphor-react-native";
import { resetPassword } from "@/services/auth.service";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Errore", "Inserisci la tua email");
      return;
    }

    setLoading(true);
    const response = await resetPassword(email);
    setLoading(false);

    if (response.success) {
      Alert.alert(
        "Email Inviata",
        "Controlla la tua casella di posta per le istruzioni su come reimpostare la password.",
        [{ text: "OK", onPress: () => router.back() }],
      );
    } else {
      Alert.alert(
        "Errore",
        response.error || "Impossibile inviare l'email di reset",
      );
    }
  };

  return (
    <View className="flex-1 bg-[#1a2533]">
      {/* Atmospheric Background */}
      <LinearGradient
        colors={["#1a2533", "#243342", "#135bec4D"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Decorative Cloud Elements */}
      <View style={[styles.cloudDecor, { top: -80, left: -80 }]} />
      <View
        style={[
          styles.cloudDecor,
          { top: "33%", right: -80, width: 384, height: 384, opacity: 0.3 },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/10"
            >
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View className="px-8 justify-center flex-1 pb-12">
            {/* Branding Header */}
            <View className="items-center mb-10">
              <View className="rounded-full border-2 border-white/30 p-4 items-center justify-center mb-6 bg-white/5">
                <CloudIcon size={36} color="#fff" weight="fill" />
              </View>
              <Text className="font-semibold text-[30px] text-white tracking-tighter text-center">
                Reset Password
              </Text>
              <Text className="font-light text-white/70 mt-2 text-sm text-center px-4">
                Enter your email address and we'll send you instructions to
                reset your password.
              </Text>
            </View>

            {/* Reset Card */}
            <View style={styles.card}>
              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-xs font-medium text-white/50 mb-2 ml-1 tracking-widest">
                  EMAIL ADDRESS
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="your@sky.com"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                />
              </View>

              {/* Action Button */}
              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={loading}
                className="overflow-hidden mt-2 rounded-2xl"
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#135bec", "#4a8df8"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text className="font-semibold text-lg text-white tracking-wide">
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Back to Login link */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="items-center mt-8"
            >
              <Text className="text-white/60">
                Remember your password?{" "}
                <Text className="font-semibold text-white underline">
                  Back to Login
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  cloudDecor: {
    position: "absolute",
    width: 320,
    height: 320,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 9999,
    opacity: 0.4,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#fff",
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
});
