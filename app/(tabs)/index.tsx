import React from "react";
import { View } from "react-native";
import SecondaryButton, { GoogleLogo24 } from "@/components/ui/SecondaryButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Colors } from "@/constants/Colors";



export default function AuthButtons() {
  return (
    <View style={{ gap: 12, padding: 16, backgroundColor: Colors.background }}>
      {/* One-line; shrinks slightly if needed */}
      <PrimaryButton
        icon={<GoogleLogo24 />}
        label="продължи"
        fullWidth
      />

      {/* Guaranteed full visibility via wrap (auto height) */}
      <SecondaryButton
        icon={<GoogleLogo24 />}
        label="продължи с Google"
        fullWidth
        multiline
        onPress={() => {console.log("Pressed")}}
      />

      <SecondaryButton
        icon={<GoogleLogo24 />}
        label="продължи с Google"
        fullWidth
        multiline
        loading
      />

      <PrimaryButton label="Вход" fullWidth />
    </View>
  );
}
