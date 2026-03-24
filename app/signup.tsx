import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("maintenance");
  const [employeeId, setEmployeeId] = useState("");
  const [shift, setShift] = useState<"morning" | "afternoon" | "evening">("morning");
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (role === "maintenance" && !employeeId) {
      Alert.alert("Error", "Employee ID is required for Maintenance users");
      return;
    }

    setIsLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await signup(
        {
          name,
          email,
          role,
          ...(role === "maintenance" && { employeeId, shift }),
        },
        password,
      );
      router.replace("/(tabs)");
    } catch (error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Sign Up Failed", error instanceof Error ? error.message : "Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <ScreenContainer containerClassName="bg-gradient-to-b from-primary to-secondary">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-white mb-1">Create Account</Text>
            <Text className="text-white opacity-90">Join SMARTSOAP Manager</Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-3xl p-6 shadow-lg mb-4">
            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Full Name</Text>
              <TextInput
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                placeholder="John Doe"
                placeholderTextColor="#9CA3AF"
                editable={!isLoading}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
              <TextInput
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                placeholder="john@school.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Password</Text>
              <TextInput
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                editable={!isLoading}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Confirm Password Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Confirm Password</Text>
              <TextInput
                className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                editable={!isLoading}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Role Selection */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Role</Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setRole("admin")}
                  disabled={isLoading}
                  style={{
                    backgroundColor: role === "admin" ? "#0A5BA8" : "#F5F7FA",
                    borderWidth: role === "admin" ? 0 : 1,
                    borderColor: "#E5E7EB",
                  }}
                  className="flex-1 rounded-lg py-2 items-center"
                >
                  <Text
                    className={`font-semibold ${role === "admin" ? "text-white" : "text-foreground"}`}
                  >
                    Admin
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setRole("maintenance")}
                  disabled={isLoading}
                  style={{
                    backgroundColor: role === "maintenance" ? "#0A5BA8" : "#F5F7FA",
                    borderWidth: role === "maintenance" ? 0 : 1,
                    borderColor: "#E5E7EB",
                  }}
                  className="flex-1 rounded-lg py-2 items-center"
                >
                  <Text
                    className={`font-semibold ${role === "maintenance" ? "text-white" : "text-foreground"}`}
                  >
                    Maintenance
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Maintenance-specific Fields */}
            {role === "maintenance" && (
              <>
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-foreground mb-2">Employee ID</Text>
                  <TextInput
                    className="bg-surface border border-border rounded-xl px-4 py-3 text-foreground"
                    placeholder="EMP001"
                    placeholderTextColor="#9CA3AF"
                    editable={!isLoading}
                    value={employeeId}
                    onChangeText={setEmployeeId}
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-sm font-semibold text-foreground mb-2">Shift Assignment</Text>
                  <View className="flex-row gap-2">
                    {(["morning", "afternoon", "evening"] as const).map((s) => (
                      <Pressable
                        key={s}
                        onPress={() => setShift(s)}
                        disabled={isLoading}
                        style={{
                          backgroundColor: shift === s ? "#0A5BA8" : "#F5F7FA",
                          borderWidth: shift === s ? 0 : 1,
                          borderColor: "#E5E7EB",
                        }}
                        className="flex-1 rounded-lg py-2 items-center"
                      >
                        <Text
                          className={`font-semibold text-xs ${shift === s ? "text-white" : "text-foreground"}`}
                        >
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </>
            )}

            {/* Sign Up Button */}
            <Pressable
              onPress={handleSignUp}
              disabled={isLoading}
              style={({ pressed }) => [
                {
                  backgroundColor: isLoading ? "#9CA3AF" : "#0A5BA8",
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                  opacity: isLoading ? 0.6 : 1,
                },
              ]}
              className="rounded-xl py-3 items-center mb-4"
            >
              <Text className="text-white font-bold text-lg">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </Pressable>

            {/* Back to Login Link */}
            <View className="flex-row items-center justify-center">
              <Text className="text-foreground">Already have an account? </Text>
              <Pressable onPress={handleBackToLogin} disabled={isLoading}>
                <Text className="text-primary font-semibold">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
