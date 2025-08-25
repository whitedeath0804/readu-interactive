import { View, Text } from "react-native";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Typo } from "@/constants/Typography";
import { Colors } from "@/constants/Colors";

export default function Demo() {
  return (
    <View style={{ gap: 16, padding: 16, backgroundColor: Colors.background }}>
      {/* default: selection haptic on pressIn */}
      <PrimaryButton label="Продължи" onPress={() => {}} />

      {/* heavy impact on actual press */}
      <PrimaryButton
        label="Запази"
        haptics="heavy"
        hapticsOn="press"
        onPress={() => {}}
        fullWidth
      />

      {/* success notification on long press */}
      <PrimaryButton
        haptics="success"
        hapticsOn="longPress"
        onLongPress={() => {}}
      >
        <Text style={[Typo.body2, { color: Colors.text }]}>Двуреден</Text>
      </PrimaryButton>

      {/* disabled — no haptics */}
      <PrimaryButton label="Изпращане" disabled />
    </View>
  );
}
