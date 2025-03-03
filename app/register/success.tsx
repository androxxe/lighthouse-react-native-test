import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import twrnc from "twrnc";

const OtpField = ({ value }: { value: string | null }) => {
  const { width } = useWindowDimensions();

  return (
    <ThemedView
      style={twrnc`w-[${width / 5}px] h-[${width / 5}px] bg-slate-100 rounded-lg items-centerj justify-center`}
    >
      <ThemedText variant="extra-larger" fontWeight="bold" textAlign="center" style={twrnc`w-full`}>
        {value}
      </ThemedText>
    </ThemedView>
  );
};

export default function RegisterSuccessScreen() {
  const [otp, setOtp] = useState<string[]>([]);

  const generateOtp = () => {
    // generate random otp 4 digit, and 1 by one set to setOtp
    const randomNumber = Math.floor(Math.random() * 10000)
      .toString()
      .slice(-4)
      .toString()
      .slice(-4);

    setTimeout(() => {
      randomNumber.split("").forEach((digit, index) => {
        setTimeout(() => {
          setOtp((prev) => [...prev, digit]);
        }, index * 500);
      });
    }, 1000);
  };

  useEffect(() => {
    generateOtp();
  }, []);

  useEffect(() => {
    if (otp?.length === 4) {
      Toast.show({
        text1: "Registrasi berhasil",
        text2: "Silahkan login menggunakan email dan password yang kamu buat",
        type: "success",
      });
      router.replace("/");
    }
  }, [otp]);

  return (
    <SafeAreaView style={twrnc`flex-1 p-4 flex items-center justify-center bg-white`}>
      <ThemedText textAlign="center" fontWeight="bold" variant="large" color="slate-700" style={twrnc`mt-4 mb-6`}>
        Verifikasi OTP
      </ThemedText>
      <ThemedView style={twrnc`w-full flex-row items-center justify-center gap-3`}>
        <OtpField value={otp?.[0] ?? null} />
        <OtpField value={otp?.[1] ?? null} />
        <OtpField value={otp?.[2] ?? null} />
        <OtpField value={otp?.[3] ?? null} />
      </ThemedView>
    </SafeAreaView>
  );
}
