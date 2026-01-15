// ============================================
// SIGNUP SCREEN
// ============================================

import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { mockAuthService } from "@/services/mock-auth";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!name) {
      newErrors.name = "Nome obbligatorio";
    } else if (name.length < 2) {
      newErrors.name = "Nome troppo corto";
    }

    if (!email) {
      newErrors.email = "Email obbligatoria";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email non valida";
    }

    if (!password) {
      newErrors.password = "Password obbligatoria";
    } else if (password.length < 6) {
      newErrors.password = "Password minimo 6 caratteri";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Conferma password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Le password non corrispondono";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const response = await mockAuthService.signup(email, password, name);
    setLoading(false);

    if (response.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Errore", response.error?.message || "Registrazione fallita");
    }
  };

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    setLoading(true);
    const response = await mockAuthService.socialSignIn(provider);
    setLoading(false);

    if (response.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert("Errore", "Sign-in fallito");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 py-12">
            {/* Header */}
            <View className="items-center mb-8">
              <Text className="text-6xl mb-4">🌈</Text>
              <Text className="text-white text-3xl font-bold">
                Crea Account
              </Text>
              <Text className="text-blue-100 text-base mt-2">
                Inizia a tracciare il tuo mood oggi
              </Text>
            </View>

            {/* Signup Form */}
            <View className="gap-4">
              <Input
                label="Nome"
                placeholder="Il tuo nome"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
                leftIcon="👤"
                error={errors.name}
              />

              <Input
                label="Email"
                placeholder="tuo@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon="📧"
                error={errors.email}
              />

              <Input
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="password-new"
                leftIcon="🔒"
                rightIcon={showPassword ? "👁️" : "🙈"}
                onRightIconPress={() => setShowPassword(!showPassword)}
                error={errors.password}
              />

              <Input
                label="Conferma Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                leftIcon="🔒"
                error={errors.confirmPassword}
              />

              {/* Sign Up Button */}
              <Button
                title="Crea Account"
                onPress={handleSignup}
                loading={loading}
                size="lg"
              />

              {/* Divider */}
              <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-blue-300" />
                <Text className="text-blue-100 mx-4">oppure</Text>
                <View className="flex-1 h-px bg-blue-300" />
              </View>

              {/* Social Sign-In */}
              <Button
                title="Continua con Google"
                variant="outline"
                leftIcon="🔍"
                onPress={() => handleSocialSignIn("google")}
                disabled={loading}
              />

              <Button
                title="Continua con Apple"
                variant="outline"
                leftIcon="🍎"
                onPress={() => handleSocialSignIn("apple")}
                disabled={loading}
              />
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-blue-100">Hai già un account? </Text>
              <Pressable onPress={() => router.back()}>
                <Text className="text-white font-bold">Accedi</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
