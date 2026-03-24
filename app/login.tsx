import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Login Failed", error instanceof Error ? error.message : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 py-8">
          {/* Logo/Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
              <Text className="text-4xl">🧼</Text>
            </View>
            <Text className="text-4xl font-bold text-foreground mb-2">SMARTSOAP</Text>
            <Text className="text-lg text-muted">Dispenser Manager</Text>
          </View>

          {/* Form Card */}
          <View className="bg-surface rounded-3xl p-6 shadow-lg mb-6 border border-border">
            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
              <TextInput
                className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
                placeholder="admin@school.com"
                placeholderTextColor="#CBD5E1"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                value={email}
                onChangeText={setEmail}
              />
              <Text className="text-xs text-muted mt-1">Try: admin@school.com or maintenance@school.com</Text>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-foreground mb-2">Password</Text>
              <TextInput
                className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
                placeholder="••••••••"
                placeholderTextColor="#CBD5E1"
                secureTextEntry
                editable={!isLoading}
                value={password}
                onChangeText={setPassword}
              />
              <Text className="text-xs text-muted mt-1">Try: admin123 or maint123</Text>
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              style={({ pressed }) => [
                {
                  backgroundColor: isLoading ? "#6B7280" : "#0A5BA8",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: isLoading ? 0.6 : 1,
                },
              ]}
              className="rounded-xl py-3 items-center mb-4"
            >
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Signing In..." : "Sign In"}
              </Text>
            </Pressable>

            {/* Sign Up Link */}
            <View className="flex-row items-center justify-center">
              <Text className="text-foreground">Don't have an account? </Text>
              <Pressable onPress={handleSignUp} disabled={isLoading}>
                <Text className="text-primary font-semibold">Sign Up</Text>
              </Pressable>
            </View>
          </View>

          {/* Demo Info */}
          <View className="bg-surface bg-opacity-50 rounded-2xl p-4 border border-border">
            <Text className="text-foreground text-xs font-semibold mb-2">📝 Demo Credentials</Text>
            <Text className="text-muted text-xs mb-1">Admin: admin@school.com / admin123</Text>
            <Text className="text-muted text-xs">Maintenance: maintenance@school.com / maint123</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
