import { Platform } from "react-native";

type Shadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation?: number; // Android
};

export const Elevation: Record<string, Shadow> = {
  navbar: {
    shadowColor: "#777777",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    ...(Platform.OS === "android" ? { elevation: 4 } : {}),
  },
  courseCard: {
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    ...(Platform.OS === "android" ? { elevation: 6 } : {}),
  },
};
