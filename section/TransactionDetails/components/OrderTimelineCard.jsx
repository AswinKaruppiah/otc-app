import { useState } from "react";
import { View, Text, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { haptic } from "../../../utils/haptics";
import { TimelineStepItem } from "./timeline/TimelineStepItem";
import { ImagePreviewModal } from "../../../components/modal/ImagePreviewModal";

export const TIMELINE_CONFIG = [
  {
    key: "created",
    title: "Transaction Created",
    subtitle: "Order initiated",
  },
  {
    key: "payment_verified",
    title: "Payment Verified",
    subtitle: "Payment proof verified by Admin",
    isVerifyStage: true,
  },
  {
    key: "approved",
    title: "Crypto Conversion Started",
    subtitle: "Transaction being processed on blockchain",
  },
  {
    key: "completed",
    title: "Completed",
    subtitle: "Funds successfully transferred",
  },
  {
    key: "rejected",
    title: "Transaction Rejected",
    subtitle: "Order has been rejected",
  },
];

const normalizeStatus = (status) => {
  if (status === "payment_submitted") return "payment_verified";
  return status;
};

export const OrderTimelineCard = ({ history = [], payments = [] }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const historyStatuses = (history || []).map((h) => normalizeStatus(h.toStatus));
  const lastStatus = historyStatuses.at(-1) || "created";

  const failedAfterStatus =
    lastStatus === "rejected"
      ? historyStatuses[historyStatuses.length - 2]
      : null;

  const failedAfterIndex = failedAfterStatus
    ? TIMELINE_CONFIG.findIndex((s) => s.key === failedAfterStatus)
    : -1;

  let visibleTimeline = [...TIMELINE_CONFIG];
  if (lastStatus === "rejected" && failedAfterIndex !== -1) {
    visibleTimeline = [
      ...TIMELINE_CONFIG.slice(0, failedAfterIndex + 1),
      TIMELINE_CONFIG.find((s) => s.key === "rejected"),
    ].filter(Boolean);
  } else {
    visibleTimeline = TIMELINE_CONFIG.slice(0, TIMELINE_CONFIG.length - 1);
  }

  const isTerminal = lastStatus === "completed" || lastStatus === "rejected";
  const totalTransactions = payments?.length || 0;
  const checkedTransactions = (payments || []).filter(
    (p) => p?.status === "verified" || p?.status === "rejected"
  ).length;

  const handleNativeImagePreview = async (url) => {
    if (!url) return;
    haptic.light();

    const cleanUrl = url.split("?")[0].toLowerCase();
    let ext = ".jpg";
    let mimeType = "image/jpeg";

    if (cleanUrl.endsWith(".png")) {
      ext = ".png";
      mimeType = "image/png";
    } else if (cleanUrl.endsWith(".pdf")) {
      ext = ".pdf";
      mimeType = "application/pdf";
    } else if (cleanUrl.endsWith(".webp")) {
      ext = ".webp";
      mimeType = "image/webp";
    }

    try {
      let localUri = url;
      if (url.startsWith("http://") || url.startsWith("https://")) {
        const cacheFile = `${FileSystem.cacheDirectory}proof_${Date.now()}${ext}`;
        const downloadResult = await FileSystem.downloadAsync(url, cacheFile);
        localUri = downloadResult.uri;
      }

      if (Platform.OS === "android") {
        try {
          let contentUri = localUri;
          if (localUri.startsWith("file://")) {
            contentUri = await FileSystem.getContentUriAsync(localUri);
          }
          await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            data: contentUri,
            flags: 1, // Intent.FLAG_GRANT_READ_URI_PERMISSION
            type: mimeType,
          });
          return;
        } catch (intentErr) {
          console.warn("IntentLauncher error, trying Sharing:", intentErr);
        }
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(localUri, { mimeType, dialogTitle: "Payment Proof" });
      } else {
        setSelectedImage(url);
      }
    } catch (error) {
      console.error("Native preview error:", error);
      setSelectedImage(url);
    }
  };

  return (
    <View>
      <View className="pl-1 mb-3">
        <Text className="text-gray-400 font-noir-medium text-sm tracking-wider uppercase">
          Transaction Timeline
        </Text>
      </View>

      <LinearGradient
        colors={["rgba(255,255,255,0.08)", "rgba(255,255,255,0.02)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ borderRadius: 16, padding: 1 }}
      >
        <View className="bg-[#060E0B] rounded-[15px] p-5 gap-6">
          {visibleTimeline.map((step, index) => {
            const isLast = index === visibleTimeline.length - 1;
            const historyItem = (history || []).find(
              (h) => normalizeStatus(h.toStatus) === step.key
            );

            let state = "pending";
            if (historyStatuses.includes(step.key)) {
              state = "completed";
            }
            if (!isTerminal && step.key === lastStatus) {
              state = "active";
            }
            if (step.key === "rejected" && lastStatus === "rejected") {
              state = "rejected";
            }

            return (
              <TimelineStepItem
                key={step.key}
                step={step}
                isLast={isLast}
                state={state}
                historyItem={historyItem}
                payments={payments}
                totalTransactions={totalTransactions}
                checkedTransactions={checkedTransactions}
                dropdownOpen={dropdownOpen}
                onToggleDropdown={() => setDropdownOpen((v) => !v)}
                onPreviewImage={handleNativeImagePreview}
              />
            );
          })}
        </View>
      </LinearGradient>

      {/* In-App Fullscreen Fallback Image Modal */}
      <ImagePreviewModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </View>
  );
};
