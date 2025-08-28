import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import CodeInput from "@/components/ui/CodeInput";
import PasswordInput from "@/components/ui/PasswordInput";
import Input from "@/components/ui/Input";
import SegmentedPicker from "@/components/ui/SegmentedPicker";
import CourseCard from "@/components/ui/CourseCard";

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
  const [q, setQ] = useState("");
  const [pwd, setPwd] = useState("");
  const invalid = pwd.length > 0 && pwd.length < 8;
  const [country, setCountry] = useState<string | undefined>();
  const [tab, setTab] = useState(0);
  const [progress, setProgress] = useState(0.45);

  const handleCardPress = () => console.log("Card pressed");

  // Correct keyboard offset (header or safe-area)
  const headerH = useHeaderHeight?.() ?? 0;
  const insets = useSafeAreaInsets();
  const keyboardOffset = headerH || insets.top || 0;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardOffset}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{
          padding: 16,
          gap: 16,
          paddingBottom: insets.bottom + 24, // leave space so last input isn't hidden
        }}
      >
        <UpgradePromoCard
          onPress={handleCardPress}
          closeSize="sm"
          durationOut={0}
          onDismiss={() => setShow(false)}
          title="Повече с Gold"
          subtitle="Отключи AI без ограничения и всички уроци."
          logoSource={require("../../assets/images/readu-logo-4.png")}
        />

        <Select
          options={countries}
          value={country}
          onChange={setCountry}
          placeholder="Select your country"
        />

        <CodeInput
          cells={6}
          charsPerCell={1}
          autoSize
          minCellSize={36}
          maxCellSize={64}
          minGap={6}
          maxGap={14}
          onFulfill={(code) => console.log("OTP:", code)}
        />

        <CodeInput cells={1} charsPerCell={3} autoSize={false} cellSize={50} gap={0} />

        {/* IMPORTANT: Don't use per-field avoidKeyboard when you already use a screen-level KAV */}
        <PasswordInput
          label="Парола"
          placeholder="Въведи парола"
          value={pwd}
          onChangeText={setPwd}
          error={invalid}
          helperText={invalid ? "Паролата трябва да е поне 8 символа." : undefined}
          returnKeyType="done"
          // avoidKeyboard={false} // default; ensure it's not enabled here
        />
        <SegmentedPicker
          segments={["Видео", "Упражнение"]}
          index={tab}
          onChange={(i) => {
            setTab(i);
            // switch page/content here
          }}
          size="md"
        />
        <CourseCard
        image={require("../../assets/images/readu-test-card.jpg")}
        title="научи английски"
        lessonsLabel="16 урока"
        progress={progress}          // <-- fully programmable
        // progressLabel="45%"       // custom label (optional)
        onPress={() => console.log("open course")}
      />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
