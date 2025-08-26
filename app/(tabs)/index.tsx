import React, { useState } from "react";
import { ScrollView } from "react-native";
import SecondaryButton, { GoogleLogo24 } from "@/components/ui/SecondaryButton";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Colors } from "@/constants/Colors";
import TertiaryButton from "@/components/ui/TertiaryButton";
import ThreeDotsMenu, { ThreeDotsMenuItem } from "@/components/ui/ThreeDotsMenu";
import SettingsMobileButton from "@/components/ui/SettingsMobileButton";
import CloseButton from "@/components/ui/CloseButton";
import UpgradePromoCard from "@/components/ui/UpgradePromoCard";
import Checkbox from "@/components/ui/Checkbox";
import Select, { SelectOption } from "@/components/ui/Select";

const countries: SelectOption[] = [
  { key: "ro", label: "Romania" },
  { key: "bg", label: "Bulgaria" },
  { key: "fr", label: "France" },
  { key: "es", label: "Spain" },
  { key: "de", label: "Germany" },
  { key: "dk", label: "Denmark" },
];


export default function AuthButtons() {
  const [show, setShow] = useState(true);
  const [country, setCountry] = useState<string | undefined>();
  
  const items: ThreeDotsMenuItem[] = [
    { key: "default", label: "Set as default", onPress: () => console.log("default") },
    { key: "delete", label: "Delete", destructive: true, onPress: () => console.log("delete") },
  ];

  const handleCardPress = () => {
    console.log("Card pressed");
  };

  return (
    <ScrollView style={{ gap: 12, padding: 16, backgroundColor: Colors.background }}>
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
      <SettingsMobileButton label="Privacy & Security" onPress={() => {}} multiline />
      <CloseButton size="md" onPress={() => {}} />
      <UpgradePromoCard
        onPress={handleCardPress}
        closeSize="sm"
        durationOut={0}
        onDismiss={() => setShow(false)}
        title="Повече с Gold"
        subtitle="Отключи AI без ограничения и всички уроци."
        logoSource={require("../../assets/images/readu-logo-4.png")}
      />
      <Checkbox label="Запомни ме" defaultChecked size="sm" />

      <Select
        options={countries}
        value={country}
        onChange={setCountry}
        placeholder="Select your country"
      />

    </ScrollView>
  );
}
