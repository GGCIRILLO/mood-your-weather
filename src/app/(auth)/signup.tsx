// ============================================
// SIGNUP SCREEN
// ============================================

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
import { CloudIcon, EyeIcon, EyeSlashIcon } from "phosphor-react-native";
import { signUp } from "@/services/auth.service";

export default function SignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Errore", "Compila tutti i campi");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Errore", "La password deve essere di almeno 6 caratteri");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Errore", "Le password non corrispondono");
      return;
    }

    setLoading(true);
    const response = await signUp(email, password, name);
    setLoading(false);

    if (response.success) {
      router.replace("/(tabs)/");
    } else {
      Alert.alert("Errore", response.error || "Registrazione fallita");
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
      <View
        style={[
          styles.cloudDecor,
          { bottom: 0, left: 40, width: 256, height: 256, opacity: 0.2 },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Status Bar Padding */}
          <View style={{ height: insets.top }} />

          <View className="flex-1 px-8 pt-24 pb-12">
            {/* Branding Header */}
            <View className="items-center mb-8">
              <View className="rounded-full border-2 border-white/30 p-4 items-center justify-center mb-6 bg-white/5">
                <CloudIcon size={36} color="#fff" weight="fill" />
              </View>
              <Text className="font-semibold text-[30px] text-white tracking-tighter">
                Mood Your Weather
              </Text>
              <Text className="font-light text-white/70 mt-2 text-sm">
                Aligning your emotional horizon
              </Text>
            </View>

            {/* Signup Card */}
            <View style={[styles.card, { marginTop: "auto" }]}>
              {/* Name Input */}
              <View className="mb-6">
                <Text className="text-xs font-medium text-white/50 mb-2 ml-1 tracking-widest">
                  FULL NAME
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoComplete="name"
                  autoCorrect={false}
                />
              </View>

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

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-xs font-medium text-white/50 mb-2 ml-1 tracking-widest">
                  PASSWORD
                </Text>
                <View className="relative">
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeIcon size={20} color="rgba(255,255,255,0.6)" />
                    ) : (
                      <EyeSlashIcon size={20} color="rgba(255,255,255,0.6)" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Input */}
              <View className="mb-4">
                <Text className="text-xs font-medium text-white/50 mb-2 ml-1 tracking-widest">
                  CONFIRM PASSWORD
                </Text>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect={false}
                />
              </View>

              {/* create account Button */}
              <TouchableOpacity
                onPress={handleSignup}
                disabled={loading}
                className="overflow-hidden mt-4 rounded-2xl"
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#135bec", "#4a8df8"]}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text className="font-semibold text-lg text-white tracking-wide">
                    {loading ? "Loading..." : "Create Account"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Footer Actions */}
            <View className="items-center mt-8">
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-white/60">
                  Already have an account?{" "}
                  <Text className="font-semibold text-white underline">
                    Log In
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
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
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
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
