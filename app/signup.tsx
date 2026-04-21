import { useState } from "react";
import { ScrollView, Text, View, TextInput, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useFirebaseAuth, type UserRole } from "@/lib/firebase-auth-context";
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
  const { signUp } = useFirebaseAuth();
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
      await signUp(email, password, {
        fullName: name,
        role,
        employeeId: role === "maintenance" ? employeeId : undefined,
        shiftAssignment: role === "maintenance" ? (shift.charAt(0).toUpperCase() + shift.slice(1) as "Morning" | "Afternoon" | "Evening") : undefined,
      });
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
    <ScreenContainer containerClassName="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-foreground mb-1">Create Account</Text>
            <Text className="text-muted">Join SMARTSOAP Manager</Text>
          </View>

          {/* Form Card */}
          <View className="bg-surface rounded-3xl p-6 shadow-lg mb-4 border border-border">
            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Full Name</Text>
              <TextInput
                className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
                placeholder="John Doe"
                placeholderTextColor="#CBD5E1"
                editable={!isLoading}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-sm font-semibold text-foreground mb-2">Email</Text>
              <TextInput
                className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
                placeholder="john@school.com"
                placeholderTextColor="#CBD5E1"
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
                className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
                placeholder="••••••••"
                placeholderTextColor="#CBD5E1"
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
                className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
                placeholder="••••••••"
                placeholderTextColor="#CBD5E1"
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
                    backgroundColor: role === "admin" ? "#0A5BA8" : "rgba(10, 91, 168, 0.2)",
                    borderWidth: 1,
                    borderColor: role === "admin" ? "#0A5BA8" : "#2D5A8C",
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
                    backgroundColor: role === "maintenance" ? "#0A5BA8" : "rgba(10, 91, 168, 0.2)",
                    borderWidth: 1,
                    borderColor: role === "maintenance" ? "#0A5BA8" : "#2D5A8C",
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
                    className="bg-primary bg-opacity-20 border border-primary border-opacity-40 rounded-xl px-4 py-3 text-foreground"
                    placeholder="EMP001"
                    placeholderTextColor="#CBD5E1"
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
                          backgroundColor: shift === s ? "#0A5BA8" : "rgba(10, 91, 168, 0.2)",
                          borderWidth: 1,
                          borderColor: shift === s ? "#0A5BA8" : "#2D5A8C",
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
                  backgroundColor: isLoading ? "#6B7280" : "#0A5BA8",
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
