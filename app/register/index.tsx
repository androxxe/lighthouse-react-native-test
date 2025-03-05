import { ThemedText } from "@/components/ui/ThemedText";
import { Button } from "@/components/ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import twrnc from "twrnc";
import { InputText } from "@/components/ui/InputText";
import * as yup from "yup";
import { useFormik } from "formik";
import { TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { registerSchema } from "@/yup-schemas/register";
import { usePostRegister } from "@/hooks/endpoints/usePostRegister";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const { mutate: register, isPending } = usePostRegister({
    onSuccess: () => {
      router.replace("/register/success");
    },
    onError: (error) => {
      Toast.show({
        text1: "Terjadi kesalahan",
        text2: error.response?.data?.message,
        type: "error",
      });
    },
  });

  const formik = useFormik<yup.InferType<typeof registerSchema>>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      register(values);
    },
  });

  return (
    <SafeAreaView style={twrnc`flex-1`}>
      <ThemedView style={twrnc`flex-1 items-center justify-center flex-col flex-`}>
        <ThemedText variant="extra-large" fontWeight="bold">
          Register
        </ThemedText>
        <ThemedText variant="large" color="slate-700" style={twrnc`mt-4 mb-6`}>
          Silahkan isi formulir register.
        </ThemedText>
        <View style={twrnc`gap-y-6 w-full px-4`}>
          <InputText
            value={formik.values.name}
            onChangeText={(value) => formik.setFieldValue("name", value)}
            error={formik.touched?.name && formik.errors?.name}
            label="Nama Lengkap"
            placeholder="Masukkan nama"
          />
          <InputText
            value={formik.values.email}
            onChangeText={(value) => formik.setFieldValue("email", value)}
            error={formik.touched?.email && formik.errors?.email}
            label="Email"
            placeholder="Masukkan"
          />
          <InputText
            value={formik.values.password}
            onChangeText={(value) => formik.setFieldValue("password", value)}
            error={formik.touched?.password && formik.errors?.password}
            label="Password"
            isSecureTextEntry
          />
          <InputText
            value={formik.values.password_confirmation}
            onChangeText={(value) => formik.setFieldValue("password_confirmation", value)}
            error={formik.touched?.password_confirmation && formik.errors?.password_confirmation}
            label="Konfirmasi Password"
            isSecureTextEntry
          />
          <Button
            variant="background"
            label="Register"
            onPress={formik.handleSubmit}
            isLoading={isPending}
            disabled={isPending}
          />
          <TouchableOpacity onPress={() => router.back()}>
            <ThemedText variant="medium" textAlign="center" color="purple-700" style={[twrnc`mt-4 underline`]}>
              Kembali ke Halaman Login
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
