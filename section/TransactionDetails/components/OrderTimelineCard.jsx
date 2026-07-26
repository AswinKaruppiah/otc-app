import { useState } from "react";
import { View, Text, Pressable, Image, Platform, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import * as FileSystem from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { formatDate } from "../../../utils/helper";
import { getOrderStatusStyle } from "../../../utils/constants";
import { haptic } from "../../../utils/haptics";

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

const resolveNumber = (value) => {
  if (typeof value === "number") return value;
  if (typeof value === "object" && value !== null && "$numberDecimal" in value) {
    return Number(value.$numberDecimal);
  }
  return 0;
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

            // Circle Icon and styles
            let iconName = "clock";
            let circleBg = "bg-white/5 border border-white/20";
            let iconColor = "rgba(255, 255, 255, 0.4)";
            let titleColor = "text-gray-400";
            let lineColor = "bg-white/10";

            if (state === "completed") {
              iconName = "check";
              circleBg = "bg-noirMint/10 border border-noirMint";
              iconColor = "#baffd8";
              titleColor = "text-noirMint";
              lineColor = "bg-noirMint/40";
            } else if (state === "active") {
              iconName = "loader";
              circleBg = "bg-noirMint/10 border border-noirMint";
              iconColor = "#baffd8";
              titleColor = "text-white";
              lineColor = "bg-white/10";
            } else if (state === "rejected") {
              iconName = "x";
              circleBg = "bg-red-500/10 border border-red-500/40";
              iconColor = "#ef4444";
              titleColor = "text-red-400";
              lineColor = "bg-red-500/30";
            }

            return (
              <View key={step.key} className="relative flex-row items-start gap-4">
                {/* Connecting Line */}
                {!isLast && (
                  <View
                    className={`absolute left-[15px] top-8 bottom-[-24px] w-px ${lineColor}`}
                  />
                )}

                {/* Circle Icon Indicator */}
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${circleBg} z-10`}
                >
                  <Feather name={iconName} size={15} color={iconColor} />
                </View>

                {/* Right Content */}
                <View className="flex-1">
                  <Pressable
                    disabled={!step.isVerifyStage}
                    onPress={() => {
                      if (step.isVerifyStage) {
                        haptic.light();
                        setDropdownOpen((v) => !v);
                      }
                    }}
                  >
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="flex-1">
                        <Text className={`font-noir-medium text-sm font-semibold ${titleColor}`}>
                          {step.title}
                        </Text>
                        <Text className="text-xs text-gray-400 font-noir mt-0.5 leading-normal">
                          {step.subtitle}
                        </Text>
                      </View>

                      <View className="items-end gap-1">
                        {historyItem?.createdAt && (
                          <Text className="text-[10px] text-gray-500 font-noir">
                            {formatDate(historyItem.createdAt)}
                          </Text>
                        )}

                        {/* Completed count badge & dropdown chevron for Payment Verified stage */}
                        {step.isVerifyStage && totalTransactions > 0 && (
                          <View className="flex-row items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md mt-1">
                            <Text className="text-[10px] font-noir-medium text-noirMint font-bold">
                              {checkedTransactions} / {totalTransactions} completed
                            </Text>
                            <Feather
                              name={dropdownOpen ? "chevron-up" : "chevron-down"}
                              size={12}
                              color="#baffd8"
                            />
                          </View>
                        )}
                      </View>
                    </View>
                  </Pressable>

                  {/* Expandable Dropdown Content for Payment Proofs */}
                  {step.isVerifyStage && dropdownOpen && payments.length > 0 && (
                    <View className="mt-3 gap-2">
                      {payments.map((p, pIdx) => {
                        const pStatusStyle = getOrderStatusStyle(p.status);
                        const pAmount = resolveNumber(p.amount);
                        return (
                          <View
                            key={p.id || pIdx}
                            className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 gap-2"
                          >
                            <View className="flex-row items-center gap-3">
                              {/* Payment Proof Thumbnail with Native Preview */}
                              {p.screenshotUrl ? (
                                <Pressable
                                  onPress={() => handleNativeImagePreview(p.screenshotUrl)}
                                  className="relative rounded-lg overflow-hidden border border-white/10 shrink-0 active:opacity-80"
                                >
                                  <Image
                                    source={{ uri: p.screenshotUrl }}
                                    style={{ width: 48, height: 48, borderRadius: 8 }}
                                    resizeMode="cover"
                                  />
                                  <View className="absolute inset-0 bg-black/30 items-center justify-center">
                                    <Feather name="maximize-2" size={12} color="#ffffff" />
                                  </View>
                                </Pressable>
                              ) : (
                                <View className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 items-center justify-center shrink-0">
                                  <Feather name="file-text" size={20} color="rgba(255, 255, 255, 0.4)" />
                                </View>
                              )}

                              {/* Title, Status & Amount */}
                              <View className="flex-1 min-w-0 gap-0.5">
                                <View className="flex-row items-center justify-between">
                                  <Text className="text-white font-noir-medium text-xs font-semibold flex-1 mr-2" numberOfLines={1}>
                                    {p.title || `Payment #${(p.paymentIndex ?? pIdx) + 1}`}
                                  </Text>
                                  <View
                                    className="rounded-full px-2 py-0.5 shrink-0"
                                    style={{ backgroundColor: pStatusStyle.bg }}
                                  >
                                    <Text
                                      className="text-[10px] font-noir-medium font-semibold"
                                      style={{ color: pStatusStyle.color }}
                                    >
                                      {pStatusStyle.label}
                                    </Text>
                                  </View>
                                </View>

                                <Text className="text-white font-noir-medium text-xs font-bold mt-0.5">
                                  ₹{pAmount.toLocaleString("en-IN")}
                                </Text>
                                <Text className="text-gray-400 font-noir text-[11px]" numberOfLines={1}>
                                  UTR: {p.utr || "N/A"}
                                </Text>
                              </View>
                            </View>

                            {/* Rejection Reason Banner */}
                            {p.rejectionReason && (
                              <View className="mt-1 flex-row items-center gap-1.5 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                                <Feather name="info" size={12} color="#ef4444" />
                                <Text className="text-red-400 font-noir text-[11px] flex-1">
                                  {p.rejectionReason}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </LinearGradient>

      {/* In-App Fullscreen Fallback Image Modal */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View className="flex-1 bg-black/90 items-center justify-center p-4 relative">
          <Pressable
            onPress={() => setSelectedImage(null)}
            className="absolute top-12 right-6 z-50 p-3 rounded-full bg-white/10 border border-white/20 active:bg-white/20"
          >
            <Feather name="x" size={22} color="#ffffff" />
          </Pressable>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: "100%", height: "80%", borderRadius: 16 }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};
