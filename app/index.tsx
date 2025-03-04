import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import twrnc from "twrnc";
import { InputText } from "@/components/ui/InputText";
import * as yup from "yup";
import { useFormik } from "formik";
import { View } from "react-native";
import { router } from "expo-router";
import { usePostLogin } from "@/hooks/endpoints/usePostLogin";
import { useGetProfile } from "@/hooks/endpoints/useGetProfile";
import { useEffect } from "react";
import { useUserStore } from "@/hooks/stores/useUserStore";
import Toast from "react-native-toast-message";

const loginSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginScreen() {
  const { setUser, setToken } = useUserStore();

  const formik = useFormik<yup.InferType<typeof loginSchema>>({
    initialValues: {
      email: __DEV__ ? "andriopratama16@gmail.com" : "",
      password: __DEV__ ? "P@ssword123" : "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => login(values),
  });

  const { mutate: login, isPending } = usePostLogin({
    onSuccess: (data) => {
      setToken(data.data.access_token);
      getProfile();
    },
    onError: (error) => {
      Toast.show({
        text1: "Gagal Login",
        text2: error.response?.data?.message,
        type: "error",
      });
    },
  });

  const {
    data: user,
    refetch: getProfile,
    isLoading,
    isSuccess,
  } = useGetProfile({
    enabled: false,
  });

  useEffect(() => {
    if (isSuccess && user.data) {
      setUser(user.data.user);
      router.replace("/(home)/today");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, user?.data.user]);

  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <ThemedView style={twrnc`flex-1 items-center justify-center flex-col flex-`}>
        <ThemedText variant="extra-large" fontWeight="bold">
          Login
        </ThemedText>
        <ThemedText variant="large" color="slate-700" style={twrnc`mt-4 mb-6`}>
          Silahkan masuk dengan akun yang terdaftar.
        </ThemedText>
        <View style={twrnc`gap-y-6 w-full px-4`}>
          <InputText
            value={formik.values.email}
            onChangeText={(value) => formik.setFieldValue("email", value)}
            error={formik.touched?.email && formik.errors?.email}
            label="Email"
            placeholder="Masukkan email"
          />
          <InputText
            value={formik.values.password}
            onChangeText={(value) => formik.setFieldValue("password", value)}
            error={formik.touched?.password && formik.errors?.password}
            label="Password"
            placeholder="Masukkan password"
            isSecureTextEntry
          />
          <Button
            variant="background"
            label="Login"
            onPress={formik.handleSubmit}
            isLoading={isPending || isLoading}
            disabled={isPending || isLoading}
          />
          <Button variant="secondary" label="Register Akun" onPress={() => router.navigate("/register")} />
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
