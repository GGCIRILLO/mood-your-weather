import { View, Text, Pressable } from "react-native";
import {
  DownloadSimple,
  SignOut,
  CaretRight,
  Trash,
} from "phosphor-react-native";

interface DataPrivacyProps {
  isExporting: boolean;
  isDeleting?: boolean;
  onExportData: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const DataPrivacy = ({
  isExporting,
  isDeleting,
  onExportData,
  onLogout,
  onDeleteAccount,
}: DataPrivacyProps) => {
  return (
    <View style={{ marginBottom: 40 }}>
      <Text
        style={{
          color: "#94a3b8",
          fontSize: 12,
          fontWeight: "bold",
          textTransform: "uppercase",
          paddingHorizontal: 24,
          marginBottom: 12,
          letterSpacing: 1,
        }}
      >
        Data & Privacy
      </Text>
      <View
        style={{
          backgroundColor: "#192233",
          marginHorizontal: 16,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: "#1e293b",
          overflow: "hidden",
        }}
      >
        <Pressable
          onPress={onExportData}
          disabled={isExporting}
          style={{
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#1e293b",
            opacity: isExporting ? 0.5 : 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <DownloadSimple size={24} color="#94a3b8" />
            <Text style={{ color: "white", fontSize: 16, fontWeight: "500" }}>
              {isExporting ? "Exporting..." : "Export All Data"}
            </Text>
          </View>
          <CaretRight size={16} color="#94a3b8" />
        </Pressable>

        <Pressable
          onPress={onLogout}
          style={{
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#1e293b",
          }}
        >
          <SignOut size={24} color="#ef4444" weight="fill" />
          <Text style={{ color: "#ef4444", fontSize: 16, fontWeight: "500" }}>
            Log Out
          </Text>
        </Pressable>

        <Pressable
          onPress={onDeleteAccount}
          disabled={isDeleting}
          style={{
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            opacity: isDeleting ? 0.5 : 1,
          }}
        >
          <Trash size={24} color="#ef4444" />
          <Text style={{ color: "#ef4444", fontSize: 16, fontWeight: "500" }}>
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
