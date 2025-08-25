import React from "react";
import { View } from "react-native";
import SecondaryButton, { GoogleLogo24 } from "@/components/ui/SecondaryButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Colors } from "@/constants/Colors";
import TertiaryButton from "@/components/ui/TertiaryButton";
import ThreeDotsMenu, { ThreeDotsMenuItem } from "@/components/ui/ThreeDotsMenu";



export default function AuthButtons() {
  const items: ThreeDotsMenuItem[] = [
    { key: "default", label: "Set as default", onPress: () => console.log("default") },
    { key: "delete", label: "Delete", destructive: true, onPress: () => console.log("delete") },
  ];
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

       <TertiaryButton size="sm" label="По-голям текст" onPress={() => {}} />

      <PrimaryButton label="Вход" fullWidth />
      <ThreeDotsMenu items={items} placement="bottom-right" />
    </View>
  );
}
